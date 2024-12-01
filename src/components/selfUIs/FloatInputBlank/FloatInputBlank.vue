<template>
	<div class="float-input-container" :style="styleProp" ref="inputContainer">
		<textarea
			type="text"
			v-model="props.floatInputProperty.text"
			class="float-input"
			maxlength="58"
			@input="textInputHandle"
			rows="1"
			ref="inputArea"
			@keydown="keyDownHandle"
			spellcheck="false"
		/>
		<div class="abort-edit-text" @click="abortEditClickHandleFunc">
			<CloseIcon :height="14" :width="14" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { CSSProperties, Ref, ref } from "vue";
import {
	interfaceFloatInputProperty,
	namespaceInputBlankAction,
	typeInputBlankEmitsAction,
} from "./floatInputBlank";
import { onMounted } from "vue";
import { interfacePosition } from "../../../interfaces/ComponentProperty";
import CloseIcon from "../icons/closeIcon.vue";

const props = defineProps<{
	floatInputProperty: interfaceFloatInputProperty;
}>();
const inputBlankEmit = defineEmits([
	namespaceInputBlankAction.abortEdit,
	namespaceInputBlankAction.hideInput,
	namespaceInputBlankAction.newText,
]);
const inputContainer = ref(null);
const inputArea = ref(null);
const lineCount: Ref<number> = ref(15);
const inputWidth: Ref<number> = ref(120);

const styleProp: Ref<CSSProperties> = ref({
	position: "absolute",
	width: `${inputWidth.value}px`,
	top: `${props.floatInputProperty.position.clientY}px`,
	left: `${props.floatInputProperty.position.clientX}px`,
});
//hooks
onMounted(() => {
	// console.dir(inputContainer.value);
	if (!inputArea.value) return;
	calcHeight();
	calcPosition(props.floatInputProperty.position);
	(inputArea.value as HTMLInputElement).focus();
});
// watch(
// 	() => props.floatInputProperty.position,
// 	// height: styleProp.value.height,

// 	(_new, _old) => {
// 		console.log("_new :>> ", _new); //set position to new pos
// 		console.log("_old :>> ", _old);
// 		calcPosition(_new);
// 	}
// );
// watch(
// 	() => lineCount.value,
// 	(_new, _) => {
// 		console.log("_new :>> ", _new);
// 	}
// );
//functions
function textInputHandle(_e: InputEvent) {
	calcHeight();
	// scrollHeight=scrollHeight>120?120:scrollHeight;
	// calcPosition(props.floatInputProperty.position);
}

function keyDownHandle(e: KeyboardEvent) {
	if (e.key == "Backspace") {
		calcHeight();
		console.log("lineCount.value :>> ", lineCount.value);
	}
	if (
		e.ctrlKey &&
		e.key === "Enter" &&
		!e.shiftKey &&
		!e.altKey &&
		!e.metaKey
	) {
		console.log("two key press :>> ");
		emitHideinput();
		emitNewText((e.target as HTMLTextAreaElement).value);
	}
}
function calcHeight() {
	if (!inputArea.value) return;

	let textarea = inputArea.value as HTMLTextAreaElement;
	textarea.style.height = "auto";

	let scrollHeight: number = textarea.scrollHeight;
	const s = window.getComputedStyle(textarea);
	lineCount.value = scrollHeight / parseInt(s.lineHeight);
	textarea.style.height = `${lineCount.value * parseInt(s.lineHeight)}px`;
}
function calcPosition(newPos: interfacePosition, _height?: number) {
	let windowWidth: number = document.documentElement.clientWidth;
	// let windowHeight: number = document.documentElement.clientHeight;
	//TODO 传菜单的position进来
	let showLeft =
		inputWidth.value + newPos.clientX >= windowWidth - 10
			? newPos.clientX - inputWidth.value
			: newPos.clientX;
	styleProp.value.left = `${showLeft}px`;
}

function emitNewText(newText: string) {
	let action: typeInputBlankEmitsAction = {
		action: namespaceInputBlankAction.newText,
		val: newText,
	};
	inputBlankEmit(namespaceInputBlankAction.newText, action);
}
function abortEditClickHandleFunc() {
	emitHideinput();
	let abortEmitsAction: typeInputBlankEmitsAction = {
		action: namespaceInputBlankAction.abortEdit,
	};
	inputBlankEmit(namespaceInputBlankAction.abortEdit, abortEmitsAction);
}
function emitHideinput() {
	let hideEmitsAction: typeInputBlankEmitsAction = {
		action: namespaceInputBlankAction.hideInput,
		val: false,
	};
	inputBlankEmit(namespaceInputBlankAction.hideInput, hideEmitsAction);
}
</script>

<style scoped lang="scss">
$bkgColor:rgb(236, 236, 236);
.float-input-container {
	border-bottom: 1px solid var(--color-border-default);
	padding: 2px 4px;
	background-color: rgb(238, 238, 238);
	z-index: 99;
	box-sizing: border-box;
	.float-input {
		width: 100%;
		max-height: 104px;
		border: none;
		outline: none;
		font-size: 12px;
		line-height: 15px;
		background-color: $bkgColor;
		color: black;
		resize: none;
		font-family: "微软雅黑";
	}
	.abort-edit-text {
		cursor: pointer;
		width: fit-content;
		height: fit-content;
		position: absolute;
		align-items: center;
		line-height: 10px;
		right: -5px;
		top: -5px;
		border-radius: 50%;
		background-color: $bkgColor;
		color: black;
		user-select: none;
	}
}
</style>
