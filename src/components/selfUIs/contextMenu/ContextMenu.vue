<template>
	<div
		class="conetext-menu-containner"
		:style="menuStyleClass"
		ref="container"
	>
		<div
			v-for="(item, ind) of props.menu.items"
			:key="ind"
			:class="['menu-items',item.event]"

			:data-has-sub="item.subMenu ? true : false"
			@click="(e:PointerEvent)=>{
				itemClickPos = {
					clientX : e.clientX,
					clientY : e.clientY,
				}
				decideShowSub(item);
				if(item.clickEvent){
					let _emitAction:typeItemClickAction = {
						action:item.event ?? 'none',
						val:{position:itemClickPos}
					}
					item.clickEvent(e ,()=>itemClickCallbackFunc(_emitAction)/*,　有callback可以在这里调用*/);
				}
			}"
		>
			{{ item.text + (item.subMenu ? ">" : "") }}
			<div v-if="item.subMenu"></div>
			<div
				v-if="
					item.subMenu &&
					showSubMenu.menuItemId == item.id &&
					showSubMenu.show
				"
				class="submenu-container"
				:style="subMenuStyleClass"
				ref="subMenu"
			>
				<div
					class="submenu-item"
					v-for="(subOfItem, ind) of item.subMenu"
					:key="ind"
					@click="(e:PointerEvent)=>{
						let _emitAction:typeItemClickAction = {
							action:item.event
						}
						subOfItem.clickEvent(e,()=>itemClickCallbackFunc(_emitAction))
					}"
				>
					{{ subOfItem.text }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CSSProperties, onMounted, ref, Ref, watch } from "vue";
import {
	menuProps,
	interfaceContextMenuItem,
	typeItemClickCallback,
	typeItemClickAction,
} from "./contextMenu";
import { nextTick } from "vue";
import { interfacePosition } from "../../../interfaces/ComponentProperty";

const itemClickActionStr: string = "context-menu-item-click";
const props = defineProps<{
	menu: menuProps;
	position: interfacePosition;
	treeNodeId: string;
}>();

const contextMenuEmits = defineEmits([itemClickActionStr]);

const showSubMenu = ref({ menuItemId: "", show: false });
const container = ref(null);
const subMenu = ref(null);
const itemClickPos = ref({ clientX: 0, clientY: 0 });
const menuStyleClass: Ref<CSSProperties> = ref({
	position: "absolute",
});

const subMenuStyleClass: Ref<CSSProperties> = ref({});
watch(
	() => props.position,
	(_new, _old) => {
		calcMenuPosition();
	}
);
watch(
	() => props.treeNodeId,
	(n, o) => {
		if (n != o) {
			showSubMenu.value.show = false;
		}
	}
);
onMounted(() => {
	calcMenuPosition();
});

const itemClickCallbackFunc: typeItemClickCallback = (
	_emitAction: typeItemClickAction
) => {
	//callback 要把操作emit到App.vue
	//  console.log("param :>> ", _emitAction);
	contextMenuEmits(itemClickActionStr, _emitAction);
};

function decideShowSub(item: interfaceContextMenuItem) {
	if (item.subMenu) {
		if (item.id == showSubMenu.value.menuItemId)
			showSubMenu.value.show = !showSubMenu.value.show;
		else {
			showSubMenu.value.show = true;
		}
	} else {
		showSubMenu.value.show = false;
	}
	showSubMenu.value.menuItemId = item.id;
	nextTick(() => {
		calcSubMenuPosition(itemClickPos);
	});
}

function calcMenuPosition() {
	if (!container.value) return;
	let windowWidth: number = document.documentElement.clientWidth;
	let windowHeight: number = document.documentElement.clientHeight;
	let menuHeight: number = (container.value as HTMLElement).offsetHeight;
	let menuWidth: number = (container.value as HTMLElement).offsetWidth;
	let clientX = props.position.clientX;
	let clientY = props.position.clientY;

	let showX =
		menuWidth + clientX >= windowWidth - 10 ? clientX - menuWidth : clientX;
	let showY =
		menuHeight + clientY >= windowHeight - 10
			? clientY - menuHeight
			: clientY;

	menuStyleClass.value.top = `${showY}px`;
	menuStyleClass.value.left = `${showX}px`;
}
function calcSubMenuPosition(
	itemClick: Ref<{ clientX: number; clientY: number }>
) {
	// 计算子菜单显示位置，不然会被窗口遮住
	if (!showSubMenu.value.show) return;
	if (!subMenu.value) {
		showSubMenu.value.show = false;

		return;
	}
	let windowWidth: number = document.documentElement.clientWidth;
	let windowHeight: number = document.documentElement.clientHeight;

	let sub = subMenu.value[0] as HTMLElement;
	if (!sub) return;

	let menuDomRect = (container.value as HTMLElement)?.getBoundingClientRect();

	let menuRight = menuDomRect.right;
	//左上角坐标，有用

	let subMenuWidth: number = sub.offsetWidth;
	let subMenuHeight: number = sub.offsetHeight;
	let menuWidth: number = menuDomRect.width;
	let showX =
		menuRight + subMenuWidth > windowWidth - 5 /* 如果右边超出屏幕*/
			? menuWidth - 7
			: -subMenuWidth - 5;

	if (itemClick.value.clientY + subMenuHeight > windowHeight - 5) {
		//注意第一个非sattic父元素
		subMenuStyleClass.value.top = `${-subMenuHeight}px`;
	} else {
		subMenuStyleClass.value.top = `${0}px`;
	}
	subMenuStyleClass.value.right = `${showX}px`;
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
		justify-content: space-between;
		box-sizing: border-box;
		position: relative;
		&:hover {
			background-color: $hoverBkgColor;
		}

		.submenu-container {
			width: 76px;
			position: absolute;
			padding: 4px 1px;
			background-color: $itemBkgColor;
			border: 1px solid var(--color-border-default);
			box-sizing: border-box;
			.submenu-item {
				border-bottom: 1px solid var(--color-border-default);
				padding: 0 4px;
				&:hover {
					background-color: $hoverBkgColor;
				}
			}
		}
	}
}
</style>
