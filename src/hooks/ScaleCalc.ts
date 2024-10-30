type scales = 2 | 8 | 16 | 10;
type typeBitLength = 64 | 32 | 16 | 8;
type scaleFunc = (raw: string, bits: typeBitLength, s?: scales) => string;

export namespace bitLength {
	export const QWord: typeBitLength = 64;
	export const DWord: typeBitLength = 32;
	export const Word: typeBitLength = 16;
	export const Byte: typeBitLength = 8;
}
export namespace namespaceScales {
	export const Binary: scales = 2;
	export const Octonary: scales = 8;
	export const Hexadecimal: scales = 16;
	export const Decimal: scales = 10;
}
export namespace rexs {
	export const DecimalRegExp = /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/g;
	export const BinaryRegExp = /\s*[01]+\s*/g;
	export const HexadecimalRegExp = /\s*[a-fA-F0-9]+\s*/g; // hex and float
	export const OctonaryRegExp = /\s*[0-7]+\s*/g;
}

type binarybit = "0" | "1";
type scaleChars =
	| "0"
	| "1"
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8"
	| "9"
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F";
const scaleCharsHashArray: scaleChars[] = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
];

type binaryArray = Array<binarybit>;
type binary2DArray = Array<Array<binarybit>>;
type scaleCharsArray = Array<scaleChars>;
//TODO  QWord, DWord, Word(16 bits),Byte

export const decimalToOther: scaleFunc = function (
	raw: string,
	bits: typeBitLength /* 根据这个确定最后是字节、字、双字等 */,
	s: scales /*进制(10进制除外)，根据这个把 bitsArray分组*/
) {
	function divideArray(
		arr: binaryArray,
		itemsPerGroup: number
	): binary2DArray {
		let chunks: binary2DArray = [];
		for (let i = arr.length; i > 0; i -= itemsPerGroup) {
			let front = i - itemsPerGroup < 0 ? 0 : i - itemsPerGroup;
			chunks.unshift(arr.slice(front, i));
		}
		return chunks;
	}
	function chunksToScaleCharsArray(chunks: binary2DArray): scaleCharsArray {
		let numArr: number[] = [];
		for (let i of chunks) {
			let num = 0;
			for (let j = i.length - 1; j >= 0; j--) {
				num += parseInt(i[j]) * 2 ** (i.length - j - 1);
			}
			numArr.push(num);
		}
		return numArr.map((i) => scaleCharsHashArray[i]);
	}
	let groupItemCounts: number;
	switch (
		s //only 2**n 进制
	) {
		case 2:
			groupItemCounts = 1;
			break;
		case 8:
			groupItemCounts = 3;
			break;
		case 16:
			groupItemCounts = 4;
			break;
	}

	let signedInt = parseInt(raw);
	//TODO 负数转换 这里错了
	let repairBit = "0";
	if (signedInt < 0) {
		signedInt = 2 ** bits + signedInt;
		repairBit = "1";
	}
	let signedBitString: string = signedInt.toString(2);
	while (signedBitString.length < bits) {
		signedBitString = repairBit + signedBitString;
	}
	// console.log('signedBitString :>> ', signedBitString);
	let singedBitArray: binaryArray = signedBitString.split("") as binaryArray;
	let bit2DArr = divideArray(singedBitArray, groupItemCounts);

	let scaledArray: Array<string> = chunksToScaleCharsArray(bit2DArr);
	return scaledArray.join("");
};

///IEEE float 32 bits
export const decimalToIEEE: scaleFunc = function (raw: string) {
	let decimal: number = parseInt(raw, 10);
	if (decimal < Number.MIN_SAFE_INTEGER || decimal > Number.MAX_SAFE_INTEGER)
		return;
	return "";
};

/*
interface IntervalAndVal {
	max: number;
	min: number;
	convertedInt: number;
}
function decideValueInterValandcalcOverflow(
	signedInt: number,
	bits: typeBitLength
): IntervalAndVal {
	let interval: IntervalAndVal = {
		max: Number.MAX_SAFE_INTEGER,
		min: Number.MIN_SAFE_INTEGER,
		convertedInt: 0,
	};
	interval.max = 2 ** (bits - 1) - 1;
	interval.min = (-2) ** (bits - 1);

	let offset = signedInt % (2 ** bits - 1);
	interval.convertedInt = offset - interval.min;

	return interval;
}
	function prepareBitsArrayAndRaplace(
		bits: typeBitLength,
		array: binaryArray
	): binaryArray {
		let a = new Array<binarybit>(bits).fill("0");
		for (let i = 0; i < array.length; i++) {
			a[bits - 1 - i] = array[i];
		  }
		return a;
	} //bit array,then fill it, then flip
*/
