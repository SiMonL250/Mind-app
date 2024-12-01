import { interfacePosition } from './../../../interfaces/ComponentProperty';
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
	position?:interfacePosition
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
	event?: typeNextActionTodo /* emit to App.vue,decide what acion of current node to do */;
	priority?: PriorytyLevel /* if set prioryty */;
	clickEvent?: typeItemClickEventHandleFunc;
}

export interface interfaceContextMenuItem {
	id: typeItemId;
	text: string;
	event?: typeNextActionTodo;
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
			event: "edit-text",
			clickEvent: itemClick,
		},
		{
			id: "delete",
			text: "delete",
			event: "delete-node",
			clickEvent: itemClick,
		},
		{
			id: "insert",
			text: "insert",
			subMenu: [
				{
					id: "child",
					text: "child",
					event:"insert-child",
					clickEvent: itemClick,
				},
				{
					id: "father",
					text: "father",
					event:"insert-parent",
					clickEvent: itemClick,
				},
				{
					id: "sibling",
					text: "sibling",
					event:"insert-sibling",
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
					event: "set-priority",
					priority: PriorytyLevel.highest,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.higher,
					text: PriorytyLevel.higher,
					event: "set-priority",
					priority: PriorytyLevel.higher,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.medium,
					text: PriorytyLevel.medium,
					event: "set-priority",
					priority: PriorytyLevel.medium,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.lower,
					text: PriorytyLevel.lower,
					event: "set-priority",
					priority: PriorytyLevel.lower,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.lowest,
					text: PriorytyLevel.lowest,
					event:"set-priority",
					priority: PriorytyLevel.lowest,
					clickEvent: itemClick,
				},
				{
					id: PriorytyLevel.none,
					text: PriorytyLevel.none,
					event: "set-priority",
					priority: PriorytyLevel.none,
					clickEvent: itemClick,
				},
			],
		},
	],
}