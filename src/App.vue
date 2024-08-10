<template>
	<div class="page-section">
		<My-msg msg="eeee" :showMsg="false"></My-msg>
		<section class="topbar-section">
			<TopbarView
				v-model="MindFile.mindName"
				@change-mindname="(newName:string)=>changeMindNameHandle(newName)"
				@open-file="openFileHandle"
				@save-file="saveFileHandle"
				@create-file="createFileHandle"
			/>
		</section>
		<section class="main-section">
			<button @click="test">test</button>
			<MainView :mindNode="MindFile.mindNode" />
		</section>
	</div>
</template>

<script setup lang="ts">
import TopbarView from "./components/topbars/TopbarView.vue";
import MainView from "./components/main/MainView.vue";
import { ref } from "vue";
import { EnumReconiteCode,mindFileContent,handleOpenFile,handleNewAndSaveFile } from "../src/interfaces/fileOperate";
import { FileStore } from '../src/store/MIndFileStore'

const fileStore = FileStore()

let MindFile = ref<mindFileContent>({
	reconicode: EnumReconiteCode.MindJson,
	mindName: "Mind",
	mindNode: null,
});
const test = function(){
	fileStore.setFileName('fuck');
	console.log('fileStore :>> ', fileStore.getFileName);

}
function changeMindNameHandle(newName: string): void {
	MindFile.value.mindName = newName;
}
function openFileHandle() {
	console.log('open file');
	handleOpenFile().then(fileContent=>{
		if(!fileContent){
			alert('not type')
		}
		else{
			MindFile.value = fileContent;
			fileStore.setfileContent(MindFile.value)
			console.log('MindFile :>> ', MindFile.value);
		}
		
		
	})

}
function saveFileHandle(){
	handleNewAndSaveFile('');//TODO fileName and fileContent that store in pina store 
}
function createFileHandle(){
	handleNewAndSaveFile('');
}
</script>

<style lang="scss" scoped>
.page-section {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	.topbar-section {
		width: 100%;
		height: var(--height-topbar);
		background-color: var(--color-topBar);
		padding: 9px 15px;
		box-sizing: border-box;
		border-bottom: 1px solid var(--color-border-default);
	}
	.main-section {
		width: 100%;
		height: calc(100% - var(--height-topbar));
		padding: 5px 10px 5px 10px;
		box-sizing: border-box;
		overflow-y: scroll;
	}
}
</style>
