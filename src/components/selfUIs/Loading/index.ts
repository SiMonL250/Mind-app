import loading from "./loading.vue";
import {Component} from 'vue';
import {PluginOptions} from '../../../interfaces/ComponentProperty'


 const Loading:PluginOptions = {
    install(app){
        app.config.globalProperties.$loading = loading;
        app.component('Loading',loading as Component)
    }
}
 
export default Loading;