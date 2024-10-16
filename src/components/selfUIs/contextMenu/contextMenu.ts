import { interfaceEmitsAction } from "../../../hooks/operate";
import { MindNode } from "../../../interfaces/MindNodeProperty";

export type itemIdType = string;
export type menuActionValType = any;//TODO any else
export interface contextMenuItem {
	id: itemIdType;
	text: string;
	subMenu?: Array<subMenu>;
	clickEvent?: (e?: PointerEvent,clickAction?:interfaceEmitsAction<menuActionValType>) => void;
}
interface subMenu {
	id: itemIdType;
	text: string;
	clickEvent?: (e: Event) => void;
}
export interface menuPosition {
	clientX: number;
	clientY: number;
}
export interface menuProps {
	position: menuPosition;
	items: Array<contextMenuItem>;
}
//clientX clientY to decide position get from contextMenu Event

export type rightClickValType = { menu: menuProps; treeNode: MindNode };
