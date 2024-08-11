import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Message from "./components/selfUIs/Message"

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia();
pinia.use(piniaPersist);

createApp(App)
.use(Message)
.use(pinia)
.mount('#app')
