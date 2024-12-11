import { interfacePosition } from "../../interfaces/ComponentProperty";
import { MindNode, typeNodeId } from "../../interfaces/MindNodeProperty";

interface interfaceNodePos {
	id: typeNodeId;
}
export interface interfaceChildAndFatherProp {
	father: interfaceNodePos;
	child: interfaceNodePos;
}

type pathVal = "straight" | "arc" | "fluid" | "magnet" | "grid";
type socketVal = "auto" | "top" | "right" | "bottom" | "left" | "auto";
type plugVal =
	| "disc"
	| "square"
	| "arrow1"
	| "arrow2"
	| "arrow3"
	| "hand"
	| "behind"
	| "crosshair";

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
interface dashObject {
	//The size of parts of the dashed line, in pixels.
	//len is length of drawn lines, gap is gap between drawn lines.
	len?: number | string;
	gap?: number | string;
	animation?: boolean;
}
interface gradientObject {
	startColor?: string;
	endColor?: string;
}
interface dropShadowObject {
	dx?: number;
	dy?: number;
	blur?: number;
	color?: string;
	opacity?: number;
}
export interface LeadLineOptions {
	color?: string;
	size?: number;

	//how to draw the line:
	path?: pathVal;

	positionByWindowResize?: boolean;

	//The string to indicate which side of the element the leader line connects
	startSocket?: socketVal;
	endSocket?: socketVal;

	// startSocketGravity,
	// endSocketGravity

	startPlug?: plugVal;
	endPlug?: plugVal;
	startPlugColor?: string;
	endPlugColor?: string;
	startPlugSize?: number;
	endPlugSize?: number;

	outline?: boolean;
	outlineColor?: string;
	outlineSize?: number;

	startPlugOutline?: boolean;
	endPlugOutline?: boolean;
	startPlugOutlineColor?: string;
	endPlugOutlineColor?: string;
	startPlugOutlineSize?: number;
	endPlugOutlineSize?: number;

	startLabel?: string;
	middleLabel?: string;
	endLabel?: string;

	dash?: boolean | dashObject;

	gradient?: boolean | gradientObject;

	dropShadow?: boolean | dropShadowObject;
}

export type typeTreeNodeRightClickValType = {
	position: interfacePosition;
	treeNode: MindNode;
	target?: HTMLElement;
};
