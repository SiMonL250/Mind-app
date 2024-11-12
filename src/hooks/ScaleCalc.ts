export type scales = 2 | 8 | 16 | 10;
export type typeBitLength = 64 | 32 | 16 | 8;
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
	function decideBinaryArrayBitsAccount(
		arr: binaryArray,
		len: typeBitLength,
		minus: boolean
	) :binaryArray{
		// 正补0，负补1；弃就直接切割，不管正负
		let l = arr.length;
		if(l>len){
			//截取
			return arr.splice(l-len,l);
		}
		else if(l<len){
			let addedOnes: binaryArray;
			if(minus){
				addedOnes = new Array(len - l).fill("1");
			}
			else{
				addedOnes = new Array(len - l).fill("0");
			}
			arr.unshift(...addedOnes);
			return arr ;
		}
		else{
			return arr;
		}
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

	let signedBitString = parseInt(raw).toString(2);
	let minus: boolean = false;

	if (signedBitString[0] == "-") {
		minus = true;
		signedBitString = signedBitString.replace(/^\-/, "1");
	}

	let singedBitArray: binaryArray = signedBitString.split("") as binaryArray;
	if (minus) {//取反 补码
		let lastOne = signedBitString.lastIndexOf("1");
		for (let i = 1; i < lastOne; i++) {
			singedBitArray[i] = singedBitArray[i] === "0" ? "1" : "0";
		}
	}

	//四、双、单字，还是字节（单字 = 2字节 = 16位）
	//singedBitArray 扔进去，多弃少补
	singedBitArray = decideBinaryArrayBitsAccount(singedBitArray, bits, minus);

	console.log("singedBitArray :>> ", singedBitArray);

	let bit2DArr = divideArray(singedBitArray, groupItemCounts);

	let scaledArray: Array<string> = chunksToScaleCharsArray(bit2DArr);
	return scaledArray.join("");
};

///IEEE float 32 bits
export const decimalToIEEE: scaleFunc = function (raw: string) {
	let decimal: number = parseFloat(raw);
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
