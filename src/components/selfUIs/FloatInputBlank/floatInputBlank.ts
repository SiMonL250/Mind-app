import { interfacePosition } from '../../../interfaces/ComponentProperty';
import { interfaceEmitsAction } from './../../../hooks/operate';

export interface interfaceFloatInputProperty{
    position: interfacePosition;
    text:string;
}
type typeInputBlankAction = "hide-input"|"new-text"|"abort-edit";

export namespace namespaceInputBlankAction{
    export const hideInput:typeInputBlankAction = 'hide-input';
    export const newText:typeInputBlankAction = 'new-text';
    export const abortEdit:typeInputBlankAction = 'abort-edit';

}
export type typeInputBlankEmitsAction = interfaceEmitsAction<string|boolean|null>;