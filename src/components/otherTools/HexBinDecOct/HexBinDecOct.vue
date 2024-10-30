<template>
	<div class="scale-container">
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
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { debounce } from "../../../hooks/debounce";
import {
	interfaceScaleListItem,
	EventInput,
	TypeScale,
} from "./index";
import { rexs, decimalToOther,bitLength,namespaceScales } from "../../../hooks/ScaleCalc";
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

const debounced = debounce(EventHandle);

function valMatchRex(rex: RegExp, val: string): boolean {
	let t = val.trim().replace(rex, "");
	return t.length === 0;
}

function EventHandle(
	_this: interfaceScaleListItem,
	rex: RegExp,
	e?: InputEvent | MouseEvent,
	_callback?:Function
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

//Scale Functions//
function calcScale(item: interfaceScaleListItem) {
	//delete pre Zero and spaces
	//TODO 计算新的进制值
	convertToOtherScaleAndSetVal.call(sList.value, item.val, item.type);
}
function convertToOtherScaleAndSetVal(val: string, sType: TypeScale) {
	if (!this) return;
	switch (sType) {
		case "decimal":
			console.log(" Binary:>> ", decimalToOther(val,bitLength.QWord,namespaceScales.Binary));
			console.log(" hexadecimal:>> ", decimalToOther(val,bitLength.QWord,namespaceScales.Hexadecimal));

			break;
		case "binary":
			break;
		case "hexadecimal":
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
.scale-container {
	width: 100%;
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
			height: 105px;
			outline: none;
			display: block;
		}
		.unvalid {
			border-color: rgb(255, 129, 129);
		}
	}
}
</style>
