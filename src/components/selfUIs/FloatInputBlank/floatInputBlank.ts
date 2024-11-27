import { interfaceEmitsAction } from './../../../hooks/operate';

export interface interfaceInputPosition{
    clientX: number;
	clientY: number;
}

export interface interfaceFloatInputProperty{
    position: interfaceInputPosition;
    text:string;
    isShow:boolean;
}
export type typeInputBlankAction = "new-text"|"abort-edit";
export type typeInputBlankEmitsAction = interfaceEmitsAction<string|null>;