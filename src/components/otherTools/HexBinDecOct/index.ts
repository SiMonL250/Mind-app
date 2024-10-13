export namespace rexs {
	// export const DecimalRegExp = /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/;
	// export const BinaryRegExp = /^[01]+$/;
	// export const HexadecimalRegExp = /^[a-fA-F0-9]+$/; //hex and float
	// export const OctonaryRegExp = /^[0-7]+$/;
	export const DecimalRegExp = /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/g;
	export const BinaryRegExp = /\s*[01]+\s*/g;
	export const HexadecimalRegExp = /\s*[a-fA-F0-9]+\s*/g; // hex and float
	export const OctonaryRegExp = /\s*[0-7]+\s*/g;
}

export const EventInput: string = "input";
export type callback = (...args: any[]) => void;
type st = "decimal" | "hexadecimal" | "binary" | "octonary" | "IEEE_float";

export interface interfaceScaleListItem {
	type: st;
	val: string;
	valid: boolean;
	onInput?: (e?: InputEvent) => void;
	onClick?: (e?: MouseEvent) => void;
}
