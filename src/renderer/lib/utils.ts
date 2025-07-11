import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import log from 'electron-log/renderer'
import { getDefaultStore } from 'jotai'
import { initLogAtom } from '@/stores/atoms/utilAtoms'
import dayjs from 'dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseJsonOrEmpty(json: string): any {
  try {
    return JSON.parse(json)
  } catch (e) {
    return {}
  }
}

export function getLogger(logId: string) {
  // const logger = log.create({ logId })
  // logger.transports.console.format = '{h}:{i}:{s}.{ms} › [{logId}] › {text}'
  // return logger
  return {
    log(level: string, ...args: any[]) {
      const store = getDefaultStore()
      const now = dayjs().format('HH:mm:ss.SSS')
      store.set(initLogAtom, [...store.get(initLogAtom), `[${now}][${logId}] ${args.join(' ')}`])
    },
    info(...args: any[]) {
      this.log('info', ...args)
    },
    error(...args: any[]) {
      this.log('error', ...args)
    },
    debug(...args: any[]) {
      this.log('debug', ...args)
    },
  }
}
