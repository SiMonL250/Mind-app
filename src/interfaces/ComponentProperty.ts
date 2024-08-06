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

