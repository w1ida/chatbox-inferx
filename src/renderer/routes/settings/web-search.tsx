import { useSettings } from '@/hooks/useSettings'
import platform from '@/platform'
import { Title, Text, Select, Stack, PasswordInput, Flex, Button } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { ofetch } from 'ofetch'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/settings/web-search')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { settings, setSettings } = useSettings()

  const [checkingTavily, setCheckingTavily] = useState(false)
  const [tavilyAvaliable, setTavilyAvaliable] = useState<boolean>()
  const checkTavily = async () => {
    if (settings.extension.webSearch.tavilyApiKey) {
      setCheckingTavily(true)
      setTavilyAvaliable(undefined)
      try {
        await ofetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settings.extension.webSearch.tavilyApiKey}`,
          },
          body: {
            query: 'Chatbox',
            search_depth: 'basic',
            include_domains: [],
            exclude_domains: [],
          },
        })
        setTavilyAvaliable(true)
      } catch (e) {
        setTavilyAvaliable(false)
      } finally {
        setCheckingTavily(false)
      }
    }
  }

  return (
    <Stack p="md" gap="xxl">
      <Title order={5}>{t('Web Search')}</Title>

      <Select
        comboboxProps={{ withinPortal: true, withArrow: true }}
        data={[
          { value: 'build-in', label: 'Chatbox' },
          { value: 'bing', label: 'Bing' },
          { value: 'tavily', label: 'Tavily' },
        ]}
        value={settings.extension.webSearch.provider}
        onChange={(e) =>
          e &&
          setSettings({
            extension: {
              ...settings.extension,
              webSearch: {
                ...settings.extension.webSearch,
                provider: e as any,
              },
            },
          })
        }
        label={t('Search Provider')}
        maw={320}
      />

      {/* Tavily API Key */}
      {settings.extension.webSearch.provider === 'tavily' && (
        <Stack gap="xs">
          <Text fw="600">{t('Tavily API Key')}</Text>
          <Flex align="center" gap="xs">
            <PasswordInput
              flex={1}
              maw={320}
              value={settings.extension.webSearch.tavilyApiKey}
              onChange={(e) => {
                setTavilyAvaliable(undefined)
                setSettings({
                  extension: {
                    ...settings.extension,
                    webSearch: {
                      ...settings.extension.webSearch,
                      tavilyApiKey: e.currentTarget.value,
                    },
                  },
                })
              }}
              error={tavilyAvaliable === false}
            />
            <Button color="chatbox-gray" variant="light" onClick={checkTavily} loading={checkingTavily}>
              {t('Check')}
            </Button>
          </Flex>

          {typeof tavilyAvaliable === 'boolean' ? (
            tavilyAvaliable ? (
              <Text size="xs" c="chatbox-success">
                {t('Connection successful!')}
              </Text>
            ) : (
              <Text size="xs" c="chatbox-error">
                {t('API key invalid!')}
              </Text>
            )
          ) : null}
          <Button
            variant="transparent"
            size="compact-xs"
            px={0}
            className="self-start"
            onClick={() => platform.openLink('https://app.tavily.com?utm_source=chatbox')}
          >
            {t('Get API Key')}
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
