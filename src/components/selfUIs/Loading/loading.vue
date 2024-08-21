<template>
	<div class="my-loading">
        <loadingIcon class="loding-rotate"/>
    </div>
</template>

<script setup lang="ts">
import loadingIcon from '../icons/loadingIcon.vue'
</script>

<style scoped>
.my-loading{
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: rgba(158, 158, 158, 0.705);
    display: flex;
    align-items: center;
    justify-content: center;
}
.loding-rotate{
    height: 10%;
    width: 10%;
    animation-name: rotate;
    animation-duration:1.89s;
    animation-iteration-count: infinite;
    transition: ease-in;
    transform-origin: center center ;
}
@keyframes rotate {
    from{
        transform: rotate(0);
    }to{
        transform: rotate(360deg);
    }

}
</style>
