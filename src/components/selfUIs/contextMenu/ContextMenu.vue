<template>
	<div class="conetext-menu-containner" :style="styleClass" ref="container">
		<div
			class="menu-items"
			v-for="(item, ind) of props.menu.items"
			:key="ind"
		>
			<!-- TODO subMenu -->
			{{ item.text }}
			<div v-if="item.subMenu">&gt;</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CSSProperties, onMounted, ref, Ref, watch } from "vue";
import { menuProps, menuPosition } from "./contextMenu";
const menuWidth: number = 176;
const props = defineProps<{
	menu: menuProps;
}>();
const container = ref(null);
const styleClass: Ref<CSSProperties> = ref({
	position: "absolute",
	width: `${menuWidth}px`,
});
watch(
	() => props.menu.position,
	(newVal, _) => {
		calcMenuPosition(newVal);
	}
);
onMounted(() => {
	calcMenuPosition();
});

function calcMenuPosition(newVal?: menuPosition) {
	//TODO 计算菜单显示位置，不然会被窗口遮住
	if (!container) return;
	let windowWidth: number = document.documentElement.clientWidth;
	let windowHeight: number = document.documentElement.clientHeight;
	let menuHeight: number = (container.value as HTMLElement).offsetHeight;
	let menuWidth: number = (container.value as HTMLElement).offsetWidth;
	
	console.log("W&H :>> ", {
		wH: windowHeight,
		wW: windowWidth,
		mH: menuHeight,
		mW: menuWidth,
	});
	if (!newVal) {
		styleClass.value.top = `${props.menu.position.clientY}px`;
		styleClass.value.left = `${props.menu.position.clientX}px`;
	} else {
		styleClass.value.top = `${newVal.clientY}px`;
		styleClass.value.left = `${newVal.clientX}px`;
	}
}
</script>

<style scoped lang="scss">
.conetext-menu-containner {
	display: block;
	background-color: rgb(252, 252, 252);
	z-index: 10;
	border: 1px solid var(--color-border-default);
	padding: 10px 5px;
	cursor: pointer;
	border-radius: 5px;
	box-sizing: border-box;
	user-select: none;
	&::-webkit-scrollbar {
		width: 3px;
		height: 3px;
		background-color: #ffffff;
	}
	/*定义滚动条轨道 内阴影+圆角*/
	&::-webkit-scrollbar-track {
		border-radius: 10px;
		background-color: #ffffff;
	}
	/*定义滑块 内阴影+圆角*/
	&::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
		background-color: #fdfdfd;
	}

	.menu-items {
		height: 36px;
		max-width: 176px;
		overflow-x: hidden;
		padding: 0 4px;
		line-height: 36px;
		border-bottom: 1px solid var(--color-border-default);
		transition: 0.12s;
		display: flex;
		justify-content: space-between;
		&:hover {
			background-color: rgb(233, 233, 233);
		}
	}
}
</style>
