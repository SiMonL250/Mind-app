import { App } from "vue";
export enum buttonType{
    normal,
    createNewFile,
    openFile,
    saveFile,
    showShortcus
}

export interface elementProps{
    classList?:string[],
    id?:string,
    innerText:string,
    eventClickHandle?:(e?:Event)=>void,
    
}

export interface buttonProps extends elementProps{
    type:buttonType
}

export interface PluginOptions {
    install(app: App): void;
}
