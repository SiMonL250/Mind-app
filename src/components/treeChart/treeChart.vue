<template>
	<div class="tree-chart" v-if="node">
		<canvas class="draw-canvas" :id="`canvas-for-${node.data.id}`"></canvas>
		<div
			:class="{
				parentLevel:
					Array.isArray(node.children) && node.children.length,
			}"
		>
			<div class="treeNode" :id="node.data.id" ref="curNode">
				{{ node.data.text }}
			</div>
		</div>

		<div
			:class="{
				childLevel: true,
				parentLevel:
					Array.isArray(node.children) && node.children.length,
			}"
			v-if="Array.isArray(node.children) && node.children.length"
		>
			<treeChart
				v-for="(n, ind) in node.children"
				:key="ind"
				:node="n"
			></treeChart>
		</div>
	</div>
</template>

<script setup lang="ts">
import treeChart from "./treeChart.vue";
import { MindNode, NodeIdType } from "../../interfaces/MindNodeProperty";
import { watch, ref, onMounted } from "vue";
import { onBeforeMount } from "vue";
//props and variables
const treeProp = defineProps<{
	node: MindNode;
}>();
let nodeDomRect:DOMRect;
const curNode = ref(null);
let nodeId: NodeIdType;
//TODO 获取元素上边中点和它的父节点的下边中点

// const DomRect: DOMRect = (curNode.value as Element).getBoundingClientRect();

/* events methods */

/* live hooks */
watch(treeProp, (_newVal) => {
	//TODO update nodeDomRect
	//console.log("newVal :>> ", newVal.node);
	//traverseMindNode(treeProp.node);
});
onBeforeMount(()=>{
	nodeId = treeProp.node?.data.id;
	//console.log('nodeId :>> ', nodeId);
})
onMounted(() => {
	
	const nodeElement: Element = curNode?.value as Element;
	if(nodeElement) nodeDomRect = nodeElement.getBoundingClientRect();
	//console.log('object :>> ', nodeDomRect);
	
});
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
