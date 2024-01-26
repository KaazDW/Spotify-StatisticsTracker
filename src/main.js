import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VercelAnalytics from '@vercel/analytics';

VercelAnalytics({ projectId: 'prj_LIW8SSAt1NTwMQJWEvVExdY1lejp' });

const app = createApp(App)

app.use(router)

app.mount('#app')

