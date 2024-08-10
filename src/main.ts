import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import MessagePopup from "./components/selfUIs/Message/MessagePopup.vue"

import { createPinia } from 'pinia'


const pinia = createPinia();
createApp(App)
.component('My-msg',MessagePopup)
.use(pinia)
.mount('#app')
