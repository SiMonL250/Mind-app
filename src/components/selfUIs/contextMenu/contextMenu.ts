import { PriorytyLevel } from "./../../../interfaces/MindNodeProperty";
import { interfaceEmitsAction } from "../../../hooks/operate";

export type typeItemId = string;
export type typeNextActionTodo =
	| "insert-child"
	| "insert-parent"
	| "insert-sibling"
	| "edit-text"
	| "delete-node"
	| "set-priority"
	|"none";
export interface interfaceMenuItemClickActionValType{
	someString?:string,
	someObject?:object,
	someNumber?:number,
}
export type typeItemClickAction =
	interfaceEmitsAction<interfaceMenuItemClickActionValType>;

export type typeItemClickCallback = (_emitAction?: typeItemClickAction) => void;

export type typeItemClickEventHandleFunc = (
	e?: PointerEvent,
	_callback?: typeItemClickCallback
) => void;

interface interfaceSubMenu {
	id: typeItemId;
	text: string;
	action?: typeItemClickAction /* emit to App.vue,decide what acion of current node to do */;
	priority?: PriorytyLevel /* if set prioryty */;
	clickEvent?: typeItemClickEventHandleFunc;
}

export interface interfaceContextMenuItem {
	id: typeItemId;
	text: string;
	action?: typeItemClickAction;
	subMenu?: Array<interfaceSubMenu>;
	clickEvent?: typeItemClickEventHandleFunc;
}


export interface menuProps {
	items: Array<interfaceContextMenuItem>;
}
//clientX clientY to decide position get from contextMenu Event


function itemClick(e: PointerEvent, _callback?: () => void) {
	//console.dir(e.target as HTMLElement);
	if (_callback) {
		_callback.call(e.target as HTMLElement);
	}
}
export const menu:menuProps =  {
	items: [
		{
			id: "editText",
			text: "edit text",
			action: {
				action:"edit-text",
				val:{
					
				}
			},
			clickEvent: itemClick,
		},
		{
			id: "delete",
			text: "delete",
			action: {action:"delete-node"},
			clickEvent: itemClick,
		},
		{
			id: "insert",
			text: "insert",
			subMenu: [
				{
					id: "child",
					text: "child",
					action: {action:"insert-child"},
					clickEvent: itemClick,
				},
				{
					id: "father",
					text: "father",
					action: {action:"insert-parent"},
					clickEvent: itemClick,
				},
				{
					id: "sibling",
					text: "sibling",
					action:{action: "insert-sibling"},
					clickEvent: itemClick,
				},
			],
		},
		{
			id: "setPriority",
			text: "priority",
			subMenu: [
				{
					id: PriorytyLevel.highest,
					text: PriorytyLevel.highest,
					action: {action:"set-priority"},
					priority: PriorytyLevel.highest,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.higher,
					text: PriorytyLevel.higher,
					action: {action:"set-priority"},
					priority: PriorytyLevel.higher,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.medium,
					text: PriorytyLevel.medium,
					action: {action:"set-priority"},
					priority: PriorytyLevel.medium,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.lower,
					text: PriorytyLevel.lower,
					action: {action:"set-priority"},
					priority: PriorytyLevel.lower,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.lowest,
					text: PriorytyLevel.lowest,
					action: {action:"set-priority"},
					priority: PriorytyLevel.lowest,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.none,
					text: PriorytyLevel.none,
					action: {action:"set-priority"},
					priority: PriorytyLevel.none,
					clickEvent: itemClick,
				},
			],
		},
	],
}