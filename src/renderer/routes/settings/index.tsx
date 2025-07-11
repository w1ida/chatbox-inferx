import { useIsSmallScreen } from '@/hooks/useScreenChange'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  const isSmallScreen = useIsSmallScreen()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isSmallScreen) {
      navigate({ to: '/settings/provider', replace: true })
    }
  }, [isSmallScreen])

  return null
}
