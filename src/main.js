import { createApp } from 'vue'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

posthog.init('phc_mYhPWtRU4mYFQafv8jkEv9w2UHXyJ88KrisdUiTK9xQn', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
  autocapture: true,
  capture_pageview: true,
  loaded: (posthog) => {
    console.log('PostHog loaded')
  },
})

Sentry.init({
  app,
  dsn: 'ВСТАВ_СЮДИ_СВІЙ_DSN_ІЗ_SENTRY',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  environment: 'development',
})

Sentry.setUser({
  id: 'student-001',
  email: 'karynavas79876@gmail.com',
  segment: 'student_user',
})

Sentry.setContext('laboratory_work', {
  number: 6,
  topic: 'Observability & Error Tracking',
  application: 'Менеджер завдань',
  framework: 'Vue 3 + Vite',
})

Sentry.setTag('application', 'taskflow')
Sentry.setTag('laboratory', 'lab-6')
Sentry.setTag('environment_type', 'development')

app.mount('#app')