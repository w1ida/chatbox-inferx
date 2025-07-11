import * as Sentry from '@sentry/react'
import platform from '../platform'
import { CHATBOX_BUILD_TARGET, CHATBOX_BUILD_PLATFORM, NODE_ENV } from '@/variables'
;(async () => {
  const settings = await platform.getSettings()
  if (1||!settings.allowReportingAndTracking) {
    return
  }

  const version = await platform.getVersion().catch(() => 'unknown')
  Sentry.init({
    dsn: 'https://eca691c5e01ebfa05958fca1fcb487a9@sentry.midway.run/697',
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^https:\/\/chatboxai\.app/, /^https:\/\/chatboxapp\.xyz/],
      }),
      new Sentry.Replay(),
    ],
    environment: NODE_ENV,
    // Performance Monitoring
    sampleRate: 0.1,
    tracesSampleRate: 0.1, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.05, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 0.05, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    release: version,
    // 设置全局标签
    initialScope: {
      tags: {
        platform: platform.type,
        app_version: version,
        build_target: CHATBOX_BUILD_TARGET,
        build_platform: CHATBOX_BUILD_PLATFORM,
      },
    },
  })
})()
