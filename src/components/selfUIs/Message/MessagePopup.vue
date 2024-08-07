<template>
	<div :class="classList">
		<div class="msg-body">{{ message.msg + message.type}}</div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, reactive } from "vue";
import {msgTypes} from "./message"

const message = defineProps<{ msg: string,type?:string}>();
const classList = reactive(['message-container','normal'])

onBeforeMount(()=>{

	if( message.type ){
		if(msgTypes.includes(message.type)){
			classList[1] = message.type;
		}
		else{
			console.warn("message type error");
		}
	}

})
onMounted(() => {
	console.log("message :>> ", message);

});
</script>

<style scoped lang="scss">
@import url("./message.scss");
$msgContainerHeight:32px;
$shadowColor:#929292;
.message-container {
	z-index: 99999;
	//position: fixed;
	border-radius: 8px;
	width: fit-content;
	min-width: 100px;
	margin-top: 10px; //TODO margin 和 位置得计算出来
	height: $msgContainerHeight;
	text-align: center;
	display: block;
	position: fixed;
	//border: 1px solid var(--color-border-default);
    padding: 4px 18px;
    font-size: 24px;
	box-shadow: 1px 1px 2px $shadowColor;
	.msg-body{
		text-shadow: 0 0 1px $shadowColor;
		line-height: $msgContainerHeight;
		font-weight: 400;
	}
}
</style>
