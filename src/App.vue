<template>
	<div class="page-section">
		<section class="topbar-section">
			<TopbarView
				v-model="MindFile.mindName"
				:fileName="MindFile.fileName"
				:button-disabled="topBarButtonsDisabled"
				@change-mindname="(newName:string)=>changeMindNameHandle(newName)"
				@open-file="openFileHandle"
				@save-file="saveFileHandle"
				@create-file="createFileHandle"
				@show-modal="
					(action:typeShowModalAction) => {
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
				(e) => {
					decideToShowFloatingThing(e);
				}
			"
		>
			<RollingSelect />
			<treeChart
				:node="MindFile.mindNode"
				:treeRoot="MindFile.mindNode"
				:is-text-change="isTextChange"
				:focused-id="focusNode.getId"
				@node-left-click="NodeLeftClickHandle"
				@node-right-click="(action:interfaceEmitsAction<typeTreeNodeRightClickValType>)=>{
					//console.log('action :>> ', action.val.target);
					//用action.val.target 修改class 更改样式
					treeRightClickAction = action;
					showContextMenu = true;
					focusNode.focusedNode = action.val.treeNode;
					isShowFloatInput = false;
				}"
				ref="treeChartRef"
			/>

		</section>
		<Modal
			:show="isShowModal /*   true*/"
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
						curTool = _action.val;'CrcCheck'
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
import RollingSelect from "./components/selfUIs/RollingSelect/RollingSelect.vue";
import { ref, getCurrentInstance, onMounted, Ref } from "vue";
import {
	EnumReconiteCode,
	mindFileContent,
	handleOpenFile,
	handleNewAndSaveFile,
	interfaceEmitsAction,
	DidDomTokenListContainsArrayEle as DomTokenListContainsArrayEle,
	ArrayWhiteNameClassesWhenClickTounFoucused,
} from "../src/hooks/operate";
import { FileStore } from "../src/store/MindFileStore";
import { focusNodeStore } from "./store/focusNodStore";
import { local, mindLocalKey } from "../src/hooks/localStorage.ts";
import { sidebarItemList, toolTypes } from "./interfaces/ComponentProperty";
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
import {
	interfaceNodeProp,
	typeTreeNodeRightClickValType,
} from "./components/treeChart/tree";
import {
	interfacebuttonsDisabled,
	typeShowModalAction,
} from "./components/topbars/topbar";
import {
	KeyPropertyText,
	deleteNode,
	getFatherNodeByChildId,
	insertChildNode,
	insertFatherNode,
	insertSiblingNode,
	typeNodeId,
	updateNodeProperty,
	findMindNodebyId,
} from "./interfaces/MindNodeProperty";
import { typeMessage } from "./components/selfUIs/Message/message";
import { watch } from "vue";

/* defines and variables  */
const instance = getCurrentInstance();
interface localStoredType {
	fileName: string;
	fileContent: mindFileContent;
}
//pinia store
const fileStore = FileStore();
const focusNode = focusNodeStore();
let MindFile = ref<mindFileContent>({
	reconicode: EnumReconiteCode.MindJson,
	mindName: "Mind",
	mindNode: null,
	fileName: "",
});
const floatinputProp: Ref<interfaceFloatInputProperty> = ref({
	position: { clientX: 0, clientY: 0 },
	text: "",
});
const isShowFloatInput = ref(false);
const isShowModal = ref(false);
const isTextChange = ref(false);
const isShowShortCut = ref(false);

const topBarButtonsDisabled: Ref<interfacebuttonsDisabled> = ref({
	undoRedoDisabled: true,
	insertDisabled: true,
	editTextAndDeleteDisabled: true,
	upAndDownDisabled: true,
	setPriorityDisabled: true,
});
const curTool: Ref<toolTypes> = ref(toolTypes.CrcCheck);

const treeChartRef = ref(null);

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
	// console.log("action :>> ", action);
	if (!action.val) return;
	//prop emits 还是 defineExpose
	updateNodeProperty(
		MindFile.value.mindNode,
		focusNode.getId,
		KeyPropertyText,
		action.val
	);
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
			MindFile.value.mindName = fileRes.mind.mindName;
			MindFile.value.mindNode = fileRes.mind.mindNode;
			MindFile.value.reconicode = fileRes.mind.reconicode;
			MindFile.value.fileName = fileName;
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
	// TODO 完善这里的功能
	console.log("action :>> ", action);
}

document.body.addEventListener("click", (e: PointerEvent) => {
	decideToShowFloatingThing(e);
	decideToKeepFocusedNodeWhenLeftClick(e);
});
document.body.addEventListener("contextmenu", (e: PointerEvent) => {
	let target: Element = e.target as Element;
	if (target.className == "menu-items") {
		e.preventDefault();
	}
	console.log("contextmenu :>> ", target.classList);
	decideToShowFloatingThing(e);
});
function NodeLeftClickHandle(action: interfaceEmitsAction<interfaceNodeProp>) {
	if (!action.val.id) {
		showMessage("why id is null??", "error");
		throw "why id is null??";
	}
	if (action.val.id === focusNode.getId) {
		focusNode.focusedNode = null;
		return;
	}
	focusNode.focusedNode = findMindNodebyId(
		MindFile.value.mindNode,
		action.val.id
	);

}
/* Even handle function  */
/* live Hooks  */
onMounted(() => {
	storeAndMindInit();
});
watch(
	() => focusNode.focusedNode,
	(_new, _old) => {
		if (_new) {
			topBarButtonsDisabled.value.editTextAndDeleteDisabled = false;
			topBarButtonsDisabled.value.insertDisabled = false;
			topBarButtonsDisabled.value.setPriorityDisabled = false;
			topBarButtonsDisabled.value.upAndDownDisabled = false;
		} else {
			topBarButtonsDisabled.value.editTextAndDeleteDisabled = true;
			topBarButtonsDisabled.value.insertDisabled = true;
			topBarButtonsDisabled.value.setPriorityDisabled = true;
			topBarButtonsDisabled.value.upAndDownDisabled = true;
		}
	}
);
/* live Hooks  */
/* other functions  */
function showMessage(text: string, type?: typeMessage, remainMS?: number) {
	instance.proxy.$message(text, type, remainMS);
	//有要显示的错误就emit上来就行了
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
function decideToShowFloatingThing(e: PointerEvent | Event) {
	//TODO 可能会有需要完善的
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
			target instanceof HTMLElement &&
			!DomTokenListContainsArrayEle(target.classList, [
				"edit-text",
				"float-input-container",
				"float-input",
			])
		) {
			isShowFloatInput.value = false;
		}

		if (
			!DomTokenListContainsArrayEle(target.classList, [
				"treeNode",
				"float-input",
				"menu-items",
				"conetext-menu-containner",
			])
		) {
			showContextMenu.value = false;
		} else {
			if (target.classList.contains("delete-node")) {
				showContextMenu.value = false;
			} else {
				showContextMenu.value = true;
			}
		}
	}
	if (e.type === "contextmenu") {
		if (!target.className.includes("float-input")) {
			isShowFloatInput.value = false;
		}
		if (
			DomTokenListContainsArrayEle(target.classList, [
				"treeNode",
				"float-input",
			])
		) {
			showContextMenu.value = true;
		} else {
			showContextMenu.value = false;
		}
	}
	if (e.type == "scroll") {
		showContextMenu.value = false;
		isShowFloatInput.value = false;
	}
}
function decideToKeepFocusedNodeWhenLeftClick(e: PointerEvent) {
	let el = e.target as HTMLElement;
	if (
		!DomTokenListContainsArrayEle(
			el.classList,
			ArrayWhiteNameClassesWhenClickTounFoucused
		)
	) {
		focusNode.focusedNode = null;
	}
}
function contextMenuItemClickHandleFunc(itemClickAction: typeItemClickAction) {
	if (!treeRightClickAction.value.val) {
		return;
	}
	console.log("itemClickAction :", itemClickAction);
	let nodeActionToDo: string = itemClickAction.action;
	let nodeId: typeNodeId = itemClickAction.val.nodeId as typeNodeId;
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
				if (!nodeId) {
					showMessage("null node id!", "error");
					return;
				}
				// console.log('delete :' ,treeRightClickAction.value);
				if (!getFatherNodeByChildId(MindFile.value.mindNode, nodeId)) {
					showMessage("root can`t be delete!", "warning");
					return;
				} else {
					MindFile.value.mindNode = deleteNode(
						MindFile.value.mindNode,
						nodeId
					);
					// console.dir(findMindNodebyId(MindFile.value.mindNode,nodeId));
				}
				break;
			case "insert-child":
				insertChildNode(MindFile.value.mindNode, nodeId);
				break;

			case "insert-parent":
				if (!getFatherNodeByChildId(MindFile.value.mindNode, nodeId)) {
					showMessage("root dosen`t have parent!", "warning");
					return;
				}
				insertFatherNode(MindFile.value.mindNode, nodeId);
				break;

			case "insert-sibling":
				if (!getFatherNodeByChildId(MindFile.value.mindNode, nodeId)) {
					showMessage("root dosen`t have sibling!", "warning");
					return;
				}
				insertSiblingNode(MindFile.value.mindNode, nodeId);
				break;
			case "set-priority":
				console.log(
					"priority :>> ",
					nodeId,
					itemClickAction.val.someString
				);
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
		//position: relative;
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
