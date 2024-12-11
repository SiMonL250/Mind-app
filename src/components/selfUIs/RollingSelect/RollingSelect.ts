import { Component } from "vue";
import cryingIcon from "../icons/cryingIcon.vue"
import SmileIcon from "../icons/smileIcon.vue";
import { CSSProperties } from "vue";


export type typeIconsName  = "cry"|"smile"
export const Icons =  new Map<typeIconsName, Component>([
    ["cry",cryingIcon],
    ["smile",SmileIcon]
])


export interface interfaceRollItem{
    index:number;
    name:string;
    cssProps?:CSSProperties;
    icon?:Component;
    text:string;
    
}