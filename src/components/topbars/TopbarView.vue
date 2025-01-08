<template>
	<div class="topbar">
		<div class="action-section file-section">
			<div
				class="name-area"
				ref="nameArea"
				@mouseover="nameMouseOverHandle"
			>
				<Tooltip :showTip="showTip" :tipAlign="'bottom'" ref="tooltips" label="file name">
					<!-- TODO align的计算 -->
					<template #body>
						<div class="label" @mouseenter="()=>{showTip = true}" @mouseleave="()=>{showTip = false}">
							MindName:
						</div>
					</template>
					<template #tip>
							{{props.fileName}}
					</template>
				</Tooltip>
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
				<div
					v-for="(prop, ind) in buttonsProps"
					:key="ind"
					:class="prop.classList"
					@click="prop.eventClickHandle"
				>
					{{ prop.innerText }}
				</div>
			</div>
		</div>
		<div class="action-section nav-action" @click="(e) => NodeAction(e)">
			<div class="nav-items redo-and-undo">
				<button
					:disabled="props.buttonDisabled.undoRedoDisabled"
					class="undo items-btn"
					:data-action="NameSpaceNodeOperate.redo"
				>
					👉
				</button>
				<button
					:disabled="props.buttonDisabled.undoRedoDisabled"
					class="redo items-btn"
					:data-action="NameSpaceNodeOperate.undo"
				>
					👈
				</button>
			</div>
			<div class="nav-items insert-node">
				<button
					:disabled="props.buttonDisabled.insertDisabled"
					class="insert-child items-btn"
					:data-action="NameSpaceNodeOperate.insertNodeChild"
				>
					👶child
				</button>
				<button
					:disabled="props.buttonDisabled.insertDisabled"
					class="insert-father items-btn"
					:data-action="NameSpaceNodeOperate.insertNodeParent"
				>
					👨father
				</button>
				<button
					:disabled="props.buttonDisabled.insertDisabled"
					class="insert-sibling items-btn"
					:data-action="NameSpaceNodeOperate.insertNodeSibling"
				>
					🧑sibling
				</button>
			</div>
			<div class="nav-items node-operate">
				<div class="node-operate-items">
					<button
						:disabled="props.buttonDisabled.upAndDownDisabled"
						class="items-btn"
						:data-action="NameSpaceNodeOperate.moveUp"
					>
						👆up
					</button>
					<button
						:disabled="props.buttonDisabled.upAndDownDisabled"
						class="items-btn"
						:data-action="NameSpaceNodeOperate.moveDown"
					>
						👇down
					</button>
				</div>
				<div class="node-operate-items">
					<button
						:disabled="props.buttonDisabled.editTextAndDeleteDisabled"
						class="items-btn"
						:data-action="NameSpaceNodeOperate.editText"
					>
						✍text
					</button>
					<button
						:disabled="props.buttonDisabled.editTextAndDeleteDisabled"
						class="items-btn"
						:data-action="NameSpaceNodeOperate.deleteNode"
					>
						❌delete
					</button>
				</div>
				<div class="node-operate-items priority">
					<button
						:class="`items-btn ${key}`"
						v-for="[key, val] of (enumValues as Array<[string,string]>)"
						:key="key"
						:disabled="props.buttonDisabled.setPriorityDisabled"
						:data-action="NameSpaceNodeOperate.setPriority"
						:data-val="val"
					>
						{{ val }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { debounce } from "../../hooks/debounce";
import { buttonType, buttonProps } from "../../interfaces/ComponentProperty";
import { PriorytyLevel } from "../../interfaces/MindNodeProperty";
import {
	NameSpaceFileOperation,
	NameSpaceNodeOperate,
	NameSpaceOtherOperation,
	interfaceEmitsAction,
} from "../../hooks/operate";
import { ref, onMounted } from "vue";
import { typeModalType, typeShowModalAction,interfacebuttonsDisabled } from "./topbar";
import Tooltip from "../selfUIs/Tooltips/Tooltip.vue";

const enumValues = ref(Object.entries(PriorytyLevel));
const model = defineModel();
const props = defineProps<{
	fileName: string,
	buttonDisabled?:interfacebuttonsDisabled
}>();
const nameArea = ref(null);
onMounted(() => {});
const Emits = defineEmits([
	NameSpaceFileOperation.changeMindName,
	NameSpaceFileOperation.openFile,
	NameSpaceFileOperation.createNewFile,
	NameSpaceFileOperation.saveFile,
	NameSpaceOtherOperation.showModal,
	NameSpaceNodeOperate.NodeAction,
]);
const showTip = ref(false);
// const mindName = reactive({name:topbar_props.name})
const buttonsProps: buttonProps[] = [
	{
		classList: ["file-operate-btn"],
		innerText: "new🎁",
		type: buttonType.createNewFile,
		eventClickHandle: newFileBtnClick,
	},
	{
		classList: ["file-operate-btn"],
		innerText: "open🤤",
		type: buttonType.openFile,
		eventClickHandle: selectFileClick,
	},
	{
		classList: ["file-operate-btn"],
		innerText: "save👻",
		type: buttonType.saveFile,
		eventClickHandle: saveFileClick,
	},
	{
		classList: ["file-operate-btn"],
		innerText: "shortcut🔪",
		type: buttonType.showModal,
		eventClickHandle: () => showModalClick("shortcut"),
	},
	{
		classList: ["file-operate-btn"],
		innerText: "tools🔨",
		type: buttonType.showModal,
		eventClickHandle: () => showModalClick("tools"),
	},
];

function nameMouseOverHandle() {
	if (nameArea.value) {
		(nameArea.value as HTMLElement).style.setProperty(
			"--content",
			props.fileName
		);
	}
}
function NodeAction(e: Event) {
	if (
		e.target instanceof Element &&
		(e.target as HTMLElement).tagName !== "BUTTON"
	)
		return;

	//把所有的操作Emits放在这里写，以{action:string,value?:any}的形式Emits
	//根据 e.target 判断 action 和 val

	let target = e.target as HTMLElement;
	let toEmit: interfaceEmitsAction<string> = {
		action: target.dataset["action"],
		val: target.dataset["val"],
	};
	Emits(NameSpaceNodeOperate.NodeAction, toEmit);
}

function changeMindNameEmits(newName: string): void {
	Emits(NameSpaceFileOperation.changeMindName, newName);
}
function newFileBtnClick(): void {
	Emits(NameSpaceFileOperation.createNewFile);
}
function selectFileClick(): void {
	Emits(NameSpaceFileOperation.openFile);
}
function saveFileClick(): void {
	Emits(NameSpaceFileOperation.saveFile);
}
function showModalClick(type: typeModalType): void {
	// emits modal show
	let actions: typeShowModalAction = {
		action: NameSpaceOtherOperation.showModal,
		val: {
			type: type,
			show: true,
		},
	};
	Emits(NameSpaceOtherOperation.showModal, actions);
}
</script>

<style scoped lang="scss">
$fileSectionHeight: calc(var(--height-topbar) * 0.29);
$undoWidth: 64px;
$insertWidth: 235px;
$nodeOpWidth: calc(100% - $undoWidth - $insertWidth);

.topbar {
	user-select: none;
	height: 100%;
	word-break: normal;
	box-sizing: border-box;
	.file-section {
		width: 100%;
		height: $fileSectionHeight;
		line-height: $fileSectionHeight;
		margin-left: auto 0 auto 10px;
		display: inline-flex;
		font-size: 22px;
		.name-area {
			width: 40%;
			display: inline-flex;
			position: relative;

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
				transition: 0.2s ease-in;
				&:hover,
				&:focus {
					text-decoration: 2px solid underline;
					color: var(--color-font-focus);
				}
			}
		}
		.file-operate {
			display: flex;
			.file-operate-btn {
				width: fit-content;
				height: 36px;
				max-height: 36px;
				overflow: hidden;
				font-size: 17px;
				margin: 0 12px 0 0;
				border: none;
				background-color: white;
				font-family: "consolas";
				cursor: pointer;
				border-bottom: 0px solid var(--color-font-focus);
				transition: 0.1s ease-in;
				&:hover {
					color: var(--color-font-focus);
					text-decoration: 2px solid underline;
					transform: scale(1.03);
					text-shadow: 1px 1px 2px var(--color-font-focus);
				}
			}
		}
	}

	.nav-action {
		display: flex;
		height: calc(100% - $fileSectionHeight);
		.nav-items {
			border-right: 1px solid var(--color-border-insection);
			padding: 0px 10px;
			box-sizing: border-box;
			overflow: hidden;
			.items-btn {
				max-height: 100%;
				transition: 0.3s ease-in;
				padding: 4px;
				box-sizing: border-box;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border: none;
				background-color: var(--color-topBar);
				&:disabled{
					color:rgb(223, 222, 222)
				}
				&:enabled{
					color: var(--color-font-focus);
				}
				&:hover {
					//background-color: var(--color-border-insection);
					text-shadow: 1px 1px 2px grey;//var(--color-font-focus);
					background-color: aliceblue;
				}
				&[disabled] {
					cursor: not-allowed;
					&:hover {
						background-color: var(--color-topBar);
						text-shadow: none;
						
					}
				}
			}
		}
		.redo-and-undo {
			width: $undoWidth;
			min-width: 50px;
			display: grid;
			grid-template-rows: 1fr 1fr;
			grid-template-columns: 1fr;
			div {
				width: 36px;
				align-items: center;
				justify-content: center;
				display: flex;
			}
			.undo {
				border-bottom: 1px solid var(--color-border-insection);
			}
		}
		.insert-node {
			width: $insertWidth;
			min-width: 210px;
			display: grid;
			grid-template-rows: 1fr 1fr; /* 创建两行，各占剩余空间的比例 */
			grid-template-columns: 1fr 1fr; /* 创建两列，各占剩余空间的比例 */
			div {
				font-weight: 500;
			}
			.insert-child {
				border-bottom: 1px solid var(--color-border-insection);
				border-right: 1px solid var(--color-border-insection);
			}
			.insert-father {
				border-bottom: 1px solid var(--color-border-insection);
			}
			.insert-sibling {
				border-right: 1px solid var(--color-border-insection);
			}
		}
		.node-operate {
			width: $nodeOpWidth;
			min-width: 680px;
			border-right: none;
			display: grid;
			grid-template-columns: 1fr 1fr 2fr 4fr;
			padding-left: 0;
			.node-operate-items {
				border-right: 1px solid var(--color-border-insection);
				display: grid;
				grid-template-rows: 1fr 1fr;
				padding: 4px;
				.items-btn:first-child {
					border-bottom: 1px solid var(--color-border-insection);
				}
			}
			.priority {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;
				.medium,
				.higher {
					border-bottom: 1px solid var(--color-border-insection);
				}
				.highest,
				.higher,
				.lower,
				.lowest {
					border-right: 1px solid var(--color-border-insection);
				}
			}
		}
	}
	.action-section {
		border-bottom: 1px solid var(--color-border-default);
	}
}
@media (max-width: 612px) {
	.topbar {
		.file-section {
			.file-operate {
				display: none;
			}
		}
	}
}
@media (max-width: 470px) {
	.topbar {
		.nav-action {
			.node-operate,
			.insert-node {
				display: none;
			}
		}
	}
}
</style>
