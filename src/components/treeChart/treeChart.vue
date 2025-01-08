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
					isFocusedNode:props?.focusedId && props?.focusedId===node.data.id
				}"
				:hasson="node.children && (node.children.length>0)" 
				:hasfather="getFatherNode(treeRoot,node) !==null " 
				:id="node.data.id"
				ref="curNodeEle"
				@contextmenu="
					(e) => {
						rightClick(e as PointerEvent, node);
					}
				"
				@click="nodeClickHandle"
			>
			
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
				:focused-id="props?.focusedId"
				:treeRoot="treeRoot"
				@node-right-click="(action)=>EmitFromChild(NameSpaceNodeOperate.NodeRightClick,action)"
				@node-left-click="(action)=>EmitFromChild(NameSpaceNodeOperate.NodeLeftClick,action)"
			></treeChart>
		</div>
	</div>
</template>

<script setup lang="ts">
import treeChart from "./treeChart.vue";
import { MindNode, getFatherNode, typeNodeId } from "../../interfaces/MindNodeProperty";
import {
interfaceNodeProp,
	typeTreeNodeRightClickValType,
} from "./tree";
import { ref, onMounted, onUnmounted } from "vue";
import {
	NameSpaceNodeOperate,
	interfaceEmitsAction,
} from "../../hooks/operate";
// import { menuProps } from "../selfUIs/ContextMenu/contextMenu";
//props and variables
type typeNodeEvent = "node-right-click" | "node-left-click";
const props = defineProps<{
	node: MindNode;
	treeRoot: MindNode;
	focusedId?:typeNodeId
}>();
const emits = defineEmits([NameSpaceNodeOperate.NodeRightClick,NameSpaceNodeOperate.NodeLeftClick]);
const curNodeEle = ref(null);

/* events methods */

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
	Event:typeNodeEvent,
	action: any//interfaceEmitsAction<{ menu: menuProps; treeNode: MindNode }>
) {
	emits(Event, action);
}
function nodeClickHandle(){
	let action:interfaceEmitsAction<interfaceNodeProp> = {
		action:NameSpaceNodeOperate.NodeLeftClick,
		val:{
			id:props.node.data.id
		}
	}
	emits(NameSpaceNodeOperate.NodeLeftClick,action);
}
/* live hooks */
onMounted(() => {
	
});

onUnmounted(() => {
	
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
	margin: 0 10px 0 0 ;
}
.parentLevel {
	width: fit-content;
	box-sizing: border-box;
}
.childLevel {
	display: flex;
	//margin-top: 20px;
	box-sizing: border-box;
	border-top: 1px solid grey;

}
.treeNode {
	width: fit-content;
	max-width: 120px;
	border: 1px solid $nodeBorderColor;
	border-radius: 5px;
	margin: 14px auto 10px auto;
	text-align: center;
	box-sizing: border-box;
	padding: 5px;
	background-color: $colorNodeBkg;
	word-wrap: break-word;
	position: relative;
	cursor: pointer;
	&[hasfather = true]::before{
		content: "|";
		position: absolute;
		top:-19px;
		left: 50%;
		box-sizing: border-box;
	}
	&[hasSon=true]::after{
		content: "|";
		position: absolute;
		font-size: 12px;
		bottom:-13px;
		left: 50%;
		box-sizing: border-box;
	}
}
.isFocusedNode{
	box-shadow: 3px -3px 4px $nodeBorderColor;
	transition: .15s;
}
.focused {
	border-color: aqua;
}
</style>
