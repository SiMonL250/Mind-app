<template>
	<div ref="messageRef" :class="classess" :style="style" >
		<div class="msg-body" :style="{lineHeight:'32px'}">{{ message.text  }}</div>
	</div>
</template>

<script setup lang="ts">
import { StyleValue } from "vue";
import { onBeforeMount, onMounted,ref } from "vue";
import {msgTypes, typeMessage} from './message'



const message = defineProps<{ text: string,type?:typeMessage,style?:StyleValue}>();
const messageRef = ref<null|HTMLElement>(null);
const classess = ref(["message-container","normal"])
onBeforeMount(()=>{
	if( message.type ){
		if(msgTypes.includes(message.type)){
			classess.value[1] = message.type;
		}
		else{
			console.warn("message type error");
		}
	}

})
onMounted(() => {
	setPosition();
});
function setPosition() {
	if(!messageRef) return;

}
</script>

<style scoped lang="scss">
@import url("./message.scss");
$shadowColor: #929292;
.message-container {
	z-index: 99999;
	//position: fixed;
	border-radius: 8px;
	width: fit-content;
	height: 32px;
	min-width: 100px;
	margin-top: 10px; 
	text-align: center;
	cursor: pointer;
	position:absolute !important;
	//top: 0px;
	left: 50%;
	padding: 4px 18px;
	font-size: 24px;
	box-shadow: 1px 1px 2px $shadowColor;
	.msg-body {
		text-shadow: 0 0 1px $shadowColor;
		font-weight: 400;
	}
}
</style>
