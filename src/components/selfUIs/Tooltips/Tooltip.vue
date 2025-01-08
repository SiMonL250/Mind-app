<template>
	<div class="tooltip-container">
		<div id="tooltipLeaderLineStart"><slot name="body"></slot></div>
		<div class="tooltips" id="tooltipLeaderLineEnd" ref="endEle">
			<slot name="tip"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { tipAlignment } from "./Tooltips.ts";
import { LeadLineOptions } from "../../../interfaces/someInterface";
import LeaderLine from "leader-line-vue";
import { onMounted, ref ,watch,onUnmounted} from "vue";

const props = defineProps<{
	showTip: boolean;
	tipAlign?: tipAlignment;
	label?:string;
}>();
const endEle = ref(null);
const options: LeadLineOptions = {
	startPlug: "disc",
	size: 2,
	startSocket: "right",
	endSocket: "top",
	color: "rgba(0, 0, 0, 0.35)",
	path: "straight",
	endPlug: "arrow3",
	endPlugSize: 2,
	middleLabel:props.label
	// positionByWindowResize:true,
};

let line: LeaderLine;

watch(
	() => props.showTip,
	(_new, _old) => {
		if (!endEle) return;
		if (_new) {
			(endEle.value as HTMLElement).style.opacity = '100';
			(endEle.value as HTMLElement).style.zIndex = '100';

			drawLine();
			line?.show("draw", { duration: 1000, timing: "ease-in-out" });
		} else {
			(endEle.value as HTMLElement).style.opacity = '0';
			(endEle.value as HTMLElement).style.zIndex = '-99';
			line?.hide("draw", { duration: 1000, timing: "ease-in-out" });
		}
	}
);
onMounted(() => {
	if(!endEle) return;
	if(!props.tipAlign){
		return;
	}
	else{
		switch (props.tipAlign){
			case 'bottom':
				(endEle.value as HTMLElement).style.top='100%';
			break;
			case 'left':
				(endEle.value as HTMLElement).style.left='0%';
			break;
			case 'top':
				(endEle.value as HTMLElement).style.top='0%';
			break;
			case 'right':
				(endEle.value as HTMLElement).style.left='100%';
			break;
		}
	}
});
onUnmounted(() => {
	line?.remove();
});
function drawLine() {
	let s = document.getElementById("tooltipLeaderLineStart");
	let e = document.getElementById("tooltipLeaderLineEnd");
	if (s && e) {
		line = LeaderLine.setLine(s, e, options);
		line.hide("none");
	}
}
</script>

<style scoped lang="scss">
.tooltip-container {
	position: relative;
	.tooltips {
		height: 30px;
		line-height: 30px;
		font-size: 24px;
		color: white;
		padding: 4px;
		border-radius: 4px;
		display: block;
		position: absolute;
		background-color: rgba(0, 0, 0, 0.35);
		transition: 1s;
		opacity: 0;
		z-index: -99;
	}
}
</style>
