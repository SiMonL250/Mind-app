<template>
	<div class="page-section">
		<section class="topbar-section">
			<TopbarView
				:name="MindFile.mindName"
				@change-mindname="(newName:string)=>changeMindNameHandle(newName)"
				@open-file="(file:mindFileContent)=>{openFileHandle(file);}"
			/>
		</section>
		<section class="main-section">
			<MainView :mindNode="MindFile.mindNode" />
		</section>
	</div>
</template>

<script setup lang="ts">
import TopbarView from "@/components/topbars/TopbarView.vue";
import MainView from "@/components/main/MainView.vue";
import { ref } from "vue";
import { EnumReconiteCode,mindFileContent } from "../src/interfaces/fileOperate";
import {
	insertSiblingNode,
	findMindNodebyId,
	MindNode,
} from "../src/interfaces/MindNodeProperty";

let MindFile = ref<mindFileContent>({
	reconicode: EnumReconiteCode.MindJson,
	mindName: "Mind",
	fileName: "File",
	mindNode: null,
});

function changeMindNameHandle(newName: string): void {
	MindFile.value.mindName = newName;
}
function openFileHandle(file: mindFileContent) {
	MindFile.value.fileName = file.fileName;
	MindFile.value.mindName = file.mindName;
	MindFile.value.reconicode = file.reconicode;
	MindFile.value.mindNode = file.mindNode;

	insertSiblingNode(MindFile.value.mindNode,{data:{id:"lsm",text:"lsm",createdTime:-1},children:Array<MindNode>(0)},"d33vvkxqne00")
	console.log('findMindNodebyId :>> ', findMindNodebyId(MindFile.value.mindNode,"lsm"));
}
</script>

<style lang="scss" scoped>
.page-section {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	.topbar-section {
		width: 100%;
		height: var(--height-topbar);
		background-color: var(--color-topBar);
		padding: 9px 15px;
		box-sizing: border-box;
		border-bottom: 1px solid var(--color-border-default);
	}
	.main-section {
		width: 100%;
		height: calc(100% - var(--height-topbar));
		padding: 5px 10px 5px 10px;
		box-sizing: border-box;
		overflow-y: scroll;
	}
}
</style>
