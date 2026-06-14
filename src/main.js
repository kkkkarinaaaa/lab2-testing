import { createApp } from 'vue'
import posthog from 'posthog-js'
import './style.css'
import App from './App.vue'

posthog.init('phc_mYhPWtRU4mYFQafv8jkEv9w2UHXyJ88KrisdUiTK9xQn', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
  autocapture: true,
  capture_pageview: true,
  loaded: (posthog) => {
    console.log('PostHog loaded')
  },
})

createApp(App).mount('#app')