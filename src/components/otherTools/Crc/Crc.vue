<template>
	<div class="crc-container">
		<div v-for="(item, indx) in list" :key="indx" :class="item.classList">
			<div class="column1">
				<div class="title">
					<label>{{ item.title }}</label>
					<div class="selection-area" >
						选择Crc类型:
						<select name="CrcType" id="CrcType" v-model="item.curCrcClass.value">
							<option value="" disable selected class="selection" >
								-select crc-
							</option>
                            <option :value="cla.val" v-for="(cla,ind) in ListCrcClasses" :key="ind">{{cla.key}}</option>
						</select>
					</div>
				</div>
				<div class="input-area">
					<textarea
						autocomplete="false"
						spellcheck="false"
						class="input"
                        v-model="item.vModel.value"
					></textarea>
					<div class="result">
						<label>result: </label>
						<div>{{ item.result }}</div>
					</div>
				</div>
			</div>
			<div class="column2">
				<div
					class="icon"
					@click="
						() => {
							item.handleFunc.call(item,item.vModel.value);
						}
					"
				>
					<enterIcon :width="24" :height="24" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { arr, calcCrc, checkCrcCorrect, interfaceCrcClassKeyVal, interfaceListItem } from "./Crc";
import enterIcon from "../../selfUIs/icons/enterIcon.vue";
const list: Array<interfaceListItem> = [
	{
		title: "计算Crc:",
		classList: ["calc-crc", "crc-item", "area-grid"],
		curCrcClass: ref(""),
		vModel: ref(""),
		result: ref(""),
		handleFunc: calcCrc,
	},
	{
		title: "检验Crc:",
		classList: ["veri-crc", "crc-item", "area-grid"],
		curCrcClass: ref(""),
		vModel: ref(""),
		result: ref(""),
		handleFunc: checkCrcCorrect,
	},
];
const ListCrcClasses: Array<interfaceCrcClassKeyVal> = Array.from(
	arr,
	(a) => {
		return {
			key: a,
			val: a,
		};
	}
);
</script>

<style lang="scss" scoped>
.crc-container {
	width: 100%;
	box-sizing: border-box;
	height: 100%;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 5fr 5fr;
	.crc-item {
		width: 100%;
		border-bottom: 1px solid var(--color-border-default);
		.title {
			display: grid;
			grid-template-rows: 1fr;
			.selection {
				height: 23px;
				font-size: 16px;
			}
		}
		.column1 {
			max-width: 90%;
			.input-area {
				width: 100%;
				height: 70%;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.input {
					display: block;
					box-sizing: border-box;
					padding: 4px;
					font-size: 24px;
					line-height: 16px;
					height: 70%;
					width: 100%;
					min-width: 71px;
					resize: none;
				}
				.result {
					font-size: 22px;
					line-height: 22px;
					width: 100%;
					display: flex;
                    text-decoration: underline;
                    word-wrap: break-word;
				}
			}
		}
	}
	.column2 {
        display: flex;
        align-items: center;
        justify-content: flex-start;
		.icon {
			padding: 3px;
			box-sizing: border-box;
			border: 2px solid var(--color-border-default);
			width: fit-content;
			height: fit-content;
			border-radius: 2px;
            transition: .25s;
            &:hover{
                background-color:grey ;
            }
		}
	}
	.area-grid {
		display: grid;
		grid-template-columns: 3fr 1fr;
	}
    label,.selection-area{
        user-select: none;
    }
}
</style>
