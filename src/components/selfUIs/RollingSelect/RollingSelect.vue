<template>
	<div
		class="rolling-container"
		@click.capture="ClickHadle"
		ref="RollingContainer"
	>
		<div class="icon-click">
			<component :is="Icons.get(curIcon)" />
		</div>
<!-- TODO position arrow -->
		<Popper
			class="my-poper"
			v-for="(item, indx) of itemsRoll"
			:key="indx"
			:content="item.text ?? 'what'"
			:hover="true"
			placement="left"
		>
			<div
				:style="{
					width: '16px',
					height: '16px',
					position: 'absolute',
					top: '31%',
					left: '25%',
					transform: `rotate(${
						isRotate ? 270 - item.index * 36 : 270
					}deg) translate(36px) rotate(${item.index * 36 + 90}deg)`,
					borderRadius: '50%',
					opacity: isRotate ? 1 : 0,
					transformOrigin: 'center',
					transition: `.89s`,
					backgroundColor: 'rgb(255, 255, 255',
				}"
				@click.stop="(_e:PointerEvent)=>{childClickHandle(_e,item.text)}"
				@mouseenter="
					() => {
						console.log('mouseOver :>> ');
					}
				"
			>
				<component :is="Icons.get(item.icon)" vue-tippy />
			</div>
		</Popper>
	</div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { Icons, itemsRoll, typeIconsName } from "./RollingSelect";
import Popper from "vue3-popper";
//TODO hover时按逆时针旋转出来 ，mouseout时按钮可以藏在12点种方向缩小透明，mousein再出来显现
const curIcon: Ref<typeIconsName> = ref("cry");
const RollingContainer = ref(null);
const isRotate = ref(false);

const ClickHadle = function (_e: PointerEvent) {
	// if (!RollingContainer.value) return;
	setTimeout(() => {
		isRotate.value = !isRotate.value;
		curIcon.value = isRotate.value ? "smile" : "cry";

		(RollingContainer.value as HTMLElement).style.right = isRotate.value
			? "30px"
			: "-23px";
	}, 50);
};
const childClickHandle = function (_e: PointerEvent, _param?: unknown) {
	console.log("_param :>> ", _param);
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
	transform-origin: center;
	z-index: 99;
	.my-poper{
		font-size: 14px;
	}
	.icon-click {
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: -1;
	}
}
</style>
