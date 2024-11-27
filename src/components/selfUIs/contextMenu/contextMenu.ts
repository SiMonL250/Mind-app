import { PriorytyLevel } from "./../../../interfaces/MindNodeProperty";
import { interfaceEmitsAction } from "../../../hooks/operate";
import { MindNode } from "../../../interfaces/MindNodeProperty";

export type typeItemId = string;
export type menuItemClickActionValType =
	| "insert-child"
	| "insert-parent"
	| "insert-sibling"
	| "edit-text"
	| "delete-node"
	| "set-priority"
	|"none";
export type typeItemClickAction =
	interfaceEmitsAction<menuItemClickActionValType>;

export type typeItemClickCallback = (_emitAction?: typeItemClickAction) => void;

export type typeItemClickEventHandleFunc = (
	e?: PointerEvent,
	_callback?: typeItemClickCallback
) => void;

interface interfaceSubMenu {
	id: typeItemId;
	text: string;
	action?: menuItemClickActionValType /* emit to App.vue,decide what acion of current node to do */;
	priority?: PriorytyLevel /* if set prioryty */;
	clickEvent?: typeItemClickEventHandleFunc;
}

export interface interfaceContextMenuItem {
	id: typeItemId;
	text: string;
	action?: menuItemClickActionValType;
	subMenu?: Array<interfaceSubMenu>;
	clickEvent?: typeItemClickEventHandleFunc;
}

export interface menuPosition {
	clientX: number;
	clientY: number;
}
export interface menuProps {
	position: menuPosition;
	items: Array<interfaceContextMenuItem>;
}
//clientX clientY to decide position get from contextMenu Event

export type rightClickValType = { menu: menuProps; treeNode: MindNode; target?:HTMLElement};
