import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { inject } from '@vercel/analytics';

inject({ projectId: '...' });

const app = createApp(App)

app.use(router)

app.mount('#app')

