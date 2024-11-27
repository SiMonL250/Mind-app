<template>
	<div class="scale-container">
		<div class="bitlength-select" >
			<div
				v-for="(item, ind) of bitLengthList"
				:key="ind"
				:class="{ item: true, selected: selectBitlength === item.bits }"
				@click="selectBitlengthClick(item)"
			>
				{{ item.text }}
			</div>
		</div>
		<div class="scale">
			<div v-for="(item, ind) of sList" :key="ind" class="scale-item">
				<div class="label">{{ item.type + "(signed)" }}</div>
				<textarea
					:type="'text'"
					:class="{ input: true, unvalid: !item.valid }"
					v-model="item.val"
					@input="
						 (e:InputEvent)=> {
							item?.onInput.call(item, e);
						}
					"
					autocorrect="off"
					spellcheck="false"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { debounce } from "../../../hooks/debounce";
import { interfaceScaleListItem, EventInput, TypeScale } from "./index";
import {
	rexs,
	decimalToOther,
	bitLength,
	namespaceScales,
	typeBitLength,
decimalToIEEE,
HexadecimalToOther,
} from "../../../hooks/ScaleCalc";
const sList: Ref<Array<interfaceScaleListItem>> = ref([
	{
		type: "decimal",
		val: "",
		valid: true,
		onInput: function (e) {
			let _this = this;
			let callback = function () {
				calcScale(_this);
			};
			debounced(this, rexs.DecimalRegExp, e, callback);
		},
	},
	{
		type: "hexadecimal",
		valid: true,
		val: "",
		onInput: function (e) {
			let _this = this;
			let callback = function () {
				calcScale(_this);
			};
			debounced(this, rexs.HexadecimalRegExp, e, callback);
		},
	},
	{
		type: "binary",
		valid: true,
		val: "",
		onInput: function (e) {
			let _this = this;
			let callback = function () {
				calcScale(_this);
			};
			debounced(this, rexs.BinaryRegExp, e, callback);
		},
	},
	{
		type: "octonary",
		valid: true,
		val: "",
		onInput: function (e) {
			let _this = this;
			let callback = function () {
				calcScale(_this);
			};
			debounced(this, rexs.OctonaryRegExp, e, callback);
		},
	},
	{
		type: "IEEE_float",
		valid: true,
		val: "",
		onInput: function (e) {
			let _this = this;
			let callback = function () {
				calcScale(_this);
			};
			debounced(this, rexs.HexadecimalRegExp, e, callback);
		},
	},
]);
interface bitlenInterface { text: string; bits: typeBitLength };

const bitLengthList: Ref<Array<bitlenInterface>> = ref([
	{ text: "Byte", bits: bitLength.Byte },
	{ text: "Word", bits: bitLength.Word },
	{ text: "DWord", bits: bitLength.DWord },
	{ text: "QWord", bits: bitLength.QWord },
]);
const selectBitlength: Ref<typeBitLength> = ref(bitLength.QWord);
const CurrentInput:Ref<interfaceScaleListItem> = ref(sList.value[0])
const debounced = debounce(EventHandle);

function valMatchRex(rex: RegExp, val: string): boolean {
	let t = val.trim().replace(rex, "");
	return t.length === 0;
}

function EventHandle(
	_this: interfaceScaleListItem,
	rex: RegExp,
	e?: InputEvent | MouseEvent,
	_callback?: Function
) {
	if (e.type === EventInput) {
		//input event
		let ievent = e as InputEvent;
		// let str: string = ie.data;
		let ielement = ievent.target as HTMLInputElement;
		let val = ielement.value;
		// let key:string = (e as InputEvent).
		if (valMatchRex(rex, val)) {
			_this.valid = true;
			if (_callback) _callback();
		} else {
			_this.valid = false;
		}
	}
}
function selectBitlengthClick(item:bitlenInterface){
	if(!item) return;
	selectBitlength.value = item.bits;
	//TODO 触发一次转换

}
//Scale Functions//
function calcScale(item: interfaceScaleListItem) {
	//delete pre Zero and spaces
	// 计算新的进制值
	convertToOtherScaleAndSetVal.call(sList.value, item.val, item.type);
}
function convertToOtherScaleAndSetVal(val: string, curScaleType: TypeScale) {
	// bitLength
	if (!this) return;
	//(this[1] as interfaceScaleListItem).val = '0000' 直接这样赋值就行
	console.log("curSType :>> ", curScaleType);
	switch (curScaleType) {
		case "decimal":
			(this[1] as interfaceScaleListItem).val = decimalToOther(val, selectBitlength.value, namespaceScales.Hexadecimal);
			(this[2] as interfaceScaleListItem).val = decimalToOther(val, selectBitlength.value, namespaceScales.Binary);
			(this[3] as interfaceScaleListItem).val = decimalToOther(val, selectBitlength.value, namespaceScales.Octonary);
			(this[4] as interfaceScaleListItem).val = decimalToIEEE(val);
			CurrentInput.value = this[0] as interfaceScaleListItem;
			//TODO 填充新值
			//dec to hex bin oct float
			break;
		case "binary":
			break;
		case "hexadecimal":
			(this[0] as interfaceScaleListItem).val = HexadecimalToOther(val,selectBitlength.value,namespaceScales.Decimal);
			(this[2] as interfaceScaleListItem).val = HexadecimalToOther(val,selectBitlength.value,namespaceScales.Binary);
			(this[3] as interfaceScaleListItem).val = HexadecimalToOther(val,selectBitlength.value,namespaceScales.Octonary);
			(this[4] as interfaceScaleListItem).val = HexadecimalToOther(val,selectBitlength.value,namespaceScales.IEEE_754);
			break;
		case "octonary":
			break;
		case "IEEE_float":
			break;
		default:
			break;
	}
}
</script>

<style lang="scss" scoped>
$selectHeight: 40px;
.scale-container {
	width: 100%;
	height: 100%;
	.bitlength-select {
		display: flex;
		align-items: flex-start;
		justify-content: space-around;
		height: $selectHeight;
		border-bottom: 1px solid var(--color-border-default);
		margin-bottom: 2px;
		box-sizing: border-box;
		.item {
			border: 1px solid var(--color-border-default);
			height: 30px;
			line-height: 30px;
			padding: 2px 5px;
			border-radius: 5px;
			cursor: pointer;
			&:hover {
				transform: scale(1.11);
				transition: .3s;
				box-shadow: 1px 1px 2px rgb(88, 88, 88);

			}
		}
		.selected {
			background-color: var(--color-font);
			color: aliceblue;
			box-shadow: 1px 1px 2px rgb(88, 88, 88);
		}
	}
	.scale {
		height: calc(100% - $selectHeight - 5px);
		overflow-y: scroll;
		.scale-item {
			height: fit-content;
			font-size: 20px;
			padding: 0 8px;
			.label {
				font-weight: 400;
			}
			.input {
				font-size: 20px;
				padding: 2px;
				min-height: 30px;
				width: 360px;
				max-width: 100%;
				width: 65%;
				min-width: 71px;
				height: 75px;
				outline: none;
				display: block;
			}
			.unvalid {
				border-color: rgb(255, 129, 129);
			}
		}
	}
}
</style>
