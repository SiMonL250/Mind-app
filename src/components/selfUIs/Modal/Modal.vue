<template>
    <div class="modal-container">
        <div class="header">
            <slot name="title"></slot>
        </div>
        <div class="body">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.modal-container{
    width: 100vw;
    height: 100vh;
    background-color: rgba(83, 83, 83, 0.699);
}
</style>