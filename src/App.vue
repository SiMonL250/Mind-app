<template>
	<div class="page-section">
		<section class="topbar-section">
			<TopbarView
				v-model="MindFile.mindName"
				@change-mindname="(newName:string)=>changeMindNameHandle(newName)"
				@open-file="openFileHandle"
				@save-file="saveFileHandle"
				@create-file="createFileHandle"
				@show-modal="
					(action:typeSHowModalAction) => {
						if(action.val.type === 'tools'){
							isShowModal = action?.val.show;
						}
						else if(action.val.type === 'shortcut'){
							isShowShortCut = action.val.show;
						}
					}
				"
				@node-action="nodeAction"
			/>
		</section>
		<section
			class="main-section"
			@scroll="
				() => {
					isMainScroll = !isMainScroll;
				}
			"
		>
			<treeChart
				:node="MindFile.mindNode"
				:treeRoot="MindFile.mindNode"
				:is-main-scroll="isMainScroll"
				@node-right-click="(action:interfaceEmitsAction<typeTreeNodeRightClickValType>)=>{
					//console.log('action :>> ', action.val.target);
					//用action.val.target 修改class 更改样式
					treeRightClickAction = action;
					showContextMenu = true;
					focusNode.focusedNode = action.val.treeNode;
					isShowFloatInput = false;
				}"
			/>
			<!-- TODO focused node 特殊显示 -->
		</section>
		<Modal
			:show="true/*isShowModal*/"
			@close-modal="(action:interfaceEmitsAction<boolean>)=>{isShowModal = action.val}"
		>
			<template #title>
				<div>
					<p>my tools box</p>
				</div>
			</template>
			<template #body>
				<div class="side-bar">
					<Sidebar
						:itemList="sidebarItemList"
						@switch-tool="(_action:interfaceEmitsAction<toolTypes>)=>{
						curTool = 'CrcCheck' as toolTypes//_action.val;

					}"
					/>
				</div>
				<!-- change Component --dynamic -->
				<div class="tool-component">
					<component :is="Components.get(curTool)"></component>
				</div>
			</template>
		</Modal>
		<Modal
			:show="isShowShortCut"
			@close-modal="(action:interfaceEmitsAction<boolean>)=>{isShowShortCut = action.val}"
		>
			<template #title>
				<div>
					<p>shortcuts</p>
				</div>
			</template>
			<template #body> List Views </template>
		</Modal>
		<ContextMenu
			:menu="menu"
			:position="treeRightClickAction.val.position"
			:treeNodeId="treeRightClickAction.val.treeNode.data.id"
			v-if="showContextMenu"
			@context-menu-item-click="contextMenuItemClickHandleFunc"
		/>
		<FloatInputBlank
			:floatInputProperty="floatinputProp"
			v-if="isShowFloatInput"
			@hide-input="(action:typeInputBlankEmitsAction)=>{isShowFloatInput = (action.val as boolean)}"
			@new-text="newTextHandle"
		></FloatInputBlank>
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
import { FileStore } from "../src/store/MindFileStore";
import { focusNodeStore } from "./store/focusNodStore";
import { local, mindLocalKey } from "../src/hooks/localStorage.ts";
import { sidebarProps, toolTypes } from "./interfaces/ComponentProperty";
import ContextMenu from "./components/selfUIs/ContextMenu/ContextMenu.vue";
import FloatInputBlank from "./components/selfUIs/FloatInputBlank/FloatInputBlank.vue";
import {
	menu,
	typeItemClickAction,
} from "./components/selfUIs/ContextMenu/contextMenu";
import { Components } from "./components/otherTools";
import {
	interfaceFloatInputProperty,
	typeInputBlankEmitsAction,
} from "./components/selfUIs/FloatInputBlank/floatInputBlank";
import { typeTreeNodeRightClickValType } from "./components/treeChart/tree";
import { typeSHowModalAction } from "./components/topbars/topbar";

/* defines and variables  */
const instance = getCurrentInstance();
interface localStoredType {
	fileName: string;
	fileContent: mindFileContent;
}
//pinia store
const fileStore = FileStore();
const focusNode = focusNodeStore();
const isMainScroll = ref(false);
let MindFile = ref<mindFileContent>({
	reconicode: EnumReconiteCode.MindJson,
	mindName: "Mind",
	mindNode: null,
});
const floatinputProp: Ref<interfaceFloatInputProperty> = ref({
	position: { clientX: 0, clientY: 0 },
	text: "",
});
const isShowFloatInput = ref(false);
const isShowModal = ref(false);
const isShowShortCut = ref(false);
const sidebarItemList: sidebarProps[] = [
	{
		toolType: toolTypes.HexBinDecOct,
		innerText: `${toolTypes.HexBinDecOct}`,
	},
	{ toolType: toolTypes.CrcCheck, innerText: "Crc Check" },
];
const curTool: Ref<toolTypes> = ref(toolTypes.HexBinDecOct);

const treeRightClickAction: Ref<
	interfaceEmitsAction<typeTreeNodeRightClickValType>
> = ref({
	action: "",
	val: {
		position: { clientX: 0, clientY: 0 },
		menu: {
			items: [],
		},
		treeNode: null,
	},
});
const showContextMenu = ref(false);
/* defines and variables  */
/* Even handle function  */

function newTextHandle(action: typeInputBlankEmitsAction) {
	console.log("action :>> ", action);
	console.log("object :>> ", focusNode.getId, focusNode.getText);
	//TODO 修改节点文字
}
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
function nodeAction(action: interfaceEmitsAction<string>) {
	console.log("action :>> ", action);
}

document.body.addEventListener("click", (e: PointerEvent) => {
	decideToShowFloatingThing(e);
});
document.body.addEventListener("contextmenu", (e: PointerEvent) => {
	let target: Element = e.target as Element;
	if (target.className == "menu-items") {
		e.preventDefault();
	}
	decideToShowFloatingThing(e);
});
/* Even handle function  */
/* live Hooks  */
onMounted(() => {
	storeAndMindInit();
});
/* live Hooks  */
/* other functions  */
function showMessage(text: string, type?: string, remainMS?: number) {
	instance.proxy.$message(text, type, remainMS); //有要显示的错误就emit上来就行了
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
function decideToShowFloatingThing(e: PointerEvent) {
	let target: Element = e?.target as Element;
	//floating input
	if (e.type === "click") {
		let selection = window.getSelection();

		if (selection.toString().trim().length !== 0) {
			// selection.removeAllRanges();
			return;
		}
		// console.log("target.className :>> ", target);
		if (
			(target instanceof HTMLElement) &&
			(!target?.className.includes("float-input-container") &&
			!target?.className.includes("float-input") &&
			!target?.className.includes("edit-text"))
		) {
			isShowFloatInput.value = false;
		}
	}
	if (e.type === "contextmenu") {
		if (!target.className.includes("float-input")) {
			isShowFloatInput.value = false;
		}
	}
	// context menu
	if (target.className == "treeNode") return;
	if ((target as HTMLElement).dataset.hasSub === "true") {
		return;
	}
	showContextMenu.value = false;
}
function contextMenuItemClickHandleFunc(itemClickAction: typeItemClickAction) {
	if (!treeRightClickAction.value.val) {
		return;
	}
	// console.log("itemClickAction :>> ", itemClickAction);
	let nodeActionToDo: string = itemClickAction.action;
	if (nodeActionToDo) {
		switch (nodeActionToDo) {
			case "edit-text":
				//show float input blank
				floatinputProp.value.text =
					treeRightClickAction.value.val.treeNode.data.text;
				isShowFloatInput.value = true;
				floatinputProp.value.position = itemClickAction.val.position;
				//确定位置
				break;

			case "delete-node":
				break;

			case "set-priority":
				break;

			case "insert-child":
				break;

			case "insert-parent":
				break;

			case "insert-sibling":
				break;
			default:
				break;
		}
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
	}
}

.side-bar {
	width: 132px;
}
.tool-component {
	width: calc(100% - 132px);
	padding: 4px;
	overflow: scroll;
}
</style>
