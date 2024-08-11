<template>
	<div ref="messageRef" :class="classess" >
		<div class="msg-body">{{ message.text  }}</div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted,ref } from "vue";

const msgTypes:string[]  = ["success", "error", "normal", "warning"];


const message = defineProps<{ text: string,type?:string}>();
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
	top: 0px;
	left: 50%;
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
