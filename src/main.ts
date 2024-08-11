import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import MessagePopup from "./components/selfUIs/Message/MessagePopup.vue"

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia();
pinia.use(piniaPersist);

createApp(App)
.component('My-msg',MessagePopup)
.use(pinia)
.mount('#app')
