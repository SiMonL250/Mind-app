<template>
	<div class="page-section">
		<section class="topbar-section">
			<TopbarView
				v-model="MindFile.mindName"
				@change-mindname="(newName:string)=>changeMindNameHandle(newName)"
				@open-file="openFileHandle"
				@save-file="saveFileHandle"
				@create-file="createFileHandle"
				@show-modal="showModalHandle"
				@node-action="nodeAction"
			/>
		</section>
		<section class="main-section">
			<treeChart :node="MindFile.mindNode" :treeRoot="MindFile.mindNode"/>
		</section>
		<Modal :show="isShowModal" @close-modal="closeModalHandle">
			<template #title>
				<div>
					<p>my tools box</p>
				</div>
			</template>
			<template #body>
				<Sidebar :itemList="sidebarItemList" @switch-tool="switchToolHandle"/>
				<!-- TODO change Component -->
				<div class="tool-component">{{curTool}}</div>
			</template>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import TopbarView from "./components/topbars/TopbarView.vue";
import treeChart from "./components/treeChart/treeChart.vue";
import Modal from "./components/selfUIs/Modal/Modal.vue";
import Sidebar from "./components/sidebars/SidebarView.vue";
import { ref, getCurrentInstance, onMounted, Ref } from "vue";
import {
	EnumReconiteCode,
	mindFileContent,
	handleOpenFile,
	handleNewAndSaveFile,
	interfaceEmitsAction,
} from "../src/hooks/operate";
//import {getFatherNode} from "../src/interfaces/MindNodeProperty"
import { FileStore } from "../src/store/MindFileStore";
import { local, mindLocalKey } from "../src/hooks/localStorage.ts";
import { sidebarProps, toolTypes } from "./interfaces/ComponentProperty";
/* defines and variables  */
const instance = getCurrentInstance();

interface localStoredType {
	fileName: string;
	fileContent: mindFileContent;
}
const fileStore = FileStore();

let MindFile = ref<mindFileContent>({
	reconicode: EnumReconiteCode.MindJson,
	mindName: "Mind",
	mindNode: null,
});
const isShowModal = ref(false);
const sidebarItemList: sidebarProps[] = [
	{toolType:toolTypes.CrcCheck,innerText:"Crc Check"},
	{toolType:toolTypes.HexBinDecOct,innerText:`${toolTypes.HexBinDecOct}`}
];
const curTool:Ref<toolTypes> = ref(toolTypes.CrcCheck);

/* defines and variables  */
/* Even handle function  */
function changeMindNameHandle(newName: string): void {
	console.log("newName :>> ", newName);
	MindFile.value.mindName = newName;
}
function openFileHandle() {
	test();
	handleOpenFile().then((fileRes) => {
		if (!fileRes) {
			console.error("what happened? ", fileRes);
		} else {
			let fileName = fileRes.fileName;
			MindFile.value = fileRes.mind;
			fileStore.setFileName(fileName);
			fileStore.setfileContent(MindFile.value);
			//console.log('father :>> ',getFatherNode(MindFile.value.mindNode,"d33vks5u6ow0"));
		}
	});
}
function saveFileHandle() {
	const name: string = local.get<localStoredType>(mindLocalKey).fileName;
	console.log("MindFile.value :>> ", MindFile.value);
	handleNewAndSaveFile(name, MindFile.value);
}
function createFileHandle() {
	handleNewAndSaveFile();
}
function nodeAction(action: interfaceEmitsAction) {
	console.log("action :>> ", action);
}

function showModalHandle(action: interfaceEmitsAction) {
	// console.log('action :>> ', action);
	isShowModal.value = action?.val;
}
function closeModalHandle(action:interfaceEmitsAction){
	isShowModal.value = action.val;
}
function switchToolHandle(action: interfaceEmitsAction){
	console.log('action.val :>> ', action.val);
	curTool.value = action.val;
}
/* Even handle function  */
/* live Hooks  */
onMounted(() => {
	storeAndMindInit();
});
/* live Hooks  */
/* other functions  */
function showMessage(text: string, type?: string, remainMS?: number) {
	instance.proxy.$message(text, type, remainMS);
}
const test = function () {
	showMessage("fuck");
};
function storeAndMindInit() {
	let localContent: localStoredType = local.get(mindLocalKey);
	if (localContent) {
		MindFile.value = localContent.fileContent;
		fileStore.setFileName(localContent.fileName);
		fileStore.setfileContent(localContent.fileContent);
	}
}
/* other functions  */
</script>

<style lang="scss" scoped>
.page-section {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	position: relative;
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
		padding: 5px 13px 0 13px;
		box-sizing: border-box;
		overflow: scroll;
		&::-webkit-scrollbar {
			width: 6px;
			height: 6px;
			background-color: #ffffff;
		}
		/*定义滚动条轨道
	 内阴影+圆角*/
		&::-webkit-scrollbar-track {
			border-radius: 10px;
			background-color: #ffffff;
		}
		/*定义滑块
		 内阴影+圆角*/
		&::-webkit-scrollbar-thumb {
			border-radius: 10px;
			-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
			background-color: #c9c9c9;
		}
	}
}
.tool-component{
	padding: 4px;
}
</style>
