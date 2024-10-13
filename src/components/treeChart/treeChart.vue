<template>
	<div class="tree-chart" v-if="node">
		<div
			:class="{
				parentLevel:
					Array.isArray(node.children) && node.children.length,
			}"
		>
			<div
				:class="{ treeNode: true}"
				:id="node.data.id"
				ref="curNodeEle"
				@contextmenu="
					(e) => {
						rightClick(e as PointerEvent, node);
					}
				"
			>
			<!-- TODO  focused  -->
				{{ node.data.text }}
			</div>
		</div>

		<div
			:class="{
				childLevel: true,
				parentLevel:
					Array.isArray(node.children) && node.children.length,
			}"
			v-if="node && Array.isArray(node.children) && node.children.length"
		>
			<treeChart
				v-for="(n, ind) in node.children"
				:key="ind"
				:node="n"
				:treeRoot="treeRoot"
				:isMainScroll="isMainScroll"
				@node-right-click="EmitFromChild"
			></treeChart>
		</div>
	</div>
</template>

<script setup lang="ts">
import treeChart from "./treeChart.vue";
import {
	MindNode,
	getFatherNode,
	PriorytyLevel,
} from "../../interfaces/MindNodeProperty";
import { interfaceChildAndFatherProp, LeadLineOptions } from "./tree";
import { ref, onMounted, onUnmounted } from "vue";
import LeaderLine from "leader-line-vue";
import { watch } from "vue";
import {
	NameSpaceNodeOperate,
	interfaceEmitsAction,
} from "../../hooks/operate";
import {
	menuProps,
	rightClickValType,
} from "../selfUIs/contextMenu/contextMenu";
//props and variables
const treeProp = defineProps<{
	node: MindNode;
	treeRoot: MindNode;
	isMainScroll: boolean;
}>();
const emits = defineEmits([NameSpaceNodeOperate.NodeRightClick]);
const curNodeEle = ref(null);
let line: LeaderLine;
let childAndFatherProp: interfaceChildAndFatherProp;

/* events methods */
window.addEventListener(
	"resize",
	() => {
		try{
			line?.position();
		}catch(e){

		}
		
		// 好像有bug？？
	},
	false
);

function rightClick(e: PointerEvent, node: MindNode) {
	// console.log("e :>> ", e);
	e.preventDefault();
	//emit to direct parent
	function itemClick() {
		console.log("itemClick :>> ");
	}
	let val: rightClickValType = {
		menu: {
			position: {
				clientX: e.clientX,
				clientY: e.clientY,
			},
			items: [
				{ id: "editText", text: "edit text", clickEvent: itemClick },
				{ id: "delete", text: "delete", clickEvent: itemClick },
				{
					id: "insert",
					text: "insert",
					subMenu: [
						{
							id: "child",
							text: "child",
							clickEvent: itemClick,
						},
						{
							id: "father",
							text: "father",
							clickEvent: itemClick,
						},
						{
							id: "sibling",
							text: "sibling",
							clickEvent: itemClick,
						},
					],
				},
				{
					id: "setPriority",
					text: "priority",
					subMenu: [
						{
							id: PriorytyLevel.highest,
							text: PriorytyLevel.highest,
							clickEvent: itemClick,
						},
						{
							id: PriorytyLevel.higher,
							text: PriorytyLevel.higher,
							clickEvent: itemClick,
						},
						{
							id: PriorytyLevel.medium,
							text: PriorytyLevel.medium,
							clickEvent: itemClick,
						},
						{
							id: PriorytyLevel.lower,
							text: PriorytyLevel.lower,
							clickEvent: itemClick,
						},
						{
							id: PriorytyLevel.lowest,
							text: PriorytyLevel.lowest,
							clickEvent: itemClick,
						},
						{
							id: PriorytyLevel.none,
							text: PriorytyLevel.none,
							clickEvent: itemClick,
						},
					],
				},
			],
		},
		treeNode: node,
	};
	let action: interfaceEmitsAction<{ menu: menuProps; treeNode: MindNode }> =
		{
			action: NameSpaceNodeOperate.NodeRightClick,
			val: val,
		};
	emits(NameSpaceNodeOperate.NodeRightClick, action);
}
function EmitFromChild(
	action: interfaceEmitsAction<{ menu: menuProps; treeNode: MindNode }>
) {
	emits(NameSpaceNodeOperate.NodeRightClick, action);
}
/* live hooks */
watch(
	() => treeProp.isMainScroll,
	(newVal, oldVal) => {
		if (newVal != oldVal) {
			line?.position();
		}
	}
);
onMounted(() => {
	getNodeAndFatherProp();
	//console.dir( childAndFatherPos);
	drawByLeaderLine();
});
function getNodeAndFatherProp() {
	let fatherNode: MindNode;

	if (treeProp.node) {
		fatherNode = getFatherNode(treeProp.treeRoot, treeProp.node);
		if (fatherNode) {
			childAndFatherProp = {
				child: {
					id: treeProp.node.data.id,
				},
				father: {
					id: fatherNode.data.id, // get canvas by this id
				},
			};
		}
	}
}

function drawByLeaderLine() {
	if (
		!childAndFatherProp &&
		!childAndFatherProp?.child &&
		!childAndFatherProp?.father
	)
		return;
	let option: LeadLineOptions = {
		startPlug: "disc",
		endPlug: "disc",
		size: 2,
		startSocket: "bottom",
		endSocket: "top",
		color: "#bbb",
		path: "fluid",
	};
	line = LeaderLine.setLine(
		document.getElementById(childAndFatherProp.father.id),
		curNodeEle.value,
		option
	);
}
onUnmounted(() => {
	line?.remove();
});
</script>

<style scoped lang="scss">
$nodeBorderColor: #ccc;
$colorNodeBkg: #fafafa;
.tree-chart {
	position: relative;
	width: fit-content;
	box-sizing: border-box;
	user-select: none;
}
.parentLevel {
	width: fit-content;
	box-sizing: border-box;
}
.childLevel {
	display: flex;
	margin-top: 20px;
	box-sizing: border-box;
}
.treeNode {
	width: fit-content;
	border: 1px solid $nodeBorderColor;
	border-radius: 5px;
	margin: 15px 0.2em 0 0;
	text-align: center;
	box-sizing: border-box;
	padding: 5px;
	background-color: $colorNodeBkg;
	cursor: pointer;
}
.focused {
	border-color: aqua;
}
</style>
