<template>
	<div
		class="rolling-container"
		@click="ClickHadle"
		@mouseout="MouseOutHadle"
		ref="RollingContainer"
	>
		<div class="icon">
			<component :is="Icons.get(curIcon)" />
			<!-- <cryingIcon :width="36" :height="36"/> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import {  Ref, ref } from "vue";
import { Icons, interfaceRollItem, typeIconsName } from "./RollingSelect";
//TODO hover时按逆时针旋转出来 ，mouseout时按钮可以藏在12点种方向缩小透明，mousein再出来显现
const curIcon:Ref<typeIconsName> = ref('cry')
const RollingContainer = ref(null);


const itemsRoll: Array<interfaceRollItem> = [{
    index:1,name:"daily",text:'daily',cssProps:{}
}];

const ClickHadle = function (_e: MouseEvent) {

    if(!RollingContainer.value) return;

    (RollingContainer.value as HTMLElement).style.right = '30px';

    
    setTimeout(()=>{
        curIcon.value = 'smile';
    },300);
    setTimeout(()=>{
        (RollingContainer.value as HTMLElement).style.right = '-23px';
        curIcon.value = 'cry'
    },8000);
};
const MouseOutHadle = function (_e: MouseEvent) {
	if (!RollingContainer)return;
	
};
</script>

<style scoped lang="scss">
.rolling-container {
	width: 46px;
	height: 46px;
	border-radius: 50%;
	position: absolute;
	right: -23px;
	top: 9%;
	transition: 0.4s ease-in-out 0.1s;
	border: 1px solid grey;
	z-index: 99;
	.icon {
		height: 100%;
		width: 100%;
	}
}
</style>
