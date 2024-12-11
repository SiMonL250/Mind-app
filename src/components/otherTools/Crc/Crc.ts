import { Ref } from "vue";
import { namespaceScalsRexs,binaryArray } from "../../../hooks/ScaleCalc";

export type typeCrcClass =
	| ""
	| "CRC-4/ITU"
	| "CRC-5/EPC"
	| "CRC-5/ITU"
	| "CRC-5/USB"
	| "CRC-6/ITU"
	| "CRC-7/MMC"
	| "CRC-8"
	| "CRC-8/ITU"
	| "CRC-8/ROHC"
	| "CRC-8/MAXIM"
	| "CRC-16/IBM"
	| "CRC-16/MAXIM"
	| "CRC-16/USB"
	| "CRC-16/MODBUS"
	| "CRC-16/CCITT"
	| "CRC-16/CCITT-FALSE"
	| "CRC-16/X25"
	| "CRC-16/XMODEM"
	| "CRC-16/DNP"
	| "CRC-32"
	| "CRC-32/MPEG-2";
export const arr: Array<typeCrcClass> = [
	"CRC-4/ITU",
	"CRC-5/EPC",
	"CRC-5/ITU",
	"CRC-5/USB",
	"CRC-6/ITU",
	"CRC-7/MMC",
	"CRC-8",
	"CRC-8/ITU",
	"CRC-8/ROHC",
	"CRC-8/MAXIM",
	"CRC-16/IBM",
	"CRC-16/MAXIM",
	"CRC-16/USB",
	"CRC-16/MODBUS",
	"CRC-16/CCITT",
	"CRC-16/CCITT-FALSE",
	"CRC-16/X25",
	"CRC-16/XMODEM",
	"CRC-16/DNP",
	"CRC-32",
	"CRC-32/MPEG-2",
];

export interface interfaceListItem {
	title: string;
	classList: Array<string>;
	curCrcClass: Ref<typeCrcClass>;
	vModel: Ref<string>;
	result: Ref<string>;
	handleFunc: crcFuncType;
}

export interface interfaceCrcClassKeyVal {
	key: typeCrcClass;
	val: typeCrcClass;
}

type crcFuncType = (raw: string, crcType?: typeCrcClass) => any;

const checkIsOptionsCorrect: crcFuncType = function (raw: string) {
	if (!raw) return false;
	return namespaceScalsRexs.HexadecimalRegExp.test(raw);
};

const HexStrToBinaryArr: crcFuncType = function (raw: string) {
	if (!checkIsOptionsCorrect(raw)) return -1;
	const binaryArr: binaryArray = [];
	
	return binaryArr;
};

export const calcCrc: crcFuncType = function (raw: string) {
	if (!checkIsOptionsCorrect(raw)) return;
	console.log("raw :>> ", raw);
};

export const checkCrcCorrect: crcFuncType = function (raw: string) {
	if (!checkIsOptionsCorrect(raw)) return;
};
