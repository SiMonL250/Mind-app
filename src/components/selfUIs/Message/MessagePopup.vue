<template>
	<div ref="messageRef" :class="messageAttr.classList" v-show="showMsg?showMsg:false">
		<div class="msg-body">{{ messageAttr.text + messageAttr.classList[1] }}</div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted,ref ,reactive} from "vue";
import {msgProperty, msgTypes} from "./message"

const message = defineProps<{ msg: string,type?:string,showMsg?:boolean}>();
const messageAttr = reactive<msgProperty>({text:"",classList:["message-container","normal"],remainTime:3000,positionX:0,positionY:0});
const messageRef = ref<null|HTMLElement>(null);
onBeforeMount(()=>{
	if( message.type ){
		if(msgTypes.includes(message.type)){
			messageAttr.classList[1] = message.type;
		}
		else{
			console.warn("message type error");
		}
	}

})
onMounted(() => {
	setPosition();

});
//TODO  消息队列，计算位置, 动态加载 
function setPosition() {
	if(!messageRef) return;

}
</script>

<style scoped lang="scss">
@import url("./message.scss");
$msgContainerHeight: 32px;
$shadowColor: #929292;
.message-container {
	z-index: 99999;
	//position: fixed;
	border-radius: 8px;
	width: fit-content;
	min-width: 100px;
	margin-top: 10px; //TODO margin 和 位置得计算出来
	height: $msgContainerHeight;
	text-align: center;
	cursor: pointer;
	position:absolute;
	padding: 4px 18px;
	font-size: 24px;
	box-shadow: 1px 1px 2px $shadowColor;
	.msg-body {
		text-shadow: 0 0 1px $shadowColor;
		line-height: $msgContainerHeight;
		font-weight: 400;
	}
}
</style>
