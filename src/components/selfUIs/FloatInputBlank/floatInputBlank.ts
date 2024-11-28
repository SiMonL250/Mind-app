import { interfacePosition } from '../../../interfaces/ComponentProperty';
import { interfaceEmitsAction } from './../../../hooks/operate';

export interface interfaceFloatInputProperty{
    position: interfacePosition;
    text:string;
    isShow:boolean;
}
export type typeInputBlankAction = "new-text"|"abort-edit";
export type typeInputBlankEmitsAction = interfaceEmitsAction<string|null>;