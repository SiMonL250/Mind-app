<template>
	<div class="topbar">
		<div class="action-section file-section">
			<div class="name-area">
				<div class="label">Mind Map: </div>
				<input
					class="mind-name"
					v-model="model"
					id="mindName"
					spellcheck="false"
					@focusout="
						() => {
							debounce(changeMindNameEmits)(model);
						}
					"
				/>
			</div>
			<div class="file-operate">
				<div v-for="(prop,ind) in buttonsProps" :key="ind" :class="prop.classList" @click="prop.eventClickHandle">
					{{prop.innerText}}
				</div>
			</div>
		</div>
		<div class="action-section nav-action">
		</div>
	</div>
</template>

<script setup lang="ts">
import { debounce } from "../../hooks/debounce";
import {buttonType,buttonProps} from "../../interfaces/ComponentProperty"
import {EnumFileOperation} from "../../interfaces/fileOperate"
// import { reactive } from "vue";


// const topbar_props = defineProps({
// 	name: String,
// });

const model = defineModel()

// const mindName = reactive({name:topbar_props.name})
const buttonsProps:buttonProps[] =[
	{classList:["file-operate-btn"],innerText:"New",type:buttonType.createNewFile,eventClickHandle:newFileBtnClick},
	{classList:["file-operate-btn"],innerText:"open",type:buttonType.openFile,eventClickHandle:selectFileClick},
	{classList:["file-operate-btn"],innerText:"save",type:buttonType.saveFile,eventClickHandle:saveFileClick},
	{classList:["file-operate-btn"],innerText:"shortcuts",type:buttonType.createNewFile,eventClickHandle:shortcutsClick},
];


const Emits = defineEmits<{
	(e: EnumFileOperation.changeMindName, title: string): void;
	(e: EnumFileOperation.openFile,):void;
	(e: EnumFileOperation.createNewFile,):void;
	(e: EnumFileOperation.saveFile,):void;

}>();

function changeMindNameEmits(newName: string): void {
	console.log('newName :>> ', newName);
	Emits(EnumFileOperation.changeMindName, newName);
}
function newFileBtnClick():void {
	Emits(EnumFileOperation.createNewFile);
}
function selectFileClick():void{
	Emits(EnumFileOperation.openFile);
}
function saveFileClick():void{
	Emits(EnumFileOperation.saveFile);
}
function shortcutsClick():void{
	console.log('show shortcut :>> ');
}
</script>

<style scoped lang="scss">
.topbar {
	user-select: none;
	.file-section {
		width: 100%;
		height: calc(var(--height-topbar) * 0.29);
		line-height: calc(var(--height-topbar) * 0.29);
		margin-left: auto 0 auto 10px;
		display: inline-flex;
		font-size: 22px;
		.name-area{
			width: 40%;
			display: inline-flex;
			.label {
				max-height: 100%;
				overflow: hidden;
				margin-right: 14px;
				font-weight: 800;
			}
			.mind-name {
				height: 90%;
				width: fit-content;
				max-width: 75%;
				font-size: inherit;
				margin-top: 2px;
				border: 0;
				outline: none;
				color: var(--color-font);
				cursor: pointer;
				&:hover,
				&:focus {
					text-decoration:2px solid underline;
					color: var(--color-font-focus);
				}
			}
		}
		.file-operate{
			display: flex;
			.file-operate-btn{
				width: fit-content;
				height: fit-content;
				font-size: 20px;
				margin: 0 18px 0 0;
				border: none;
				background-color: white;
				font-family: "consolas";
				cursor: pointer;
				border-bottom: 0px solid var(--color-font-focus);
				transition: .1s ease-in;
				&:hover{
					color: var(--color-font-focus);
					text-decoration: 2px solid underline;
					transform: scale(1.03);
					text-shadow: 1px 1px 2px var(--color-font-focus);
				}
			}
		}
	}

	.action-section {
		border-bottom: 1px solid var(--color-border-default);
	}
}
</style>
