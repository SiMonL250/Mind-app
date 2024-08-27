<template>
    <table v-if="mindNode" class="tree-node">
        <tr>
            <td >
                <div class="node-text">{{mindNode.data.text}}</div>
            </td>
        </tr>
        <tr v-if="Array.isArray(mindNode.children) && mindNode.children">
            <td v-for="(children,ind) in mindNode.children" :key="ind" > 
                <treeChart  :mindNode="children"></treeChart>
            </td>
        </tr>
    </table>
</template>

<script setup lang="ts">
import treeChart from "./treeChart.vue" 
import {MindNode} from "../../interfaces/MindNodeProperty"
import { watch } from "vue";
const treeProp = defineProps<{
    mindNode:MindNode
}>();

watch(treeProp,(newVal)=>{
    console.log('newVal :>> ', newVal.mindNode.data);
})
</script>

<style scoped lang="scss">
.tree-node{
    border: 1px solid var(--color-border-default);
    box-sizing: border-box;
}
.node-text{
    border: 1px solid var(--color-border-default);
}
</style>