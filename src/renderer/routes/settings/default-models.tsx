/** biome-ignore-all lint/style/noNonNullAssertion: <todo> */
import { Flex, Stack, Text, Title } from '@mantine/core'
import { IconSelector } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { forwardRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SystemProviders } from 'src/shared/defaults'
import ModelSelector from '@/components/ModelSelectorNew'
import { useSettings } from '@/hooks/useSettings'

export const Route = createFileRoute('/settings/default-models')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { settings, setSettings } = useSettings()

  return (
    <Stack p="md" gap="xl">
      <Title order={5}>{t('Default Models')}</Title>

      <Stack gap="xs">
        <Text fw={600}>{t('Default Chat Model')}</Text>

        <ModelSelector
          position="bottom-start"
          width={320}
          showAuto={true}
          autoText={t('Auto (Use Last Used)')!}
          onSelect={(provider, model) => {
            console.log(provider, model)
            setSettings({
              defaultChatModel:
                provider && model
                  ? {
                      provider,
                      model,
                    }
                  : undefined,
            })
          }}
        >
          <ModelSelectContent
            autoText={t('Auto (Use Last Used)')!}
            provider={settings.defaultChatModel?.provider}
            model={settings.defaultChatModel?.model}
          />
        </ModelSelector>

        <Text c="chatbox-tertiary" size="xs">
          {t('Chatbox will use this model as the default for new chats.')}
        </Text>
      </Stack>

      <Stack gap="xs">
        <Text fw={600}>{t('Default Thread Naming Model')}</Text>

        <ModelSelector
          position="bottom-start"
          width={320}
          showAuto={true}
          autoText={t('Auto (Use Chat Model)')!}
          onSelect={(provider, model) =>
            setSettings({
              threadNamingModel:
                provider && model
                  ? {
                      provider,
                      model,
                    }
                  : undefined,
            })
          }
        >
          <ModelSelectContent
            autoText={t('Auto (Use Chat Model)')!}
            provider={settings.threadNamingModel?.provider}
            model={settings.threadNamingModel?.model}
          />
        </ModelSelector>

        <Text c="chatbox-tertiary" size="xs">
          {t('Chatbox will automatically use this model to rename threads.')}
        </Text>
      </Stack>

      <Stack gap="xs">
        <Text fw={600}>{t('Search Term Construction Model')}</Text>

        <ModelSelector
          position="bottom-start"
          width={320}
          showAuto={true}
          autoText={t('Auto (Use Chat Model)')!}
          onSelect={(provider, model) =>
            setSettings({
              searchTermConstructionModel:
                provider && model
                  ? {
                      provider,
                      model,
                    }
                  : undefined,
            })
          }
        >
          <ModelSelectContent
            autoText={t('Auto (Use Chat Model)')!}
            provider={settings.searchTermConstructionModel?.provider}
            model={settings.searchTermConstructionModel?.model}
          />
        </ModelSelector>

        <Text c="chatbox-tertiary" size="xs">
          {t('Chatbox will automatically use this model to construct search term.')}
        </Text>
      </Stack>
    </Stack>
  )
}

const ModelSelectContent = forwardRef<
  HTMLButtonElement,
  { provider?: string; model?: string; autoText?: string; onClick?: () => void }
>(({ provider, model, autoText, onClick }, ref) => {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const displayText = useMemo(
    () =>
      !provider || !model
        ? autoText || t('Auto')
        : ([...SystemProviders, ...(settings.customProviders || [])].find((p) => p.id === provider)?.name || provider) +
          '/' +
          ((settings.providers?.[provider]?.models || SystemProviders[provider as any]?.defaultSettings?.models)?.find(
            (m) => m.modelId === model
          )?.nickname || model),
    [provider, model, settings, autoText, t]
  )
  return (
    <Flex
      ref={ref}
      px={12}
      py={6}
      component="button"
      align="center"
      c="chatbox-tertiary"
      w={320}
      className="border-solid border border-[var(--mantine-color-chatbox-border-primary-outline)] rounded-sm cursor-pointer bg-transparent"
      onClick={onClick}
    >
      <Text span flex={1} className=" text-left">
        {displayText}
      </Text>
      <IconSelector size={16} className=" text-inherit" />
    </Flex>
  )
})
