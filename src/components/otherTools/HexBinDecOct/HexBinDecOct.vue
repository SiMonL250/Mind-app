<template>
	<div class="scale-container">
		<div v-for="(item, ind) of sList" :key="ind" class="scale-item">
			<div class="label">{{ item.type }}</div>
			<textarea
				:type="'text'"
				:class="{input:true,unvalid:!item.valid}"
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
import { interfaceScaleListItem,callback,rexs, EventInput } from "./index";

const sList: Ref<Array<interfaceScaleListItem>> = ref([
	{
		type: "decimal",
		val: "",
		valid:true,
		onInput: function (e) {
			let callback: callback = function () {
				debounced(this, rexs.DecimalRegExp);
			};
			EventHandle(this, rexs.DecimalRegExp, e, callback);
		},
	},
	{
		type: "hexadecimal",
		valid:true,
		val: "",
		onInput: function (e) {
			let callback: callback = function () {
				debounced(this, rexs.HexadecimalRegExp);
			};
			EventHandle(this, rexs.HexadecimalRegExp, e, callback);
		},
	},
	{
		type: "binary",
		valid:true,
		val: "",
		onInput: function (e) {
			let callback: callback = function () {
				debounced(this, rexs.BinaryRegExp);
			};
			EventHandle(this, rexs.BinaryRegExp, e, callback);
		},
	},
	{
		type: "octonary",
		valid:true,
		val: "",
		onInput: function (e) {
			let callback: callback = function () {
				debounced(this, rexs.OctonaryRegExp);
			};
			EventHandle(this, rexs.OctonaryRegExp, e, callback);
		},
	},
	{
		type: "IEEE_float",
		valid:true,
		val: "",
		onInput: function (e) {
			let callback: callback = function () {
				debounced(this, rexs.HexadecimalRegExp);
			};
			EventHandle(this, rexs.HexadecimalRegExp, e, callback);
		},
	},
]);

function calcScale(item: interfaceScaleListItem, rex: RegExp) {
	if (!rex.test(item.val)) return;
	//delete pre Zero and spaces
	
	//TODO 计算新的进制值
}

const debounced = debounce(calcScale);

function valMatchRex(rex: RegExp, val: string): boolean {
	let t = val.trim().replace(rex,'');
	return t.length===0;

}

function EventHandle(
	_this: interfaceScaleListItem,
	rex: RegExp,
	e?: InputEvent | MouseEvent,
	_callback?: callback
) {
	if (e.type === EventInput) { //input event
		let ievent = (e as InputEvent);
		// let str: string = ie.data;
		let ielement = ievent.target as HTMLInputElement;
		let val = ielement.value;
		// let key:string = (e as InputEvent).
		if(valMatchRex(rex,val)){
			_this.valid = true;
			calcScale(_this,rex);
			
		}else{
			_this.valid = false;
		}
	
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
			outline: none;
			display: block;

		}
		.unvalid{
			border-color: rgb(255, 129, 129);
		}
	}
}
</style>
