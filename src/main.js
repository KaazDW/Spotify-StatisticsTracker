import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// Importez fetch si ce n'est pas déjà fait
import 'whatwg-fetch';

// Fonction pour envoyer un événement à Vercel Analytics
function sendAnalyticsEvent(eventName, eventData = {}) {
    fetch(`https://api.vercel.com/v1/record?projectId=prj_c41jkuMu7kZ6v7sbph2hwuVLgX4l&eventName=${eventName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-vercel-api-token', // Remplacez par votre API token Vercel
        },
        body: JSON.stringify(eventData),
    })
        .then(response => response.json())
        .then(data => console.log('Event sent successfully', data))
        .catch(error => console.error('Error sending event', error));
}

// Exemple d'utilisation de la fonction pour envoyer un événement
sendAnalyticsEvent('pageview', { path: '/tracks' });


const app = createApp(App)

app.use(router)

app.mount('#app')

