import { interfacePosition } from "../../interfaces/ComponentProperty";
import { MindNode, typeNodeId } from "../../interfaces/MindNodeProperty";

export interface interfaceNodeProp {
	id: typeNodeId;
}
export interface interfaceChildAndFatherProp {
	father: interfaceNodeProp;
	child: interfaceNodeProp;
}



export type typeshowEffectName = "none" | "fade" | "draw";
export interface animOptions {
	duration: number;
	timing:
		| [number, number, number, number]
		| "ease"
		| "ease-in"
		| "ease-out"
		| "ease-in-out"
		| "linear";
}


export type typeTreeNodeRightClickValType = {
	position: interfacePosition;
	treeNode: MindNode;
	target?: HTMLElement;
};
