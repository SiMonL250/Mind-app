import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import MessagePopup from './components/selfUIs/Message/MessagePopup.vue';


createApp(App)
.component("my-message",MessagePopup)
.mount('#app')
