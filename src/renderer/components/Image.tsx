import storage from '@/storage'
import React, { useEffect, useState } from 'react'
import CircularProgressIcon from '@mui/material/CircularProgress'
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined'

export function ImageInStorage(props: {
  storageKey: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void
}) {
  // false 意味着不存在
  const [base64, setPic] = useState<string | false>('')
  useEffect(() => {
    storage.getBlob(props.storageKey).then((blob) => {
      if (blob) {
        setPic(blob)
      } else {
        setPic(false)
      }
    })
  }, [props.storageKey])
  if (!base64) {
    return (
      <div className={`bg-slate-300/50 w-full h-full ${props.className || ''}`}>
        <div className="w-full h-full flex items-center justify-center">
          {base64 === false ? (
            <BrokenImageOutlinedIcon className="block max-w-full max-h-full opacity-50" />
          ) : (
            <CircularProgressIcon className="block max-w-full max-h-full opacity-50" color="secondary" />
          )}
        </div>
      </div>
    )
  }
  const picBase64 = base64.startsWith('data:image/') ? base64 : `data:image/png;base64,${base64}`
  return <img src={picBase64} className={`max-w-full max-h-full ${props.className || ''}`} onClick={props.onClick} />
}

export function Img(props: {
  src: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void
}) {
  return <img src={props.src} className={`max-w-full max-h-full ${props.className || ''}`} onClick={props.onClick} />
}

export function handleImageInputAndSave(file: File, key: string, updateKey?: (key: string) => void) {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target && e.target.result) {
        const base64 = e.target.result as string
        await storage.setBlob(key, base64)
        if (updateKey) {
          updateKey(key)
        }
      }
    }
    reader.readAsDataURL(file)
  }
}
