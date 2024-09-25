<template>
    <div class="conetext-menu-containner">
        <div class="menu-item" ></div>
    </div>
</template>

<script setup lang="ts">
import { menuProps } from './contextMenu';
const props = defineProps<
    {
        menu?:menuProps
    }
>();
console.log('props.menu :>> ', props.menu);
</script>

<style scoped lang="scss">
.conetext-menu-containner{
    position: absolute;
    
}
</style>