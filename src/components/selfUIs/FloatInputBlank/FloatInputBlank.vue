<template>
	<div class="float-input-container" :style="styleProp" v-if="props.floatInputProperty.isShow">
		<textarea
			type="text"
			v-model="props.floatInputProperty.text"
			class="input"
			maxlength="58"
			@input="autoResize"
			rows="1"
		/>
		<div class="abort-edit-text" @click="abortEditClickHandleFunc">x</div>
	</div>
</template>

<script setup lang="ts">
import { CSSProperties, Ref, ref } from "vue";
import { interfaceFloatInputProperty } from "./floatInputBlank";
import { onMounted } from "vue";
const props = defineProps<{
	floatInputProperty: interfaceFloatInputProperty;
}>();
const inputBlankEmit = defineEmits([]);
const inputWidth: Ref<number> = ref(120);
//	menuStyleClass.value.top = `${showY}px`;
// menuStyleClass.value.left = `${showX}px`;
const styleProp: Ref<CSSProperties> = ref({
	position: "absolute",
	width: `${inputWidth.value}px`,
	top: "134px",
	left: "400px",
});
//hooks
onMounted(()=>{

})
//functions
function autoResize(e: InputEvent) {
	let textarea = e.target as HTMLTextAreaElement;
	let scrollHeight: number = textarea.scrollHeight;
	// scrollHeight=scrollHeight>120?120:scrollHeight;
	textarea.style.height = scrollHeight + "px";
}

function abortEditClickHandleFunc() {}
</script>

<style scoped lang="scss">
.float-input-container {
	border-bottom: 1px solid var(--color-border-default);
	padding: 5px 4px;
	background-color: rgb(238, 238, 238);
	z-index: 99;
	box-sizing: border-box;
	.input {
		height: 100%;
		width: 100%;
		max-height: 134px;
		border: none;
		outline: none;
		font-size: 16px;
		background-color: rgb(236, 236, 236);
		color: black;
		resize: none;
	}
	.abort-edit-text {
		cursor: pointer;
		width: 10px;
		height: 10px;
		position: absolute;
		align-items: center;
		line-height: 10px;
		right: -5px;
		top: -5px;
		border-radius: 50%;
		background-color: rgb(255, 255, 255);
		transition: 0.25s;
		color: black;

		&:hover {
			transform: scale(1.23);
		}
	}
}
</style>
