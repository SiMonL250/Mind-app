<template>
	<div class="sidebar">
		<div
			class="sidebar-item"
			v-for="(val, ind) in itemList"
			:key="ind"
			:class="val.classList"
			@click="itemClickEmit(val.toolType)"
		>
			{{ val.innerText }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { sidebarProps, toolTypes } from "../../interfaces/ComponentProperty";
import { NameSpaceOtherOperation,interfaceEmitsAction } from "../../hooks/operate";
//prop emits vars
defineProps<{
	itemList: sidebarProps[];
}>();
const Emits = defineEmits([NameSpaceOtherOperation.switchTool]);
//event functions

function itemClickEmit(toolType:toolTypes){
    let action:interfaceEmitsAction = {
        action:NameSpaceOtherOperation.switchTool,
        val:toolType
    }
    Emits(NameSpaceOtherOperation.switchTool,action);
}

//hooks
</script>

<style scoped lang="scss">
.sidebar {
	height: 100%;
	width: 18%;
	border-right: 1px solid var(--color-border-default);
    .sidebar-item{
        height: 46px;
        line-height: 46px;
        border-bottom: 1px solid var(--color-border-default);
        transition: .4s;
        padding: 0 10px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover{
            text-shadow: 1px 1px 2px var(--color-font-focus);

        }
    }
}
</style>
