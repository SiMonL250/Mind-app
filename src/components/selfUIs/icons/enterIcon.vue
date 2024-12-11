<template>
	<svg
		t="1733500430104"
		viewBox="0 0 1024 1024"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		p-id="5941"
		:width="props.width? props.width:36"
		:height="props.height? props.height:36"
	>
		<path
			d="M906.666667 170.666667a32 32 0 0 1 32 32v277.333333A160 160 0 0 1 778.666667 640H195.669333l158.72 158.72a32 32 0 0 1 3.072 41.642667l-3.114666 3.584a32 32 0 0 1-41.642667 3.114666l-3.584-3.114666-213.333333-213.333334a32 32 0 0 1-3.114667-41.642666l3.114667-3.584 213.333333-213.333334a32 32 0 0 1 48.341333 41.642667l-3.114666 3.584-158.72 158.72H778.666667a96 96 0 0 0 95.786666-89.429333l0.213334-6.570667v-277.333333a32 32 0 0 1 32-32z"
			fill="#2c2c2c"
			p-id="5942"
		></path>
	</svg>
</template>

<script setup lang="ts">
const props = defineProps<{
    width?:number,
    height?:number
}>();
</script>
