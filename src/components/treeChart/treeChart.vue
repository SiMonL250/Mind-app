<template>
	<div class="tree-chart" v-if="node">
		<div
			:class="{
				parentLevel:
					Array.isArray(node.children) && node.children.length,
			}"
		>
			<div
				:class="{
					treeNode: true,
				}"
				:id="node.data.id"
				ref="curNodeEle"
				@contextmenu="
					(e) => {
						rightClick(e as PointerEvent, node);
					}
				"
			>
				<!-- TODO  focused on node  -->
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
import { MindNode, getFatherNode } from "../../interfaces/MindNodeProperty";
import {
	interfaceChildAndFatherProp,
	LeadLineOptions,
	typeTreeNodeRightClickValType,
} from "./tree";
import { ref, onMounted, onUnmounted } from "vue";
import LeaderLine from "leader-line-vue";
import { watch } from "vue";
import {
	NameSpaceNodeOperate,
	interfaceEmitsAction,
} from "../../hooks/operate";
import { menuProps } from "../selfUIs/ContextMenu/contextMenu";
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
// window.addEventListener(
// 	"resize",
// 	() => {
// 		try {
// 			line?.position();
// 		} catch (e) {}

// 		// 好像有bug？？
// 	},
// 	false
// );

function rightClick(e: PointerEvent, node: MindNode) {
	// console.log("e :>> ", e);
	e.preventDefault();
	//emit to direct parent

	let val: typeTreeNodeRightClickValType = {
		position: { clientX: e.clientX, clientY: e.clientY },
		treeNode: node,
		target: e.target as HTMLElement,
	};
	let action: interfaceEmitsAction<{ treeNode: MindNode }> = {
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
		if (newVal !== oldVal) {
			
			line?.position();
		}
	}
);
// watch(
// 	() => treeProp.node?.data.text,
// 	(newVal, oldVal) => {
// 		console.log('newVal != oldVal :>> ',newVal,oldVal, newVal !== oldVal);
// 		if (newVal != oldVal) {
// 			line?.position();

// 			//TODO 还要监听父、子，然后重绘
// 		}
// 		// line?.position();
// 	}
// );

onMounted(() => {
	getNodeAndFatherProp();
	//console.dir( childAndFatherPos);
	drawByLeaderLine();
	line?.show('draw',{duration:1200,timing:"ease-in-out"})
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
	) {
		return;
	}

	let option: LeadLineOptions = {
		startPlug: "disc",
		endPlug: "disc",
		size: 2,
		startSocket: "bottom",
		endSocket: "top",
		color: "#bbb",
		path: "fluid",
		// positionByWindowResize:true,
	};
	line = LeaderLine.setLine(
		document.getElementById(childAndFatherProp.father.id),
		curNodeEle.value,
		option
	);
	line.hide('none')
}
onUnmounted(() => {
	line?.remove();
});

defineExpose({});
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
	max-width: 120px;
	border: 1px solid $nodeBorderColor;
	border-radius: 5px;
	margin: 15px 0.2em 0 0;
	text-align: center;
	box-sizing: border-box;
	padding: 5px;
	background-color: $colorNodeBkg;
	word-wrap: break-word;
	cursor: pointer;
}
.focused {
	border-color: aqua;
}
</style>
