import { getLogger } from '@/lib/utils'
import { defaultSessionsForCN, defaultSessionsForEN } from '@/packages/initial_data'
import platform from '@/platform'
import storage from '@/storage'
import { StorageKey, StorageKeyGenerator } from '@/storage/StoreStorage'
import { getMessageText, migrateMessage } from '@/utils/message'
import { arrayMove } from '@dnd-kit/sortable'
import { getDefaultStore } from 'jotai'
import { omit, pick } from 'lodash'
import { copyMessage, copyThreads, Message, Session, SessionMeta } from 'src/shared/types'
import { v4 as uuidv4 } from 'uuid'
import { migrateSession, sortSessions } from '../utils/session-utils'
import * as atoms from './atoms'
import { createSessionAtom } from './atoms'

const log = getLogger('sessionStorageMutations')

// session 的读写都放到这里，统一管理

export function getSession(sessionId: string) {
  const store = getDefaultStore()
  const sessionAtom = createSessionAtom(sessionId)
  const session = store.get(sessionAtom)
  if (!session) {
    return null
  }
  return migrateSession(session)
}

export async function createSession(session: Omit<Session, 'id'>, previousId?: string) {
  const store = getDefaultStore()
  const chatSessionSettings = store.get(atoms.chatSessionSettingsAtom)
  const pictureSessionSettings = store.get(atoms.pictureSessionSettingsAtom)
  const s = {
    ...session,
    id: uuidv4(),
    settings: {
      ...(session.type === 'picture' ? pictureSessionSettings : chatSessionSettings),
      ...session.settings,
    },
  }
  const sMeta = getSessionMeta(s)
  // 直接写入 storage, 因为动态创建的 atom 无法立即写入
  await storage.setItemNow(StorageKeyGenerator.session(s.id), s)

  store.set(atoms.sessionsListAtom, (sessions) => {
    if (previousId) {
      let previouseSessionIndex = sessions.findIndex((s) => s.id === previousId)
      if (previouseSessionIndex < 0) {
        previouseSessionIndex = sessions.length - 1
      }
      return [...sessions.slice(0, previouseSessionIndex + 1), sMeta, ...sessions.slice(previouseSessionIndex + 1)]
    }
    return [...sessions, sMeta]
  })
  return s
}

// 所有对 session 的修改应该调用这个 function，只修改当前 session，避免其他的 session 经过 migrate 这一步
export function saveSession(session: Partial<Session> & { id: Session['id'] }) {
  const store = getDefaultStore()
  // update session meta
  store.set(atoms.sessionsListAtom, (sessions) => {
    return sessions.map((s) => (s.id === session.id ? getSessionMeta({ ...s, ...session }) : s))
  })
  // update session
  const sessionAtom = createSessionAtom(session.id)
  store.set(sessionAtom, (s) => {
    return { ...s, ...session } as Session
  })
}

export function removeSession(sessionId: string) {
  const store = getDefaultStore()
  store.set(atoms.sessionsListAtom, (sessions) => sessions.filter((s) => s.id !== sessionId))
  storage.removeItem(StorageKeyGenerator.session(sessionId))
}

export function reorderSessions(oldIndex: number, newIndex: number) {
  const store = getDefaultStore()
  store.set(atoms.sessionsListAtom, (sessions) => {
    const sortedSessions = sortSessions(sessions)
    return sortSessions(arrayMove(sortedSessions, oldIndex, newIndex))
  })
}

export async function copySession(
  sourceMeta: SessionMeta & {
    name?: Session['name']
    messages?: Session['messages']
    threads?: Session['threads']
    threadName?: Session['threadName']
  }
) {
  const source = getSession(sourceMeta.id)!
  const newSession = {
    ...omit(source, 'id', 'messages', 'threads', 'messageForksHash'),
    ...(sourceMeta.name ? { name: sourceMeta.name } : {}),
    messages: sourceMeta.messages ? sourceMeta.messages.map(copyMessage) : source.messages.map(copyMessage),
    threads: sourceMeta.threads ? copyThreads(sourceMeta.threads) : source.threads,
    messageForksHash: undefined, // 不复制分叉数据
    ...(sourceMeta.threadName ? { threadName: sourceMeta.threadName } : {}),
  }
  return await createSession(newSession, source.id)
}

export function getSessionMeta(session: SessionMeta) {
  return pick(session, ['id', 'name', 'starred', 'assistantAvatarKey', 'picUrl', 'type'])
}

async function initPresetSessions() {
  const lang = await platform.getLocale().catch((e) => 'en')
  log.info(`initPresetSessions, lang: ${lang}`)

  const defaultSessions = lang.startsWith('zh') ? defaultSessionsForCN : defaultSessionsForEN
  log.info(`initPresetSessions, defaultSessions: ${defaultSessions.length}`)

  for (const session of defaultSessions) {
    await storage.setItemNow(StorageKeyGenerator.session(session.id), session)
  }
  log.info(`initPresetSessions, set sessions done`)

  const sessionList = defaultSessions.map(getSessionMeta)
  log.info(`initPresetSessions, sessionList: ${sessionList.length}`)

  await storage.setItemNow(StorageKey.ChatSessionsList, sessionList)
  log.info(`initPresetSessions, set sessionList done`)

  return sessionList
}

export async function initSessionsIfNeeded() {
  // 已经做过 migration，只需要检查是否存在 sessionList
  const sessionList = await storage.getItem(StorageKey.ChatSessionsList, [])
  if (sessionList.length > 0) {
    return
  }

  const newSessionList = await initPresetSessions()

  // 同时写入 atom，避免后续被覆盖
  const store = getDefaultStore()
  store.set(atoms.sessionsListAtom, newSessionList)
}

export function clearConversations(keepNum: number) {
  const store = getDefaultStore()
  const removeSessionIds = store
    .get(atoms.sortedSessionsListAtom)
    .slice(keepNum)
    .map((s) => s.id) // 这里必须用 id，因为使用写入 sorted 版本会改变顺序
  store.set(atoms.sessionsListAtom, (sessions) => sessions.filter((s) => !removeSessionIds.includes(s.id)))
  for (const sessionId of removeSessionIds) {
    storage.removeItem(StorageKeyGenerator.session(sessionId))
  }
}

function _searchSessions(regexp: RegExp, session: Session) {
  const matchedMessages: Message[] = []
  for (let i = session.messages.length - 1; i >= 0; i--) {
    const message = session.messages[i]
    if (regexp.test(getMessageText(message))) {
      matchedMessages.push(message)
    }
  }
  // 搜索会话的历史主题
  if (session.threads) {
    for (let i = session.threads.length - 1; i >= 0; i--) {
      const thread = session.threads[i]
      for (let j = thread.messages.length - 1; j >= 0; j--) {
        const message = thread.messages[j]
        if (regexp.test(getMessageText(message))) {
          matchedMessages.push(message)
        }
      }
    }
  }
  return matchedMessages.map((m) => migrateMessage(m))
}

export async function searchSessions(searchInput: string, sessionId?: string, onResult?: (result: Session[]) => void) {
  const safeInput = searchInput.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const regexp = new RegExp(safeInput, 'i')
  const result: Session[] = []
  let matchedMessageTotal = 0

  if (sessionId) {
    const session = await storage.getItem<Session | null>(StorageKeyGenerator.session(sessionId), null)
    if (session) {
      const matchedMessages = _searchSessions(regexp, session)
      result.push({ ...session, messages: matchedMessages })
      matchedMessageTotal += matchedMessages.length
      onResult?.(result)
    }
  } else {
    const sessionsList = sortSessions(await storage.getItem<SessionMeta[]>(StorageKey.ChatSessionsList, []))

    for (const sessionMeta of sessionsList) {
      const session = await storage.getItem<Session | null>(StorageKeyGenerator.session(sessionMeta.id), null)
      if (session) {
        const messages = _searchSessions(regexp, session)
        if (messages.length > 0) {
          result.push({ ...session, messages })
          matchedMessageTotal += messages.length
          onResult?.(result)
        }
        if (matchedMessageTotal >= 50) {
          break
        }
      }
    }
  }
}
