<template>
	<div class="topbar">
		<div class="action-section file-section">
			<div class="name-area">
				<div class="label">Mind:</div>
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
		<div class="action-section nav-action" @click="(e)=>NodeAction(e)">
			<div class="nav-items redo-and-undo" >
				<button :disabled="props.redoDisable" class="undo items-btn">
					👉
				</button>
				<button :disabled="props.redoDisable" class="redo items-btn">
					👈
				</button>
			</div>
			<div class="nav-items insert-node" >
				<button
					:disabled="props.operateDisable"
					class="insert-child items-btn"
				>
					👶child
				</button>
				<button
					:disabled="props.operateDisable"
					class="insert-father items-btn"
				>
					👨father
				</button>
				<button
					:disabled="props.operateDisable"
					class="insert-sibling items-btn"
				>
					🧑sibling
				</button>
			</div>
			<div class="nav-items node-operate">
				<div class="node-operate-items" >
					<button :disabled="props.operateDisable" class="items-btn">
						👆up
					</button>
					<button :disabled="props.operateDisable" class="items-btn">
						👇down
					</button>
				</div>
				<div class="node-operate-items">
					<button :disabled="props.operateDisable"  class="items-btn">
						✍text
					</button>
					<button :disabled="props.operateDisable" class="items-btn">
						❌delete
					</button>
				</div>
				<div class="node-operate-items priority">
					<button
						:class="`items-btn ${key}`"
						v-for="[key, val] of (enumValues as Array<[string,string]>)"
						:key="key"
						:disabled="props.operateDisable"
					>
						{{ val }}
					</button>
					<button
						class="items-btn"
						
						:disabled="props.operateDisable"
					>
						#
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
import { NameSpaceFileOperation,NameSpaceNodeOperate,interfaceNodeAction } from "../../hooks/operate";
import { ref } from "vue";

const enumValues = ref(
	Object.entries(PriorytyLevel).slice(
		Object.entries(PriorytyLevel).length / 2
	)
);
const model = defineModel();
const props = defineProps({
	redoDisable: {
		type: Boolean,
		default: false,
	},
	operateDisable: {
		type: Boolean,
		default: false,
	},
});
const Emits = defineEmits([
	NameSpaceFileOperation.changeMindName,
	NameSpaceFileOperation.openFile,
	NameSpaceFileOperation.createNewFile,
	NameSpaceFileOperation.saveFile,

	NameSpaceNodeOperate.NodeAction,
]);
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
		type: buttonType.createNewFile,
		eventClickHandle: shortcutsClick,
	},
];


function NodeAction(e:Event,val?:any){
	if((e.target) instanceof Element && (e.target as HTMLElement).tagName !== 'BUTTON') return ;
	console.dir(e.target);
	//TODO 可以把所有的操作放在这里写，以{action:string,value?:any}的形式Emits
	//根据 e.target 判断 action 和 val
	let toEmit:interfaceNodeAction = {action:'fuck',val:val}
	Emits(NameSpaceNodeOperate.NodeAction,toEmit);
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
function shortcutsClick(): void {
	console.log("show shortcut :>> ");
}
</script>

<style scoped lang="scss">
$fileSectionHeight: calc(var(--height-topbar) * 0.29);
$undoWidth: 64px;
$insertWidth: 235px;
$nodeOpWidth: calc(100% - 64px - 150px);

.topbar {
	user-select: none;
	height: 100%;
	word-break: normal;
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
				height: fit-content;
				font-size: 20px;
				margin: 0 18px 0 0;
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
		padding: 4px 0;
		.nav-items {
			border-right: 1px solid var(--color-border-insection);
			padding: 0px 10px;
			box-sizing: border-box;
			.items-btn {
				max-height: 100%;
				transition: 0.3s ease-in;
				padding: 4px;
				box-sizing: border-box;
				display: inline-flex;
				align-items: flex-end;
				justify-content: center;
				font-size: 15px;
				border: none;
				background-color: var(--color-topBar);
				&:hover {
					//background-color: var(--color-border-insection);
					text-shadow: 1px 1px 2px var(--color-font-focus);
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
@media (max-width: 673px) {
	.topbar {
		.file-section {
			.file-operate {
				display: none;
			}
		}
	}
}
@media (max-width: 325px) {
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
