import { App } from "vue";
export enum buttonType{
    normal = 'normal',
    createNewFile = 'createNewFile',
    openFile = 'openFile',
    saveFile = 'saveFile',
    showModal = 'showModal',
    showTools = 'showTools'
}
export interface interfacePosition {
	clientX: number;
	clientY: number;
}
export enum toolTypes{
    CrcCheck='CrcCheck',
    HexBinDecOct='HexBinDecOct',
    //TODO 想要什么就加什么吧
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

export interface sidebarProps extends elementProps{
    toolType:toolTypes
}
export interface PluginOptions {
    install(app: App): void;
}

