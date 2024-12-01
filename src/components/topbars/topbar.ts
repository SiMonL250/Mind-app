import { interfaceEmitsAction } from "../../hooks/operate";

export type typeModalType = "tools" | "shortcut";
interface typeShowModelActionVal {
	type?: typeModalType;
	show: boolean;
}

export type typeSHowModalAction = interfaceEmitsAction<typeShowModelActionVal>;
