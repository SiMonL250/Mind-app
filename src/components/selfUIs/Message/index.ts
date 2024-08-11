import message from "./message";
import { App, Component } from 'vue';


interface PluginOptions {
    install(app: App): void;
}

 const Message:PluginOptions = {
	install(app) {
        app.config.globalProperties.$message = message;
		app.component('Message', message as unknown as Component);
	},
};



export default Message;