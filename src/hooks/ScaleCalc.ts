export type scales = 2 | 8 | 16 | 10 | 754;
export type typeBitLength = 64 | 32 | 16 | 8;
type scaleFunc = (raw: string, bits?: typeBitLength, s?: scales) => string;

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
	export const IEEE_754:scales = 754;
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

interface interfaceBinaryFraction {
	integerPart: binaryArray;
	fractionPart: binaryArray;
	power: number;
	//integerPart.fractionPart * 2^power;
}
type binaryArray = Array<binarybit>;
type binary2DArray = Array<Array<binarybit>>;
type scaleCharsArray = Array<scaleChars>;

function divideArray(arr: binaryArray, itemsPerGroup: number): binary2DArray {
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
): binaryArray {
	// 正补0，负补1；弃就直接切割，不管正负
	let l = arr.length;
	if (l > len) {
		//截取
		return arr.splice(l - len, l);
	} else if (l < len) {
		let addedOnes: binaryArray;
		if (minus) {
			addedOnes = new Array(len - l).fill("1");
		} else {
			addedOnes = new Array(len - l).fill("0");
		}
		arr.unshift(...addedOnes);
		return arr;
	} else {
		return arr;
	}
}

function trimFrontZeroOfArray(arr:any,remainLen?:number):any{
	let l = remainLen? remainLen:1;
	while (arr[0] == "0" && arr.length > l) {
		arr = arr.slice(1) as binaryArray|scaleChars; //排除前导0 最后只留下1个0
	}
	
	return arr;
}



export function decimalToOther(
	raw: string,
	bits: typeBitLength /* 根据这个确定最后是字节、字、双字等 */,
	s: scales /*进制(10进制除外)，根据这个把 bitsArray分组*/
) {
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
	if (minus) {
		//取反 补码
		let lastOne = signedBitString.lastIndexOf("1");
		for (let i = 1; i < lastOne; i++) {
			singedBitArray[i] = singedBitArray[i] === "0" ? "1" : "0";
		}
	}

	//四、双、单字，还是字节（单字 = 2字节 = 16位）
	//singedBitArray 扔进去，多弃少补
	singedBitArray = decideBinaryArrayBitsAccount(singedBitArray, bits, minus);

	// console.log("singedBitArray :>> ", singedBitArray);

	let bit2DArr = divideArray(singedBitArray, groupItemCounts);

	let scaledArray: Array<string> = chunksToScaleCharsArray(bit2DArr);
	return scaledArray.join("");
}

///IEEE float 32 bits
export const decimalToIEEE: scaleFunc = function (raw: string) {
	function normalization(
		binaryFractionToNormalized: interfaceBinaryFraction
	): interfaceBinaryFraction {
		let integerPartArr: binaryArray =
			binaryFractionToNormalized.integerPart;
		let fractionPartArr: binaryArray =
			binaryFractionToNormalized.fractionPart;
		let pow: number = binaryFractionToNormalized.power;

		if (integerPartArr.length === 1) {
			if (integerPartArr.lastIndexOf("1") === 0) {
				return binaryFractionToNormalized;
			} else {
				let first1IndexFraction = fractionPartArr.indexOf("1");
				if (first1IndexFraction === -1) {
					return binaryFractionToNormalized;
				}
				fractionPartArr = fractionPartArr.slice(first1IndexFraction); //小数点右移
				pow = pow - (first1IndexFraction + 1);
			}
		} else if (integerPartArr.length > 1) {
			let appendToFraction: binaryArray = integerPartArr.splice(
				1,
				integerPartArr.length - 1
			);
			fractionPartArr = appendToFraction.concat(fractionPartArr); //小数点左移
			pow += appendToFraction.length;
		}

		return {
			integerPart: ["1"],
			fractionPart: fractionPartArr,
			power: pow,
		};
	}
	let strArr = raw.split(".");
	let fraction = "0." + (strArr[1] ?? "00");
	let integer = parseInt(strArr[0]);
	// console.log('integer, fraction :>> ', integer, fraction);
	//整数、小数部分分别转二进制
	let decimalFloat: number = parseFloat(raw);
	if (
		decimalFloat < Number.MIN_SAFE_INTEGER ||
		decimalFloat > Number.MAX_SAFE_INTEGER
	)
		return;

	let S: binaryArray = new Array<binarybit>(1); //符号码
	let T: binaryArray = new Array<binarybit>(8); //阶码
	let M: binaryArray = new Array<binarybit>(23); //尾数

	const bias = 2 ** (T.length - 1) - 1;

	if (integer < 0) {
		//决定符号位(1bits)
		S[0] = "1";
		integer = -1 * integer;
	} else {
		S[0] = "0";
	}
	let integerBinaryArr: binaryArray = integer
		.toString(2)
		.split("") as binaryArray;
	let fractionArray: binaryArray = [];
	let f = parseFloat(fraction);

	while (f > 0 && fractionArray.length < 32) {
		f = f * 2;
		let i: binarybit = (Math.floor(f) + "") as binarybit;
		// console.log('i :>> ', i);
		f = parseFloat("0." + f.toString().split(".")[1]);

		fractionArray.push(i);
	}

	let binaryFraction: interfaceBinaryFraction = {
		integerPart: integerBinaryArr,
		fractionPart: fractionArray,
		power: 0,
		//str:
	};

	//标准化 变成1.xxx * 2^n 的形式
	let normalized = normalization(binaryFraction);
	// TODO 决定尾数位(23bits)和指数位(8bits)

	let exponent = normalized.power + bias;
	if (exponent < 1 || exponent > 254) {
		T = new Array<binarybit>(8).fill("0");
	} else {
		T = exponent.toString(2).split("") as binaryArray;
		let l = T.length;
		if (l < 8) {
			T = new Array<binarybit>(8 - l).fill("0").concat(T);
		}
		// console.log("T :>> ", T);
	}

	M = normalized.fractionPart.slice(0, 23);
	// console.log("M :>> ", normalized.fractionPart, M);
	let ml = M.length;
	if (ml < 23) {
		M = M.concat(new Array<binarybit>(23 - ml).fill("0"));
	}
	// console.log("whole :>> ", S.concat(T).concat(M).join(""));
	let IeeeBinaryArray: binaryArray = S.concat(T).concat(M);

	let IeeeBinaryChunk: binary2DArray = divideArray(IeeeBinaryArray, 4);
	return chunksToScaleCharsArray(IeeeBinaryChunk).join("");
};

export const HexadecimalToOther: scaleFunc = function (
	raw: string,
	_bits: typeBitLength,
	_s: scales
) {
	let b = _bits/4;
	//TODO 实际是补码转原码
	let scaleCharArr: Array<scaleChars> = raw.split("") as scaleCharsArray;
	let isMinus:boolean = false;
	if(scaleCharArr.length < b){
		scaleCharArr = new Array<scaleChars>(b - scaleCharArr.length).fill('0').concat(scaleCharArr);
	}
	scaleCharArr = trimFrontZeroOfArray(scaleCharArr,b);

	let a = Array.from(scaleCharArr, (item) =>
		scaleCharsHashArray.indexOf(item.toUpperCase() as scaleChars)
	);

	let binaryArray: binaryArray = Array.from(a, (item) => {
		let arr: binaryArray = item.toString(2).split("") as binaryArray;
		if (arr.length < 4) {
			arr = new Array<binarybit>(4 - arr.length).fill("0").concat(arr);
		}
		return arr;
	}).flat();

	if(_s === namespaceScales.Binary) return trimFrontZeroOfArray(binaryArray).join(''); // binary, return directly
	if(_s === namespaceScales.Octonary) {
		let octonaryChunks:binary2DArray = divideArray(binaryArray,3);
		return trimFrontZeroOfArray(chunksToScaleCharsArray(octonaryChunks)).join('');

	}
	if (binaryArray[0] === "1") { // 补码转原码 转 10 进制
		//minus
		isMinus = true;
		let lastIndexOf1 = binaryArray.lastIndexOf("1");
		for (let i = 0; i < lastIndexOf1; i++) {
			binaryArray[i] = binaryArray[i] == "0" ? "1" : "0";
		}

	}
	let num:number = 0;
	for(let i = binaryArray.length-1; i>=0;i--){
		num += parseInt(binaryArray[i]) * Math.pow(2,binaryArray.length-i-1);
	}
	num = isMinus?-1*num:num;
	//TODO　CCCCCCCCCCCCCCCC 的结果跟计算器不一样？？？
	let decimalStr: string = num.toString();
	if(_s === namespaceScales.Decimal)
		return decimalStr;

	else{
		return decimalToIEEE(decimalStr);
	}
};


