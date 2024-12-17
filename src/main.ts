import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Message from "./components/selfUIs/Message"
import Loading from './components/selfUIs/Loading'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App);
app.use(Message)
.use(Loading)
.use(pinia)
.mount('#app');


//console.log('? :>> ',  app.component('contextMenu'));