import { interfaceEmitsAction } from './../../../hooks/operate';
import { Component } from "vue";
import CryingIcon from "../icons/cryingIcon.vue"
import SmileIcon from "../icons/smileIcon.vue";
import DailyIcon from "../icons/dailyIcon.vue";


export type typeIconsName  = "cry"|"smile"|"daily"

export interface interfaceRollItem{
    index:number;
    name:string;
    icon?:typeIconsName;
    text?:string;
    
}

export type typeRollEmitAction = interfaceEmitsAction<any>;

export const Icons =  new Map<typeIconsName, Component>([
    ["cry",CryingIcon],
    ["smile",SmileIcon],
    ["daily",DailyIcon]
])
export const itemsRoll: Array<interfaceRollItem> = [
	{
		index: 0,
		name: "daily",
		text: "daily",
		icon: "daily",
	},
	{
		index: 1,
		name: "daily",
		text: "daily",
		icon: "daily",
	},
	{
		index: 2,
		name: "daily",
		text: "daily",
		icon: "daily",
	},
	{
		index: 3,
		name: "daily",
		text: "daily",
		icon: "daily",
	},
	{
		index: 4,
		name: "daily",
		text: "daily",
		icon: "daily",
	},
	{
		index: 5,
		name: "daily",
		text: "daily",
		icon: "daily",
	},
];

