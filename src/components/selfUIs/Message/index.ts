import message from "./message";
import { Component } from 'vue';
import {PluginOptions} from '../../../interfaces/ComponentProperty'



const Message:PluginOptions = {
	install(app) {
        app.config.globalProperties.$message = message;
		app.component('Message', message as unknown as Component);
	},
};



export default Message;