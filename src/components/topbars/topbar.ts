import { interfaceEmitsAction } from "../../hooks/operate";

export type typeModalType = "tools" | "shortcut";
interface typeShowModelActionVal {
	type?: typeModalType;
	show: boolean;
}

export type typeShowModalAction = interfaceEmitsAction<typeShowModelActionVal>;

export interface interfacebuttonsDisabled{
	undoRedoDisabled?:boolean;
	insertDisabled?:boolean;
	upAndDownDisabled?:boolean;
	editTextAndDeleteDisabled?:boolean;
	setPriorityDisabled?:boolean;
	
}
