import { useIsSmallScreen } from '@/hooks/useScreenChange'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/settings/provider/')({
  component: RouteComponent,
})

function RouteComponent() {
  const isSmallScreen = useIsSmallScreen()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isSmallScreen) {
      navigate({ to: '/settings/provider/chatbox-ai', replace: true })
    }
  }, [isSmallScreen])

  return null
}
