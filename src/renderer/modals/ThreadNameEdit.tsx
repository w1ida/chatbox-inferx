import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsSmallScreen } from '@/hooks/useScreenChange'
import { currentSessionAtom } from '@/stores/atoms'
import * as sessionActions from '@/stores/sessionActions'

const ThreadNameEdit = NiceModal.create((props: { sessionId: string; threadId: string }) => {
  const { sessionId, threadId } = props
  const modal = useModal()
  const { t } = useTranslation()
  const isSmallScreen = useIsSmallScreen()
  const currentSession = useAtomValue(currentSessionAtom)

  const currentThreadName = useMemo(() => {
    if (sessionId === threadId) {
      return currentSession?.threadName || ''
    }
    return currentSession?.threads?.find((thread) => thread.id === threadId)?.name || ''
  }, [currentSession?.threadName, sessionId, threadId, currentSession?.threads])

  const [threadName, setThreadName] = useState(currentThreadName)

  const onClose = useCallback(() => {
    modal.resolve()
    modal.hide()
  }, [modal])

  const onSave = useCallback(() => {
    sessionActions.editThread(sessionId, threadId, { name: threadName })
    onClose()
  }, [onClose, sessionId, threadId, threadName])

  const onContentInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setThreadName(e.target.value)
  }, [])

  return (
    <Dialog {...muiDialogV5(modal)} onClose={onClose}>
      <DialogTitle>{t('Edit Thread Name')}</DialogTitle>
      <DialogContent>
        <TextField
          className="w-full"
          autoFocus={!isSmallScreen}
          placeholder="Thread Name"
          defaultValue={currentThreadName}
          onChange={onContentInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={onSave}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  )
})

export default ThreadNameEdit
