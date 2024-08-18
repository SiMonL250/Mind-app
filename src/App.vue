<template>
	<div class="page-section">
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
			
			<MainView :mindNode="MindFile.mindNode" />
		</section>
	</div>
</template>

<script setup lang="ts">
import TopbarView from "./components/topbars/TopbarView.vue";
import MainView from "./components/main/MainView.vue";
import { ref ,getCurrentInstance,onMounted} from "vue";
import { EnumReconiteCode,mindFileContent,handleOpenFile,handleNewAndSaveFile } from "../src/hooks/fileOperate";
import { FileStore } from '../src/store/MindFileStore'
import {local,mindLocalKey} from '../src/hooks/localStorage.ts'


const instance = getCurrentInstance();

interface sessionStoredType {fileName:string,fileContent:mindFileContent};
const fileStore = FileStore()

let MindFile = ref<mindFileContent>({
	reconicode: EnumReconiteCode.MindJson,
	mindName: "Mind",
	mindNode: null,
});

function showMessage(text:string,type?:string,remainMS?:number){
	instance.proxy.$message(text,type,remainMS);
}


const test = function(){
	showMessage('fuck');
} 
function changeMindNameHandle(newName: string): void {
	console.log("newName :>> ", newName);
	MindFile.value.mindName = newName;
}
function openFileHandle() {
	test()
	handleOpenFile().then(fileRes=>{
		if(!fileRes){
			console.error('what happened? ', fileRes);
		}
		else{
			let fileName = fileRes.fileName;
			MindFile.value = fileRes.mind;
			fileStore.setFileName(fileName);
			fileStore.setfileContent(MindFile.value);
			console.log('MindFile :>> ',fileName);
		}
		
		
	})

}
function saveFileHandle(){
	const name:string = local.get<sessionStoredType>(mindLocalKey).fileName;
	console.log('MindFile.value :>> ', MindFile.value);
	handleNewAndSaveFile(name,MindFile.value);
}
function createFileHandle(){ 
	handleNewAndSaveFile();
}
onMounted(()=>{
	let sessionContent:sessionStoredType =  local.get(mindLocalKey);
	if(sessionContent)
		MindFile.value = sessionContent.fileContent;
})
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
	}
	.main-section {
		width: 100%;
		height: calc(100% - var(--height-topbar));
		padding: 5px 18px ;
		box-sizing: border-box;
		overflow-y: hidden;
	}
}
</style>
