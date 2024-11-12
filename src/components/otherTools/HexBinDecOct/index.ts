export const EventInput: string = "input";
export type TypeScale = "decimal" | "hexadecimal" | "binary" | "octonary" | "IEEE_float";

export interface interfaceScaleListItem {
	type: TypeScale;
	val: string;
	valid: boolean;
	onInput?: (e?: InputEvent) => void;
	onClick?: (e?: MouseEvent) => void;
}
