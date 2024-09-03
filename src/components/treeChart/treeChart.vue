<template>
	<div class="tree-chart" v-if="node">
		<canvas class="draw-canvas" :id="`canvas-for-${node.data.id}`"></canvas>
		<div
			:class="{
				parentLevel:
					Array.isArray(node.children) && node.children.length,
			}"
		>
			<div class="treeNode" :id="node.data.id" ref="curNodeEle">
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
			></treeChart>
		</div>
	</div>
</template>

<script setup lang="ts">
import treeChart from "./treeChart.vue";
import {
	MindNode,
	getFatherNode,
	NodeIdType,
} from "../../interfaces/MindNodeProperty";
import { watch, ref, onMounted } from "vue";
//props and variables
const treeProp = defineProps<{
	node: MindNode;
	treeRoot: MindNode;
}>();

const curNodeEle = ref(null);
interface interfaceNodePos {
	DomRect:DOMRect,
	id: NodeIdType;
}
interface interfaceChildAndFatherPos {
	father: interfaceNodePos;
	child: interfaceNodePos;
}
let childAndFatherPos: interfaceChildAndFatherPos;
/* events methods */

/* live hooks */
watch(treeProp, (_newVal) => {
	//TODO update nodeDomRect
});

onMounted(() => {
	getNodeAndFatherDomRect();
	console.dir( childAndFatherPos);
});
function getNodeAndFatherDomRect() {
	let fatherNode: MindNode;
	let fatherEle: Element;
	let fatherDomRect: DOMRect;
	let nodeDomRect: DOMRect;
	
	if (treeProp.node) {
		const nodeElement: Element = curNodeEle?.value as Element;
		nodeDomRect = nodeElement?.getBoundingClientRect();
		fatherNode = getFatherNode(treeProp.treeRoot, treeProp.node);
		if (fatherNode) {
			fatherEle = document.getElementById(fatherNode.data.id);
			//console.dir(fatherEle.innerHTML)
			//获取元素上边中点和它的父节点的下边中点
			fatherDomRect = fatherEle.getBoundingClientRect();
			//TODO 确定node在canvas里的位置，划线  贝塞尔曲线
			childAndFatherPos = {
				child: {
					DomRect:nodeDomRect,
					id: treeProp.node.data.id,
				},
				father:{
					DomRect:fatherDomRect,
					id:fatherNode.data.id
				}
			};
		}
	}
}
</script>

<style scoped lang="scss">
$nodeBorderColor: #ccc;
$colorNodeBkg: #fafafa;
.tree-chart {
	position: relative;
	width: fit-content;
	box-sizing: border-box;
}
.draw-canvas {
	position: absolute;
	z-index: -1;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	border: 1px solid black;
}
.parentLevel {
	width: fit-content;
	box-sizing: border-box;
}
.childLevel {
	display: flex;
	margin-top: 10px;
	box-sizing: border-box;
}
.treeNode {
	width: fit-content;
	border: 1px solid $nodeBorderColor;
	border-radius: 5px;
	margin: 4px 0.2em 0 0;
	text-align: center;
	box-sizing: border-box;
	padding: 5px;
	background-color: $colorNodeBkg;
	cursor: pointer;
}
</style>
