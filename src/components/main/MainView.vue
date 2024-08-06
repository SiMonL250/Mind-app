<template>
    <div class="main">
        <div class="mind-render-section">
            {{ prop }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {MindNode} from "../../interfaces/MindNodeProperty"
const prop = defineProps<{
    mindNode:MindNode
}>();
</script>

<style scoped lang="scss">
.main{
    height: 100%;
    width: 100%;
}
</style>