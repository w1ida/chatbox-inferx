import { ShortcutConfig } from '@/components/Shortcut'
import { useSettings } from '@/hooks/useSettings'
import { Box } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/hotkeys')({
  component: RouteComponent,
})

function RouteComponent() {
  const { settings, setSettings } = useSettings()
  return (
    <Box p="md">
      <ShortcutConfig shortcuts={settings.shortcuts} setShortcuts={(shortcuts) => setSettings({ shortcuts })} />
    </Box>
  )
}
