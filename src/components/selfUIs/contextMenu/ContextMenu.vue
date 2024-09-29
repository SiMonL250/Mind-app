<template>
	<div
		class="conetext-menu-containner"
		:style="menuStyleClass"
		ref="container"
	>
		<div
			class="menu-items"
			v-for="(item, ind) of props.menu.items"
			:key="ind"
			@click="menuItemClick(item)"
		>
			<!-- TODO subMenu -->
			{{ item.text }}
			<div v-if="item.subMenu">&gt;</div>
			<div
				v-if="
					item.subMenu &&
					showSubMenu.id == item.id &&
					showSubMenu.show
				"
				class="submenu-container"
				:style="subMenuStyleClass"
				ref="subMenu"
			>
				<div
					class="submenu-item"
					v-for="(i, ind) of item.subMenu"
					:key="ind"
				>
					{{ i.text }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CSSProperties, onMounted, ref, Ref, watch } from "vue";
import { menuProps, contextMenuItem } from "./contextMenu";
const menuWidth: number = 176;
const subMenuWidth: number = 78;
const showSubMenu = ref({ id: "", show: false });
const props = defineProps<{
	menu: menuProps;
}>();
const container = ref(null);
const subMenu = ref(null);
const menuStyleClass: Ref<CSSProperties> = ref({
	position: "absolute",
	width: `${menuWidth}px`,
});
const subMenuStyleClass: Ref<CSSProperties> = ref({
	width: `${subMenuWidth}px`,
	right: `${-subMenuWidth - 5}px`,
});
watch(
	() => props.menu.position,
	(_new, _old) => {
		showSubMenu.value = { id: "", show: false };
		calcMenuPosition();
	}
);
onMounted(() => {
	calcMenuPosition();
});
function menuItemClick(item: contextMenuItem) {
	if (item.subMenu ) {
		if(item.id == showSubMenu.value.id)
			showSubMenu.value.show = !showSubMenu.value.show;
		else{
			showSubMenu.value.show = true;
		}
	} else {
		if (!item.subMenu) {
			showSubMenu.value.show = false;
		}
	}
	showSubMenu.value.id = item.id;

	calcSubMenuPosition();
}

function calcMenuPosition() {
	if (!container) return;
	let windowWidth: number = document.documentElement.clientWidth;
	let windowHeight: number = document.documentElement.clientHeight;
	let menuHeight: number = (container.value as HTMLElement).offsetHeight;
	let menuWidth: number = (container.value as HTMLElement).offsetWidth;
	let clientX = props.menu.position.clientX;
	let clientY = props.menu.position.clientY;

	let showX =
		menuWidth + clientX >= windowWidth - 10 ? clientX - menuWidth : clientX;
	let showY =
		menuHeight + clientY >= windowHeight - 10
			? clientY - menuHeight
			: clientY;

	menuStyleClass.value.top = `${showY}px`;
	menuStyleClass.value.left = `${showX}px`;
}
function calcSubMenuPosition(){
	//TODO 计算子菜单显示位置，不然会被窗口遮住
	console.dir(subMenu.value)
	if(showSubMenu.value.show && (!subMenu || !subMenu)) return;
	let windowWidth: number = document.documentElement.clientWidth;
	let windowHeight: number = document.documentElement.clientHeight;
	
	let subMenuDomRect = (subMenu.value as HTMLElement).getBoundingClientRect();
	let menuDomRect = (container.value as HTMLElement).getBoundingClientRect();

	let subWidth:number = subMenuDomRect.width;
	let subHeight:number =subMenuDomRect.height;
		//右上角坐标，有用
	let subMenuTopRightX:number = subMenuDomRect.left;
	let subMenuTopRightY:number = subMenuDomRect.top;
	let menuTopRightX: number = menuDomRect.left;
	let menuTopRightY: number = menuDomRect.top;

	let showX = (subMenuTopRightX+subWidth > windowWidth-10)?menuTopRightX-subWidth:(-subMenuWidth - 10);
	let showY = (subMenuTopRightY+subHeight > windowHeight-10)?menuTopRightY-subHeight:0;

	subMenuStyleClass.value.top = `${showY}px`;
	subMenuStyleClass.value.left = `${showX - 5}px`;
}
</script>

<style scoped lang="scss">
$itemBkgColor: rgb(252, 252, 252);
$hoverBkgColor: rgb(233, 233, 233);
.conetext-menu-containner {
	display: block;
	max-height: 360px;
	background-color: $itemBkgColor;
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
		padding: 0 4px;
		line-height: 36px;
		border-bottom: 1px solid var(--color-border-default);
		transition: 0.12s;
		display: flex;
		position: relative;
		justify-content: space-between;
		&:hover {
			background-color: $hoverBkgColor;
		}

		.submenu-container {
			position: absolute;
			padding: 10px 5px;
			right: -60px;
			background-color: $itemBkgColor;
			border: 1px solid var(--color-border-default);
			box-sizing: border-box;
			.submenu-item {
				border-bottom: 1px solid var(--color-border-default);
				padding: 0 4px;
				:hover{
					background-color: $hoverBkgColor;
				}
			}
		}
	}
}
</style>
