<template>
    <div class="modal-container" v-if="showModal">
        <div class="modal-box">
            <div class="box-header">
                <div>
                    <slot name="title"></slot>
                </div>
                <div class="close-modal" @click="closeModalEmits">×</div>
            </div>
            <div class="box-body">
                <slot name="body"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, watch } from 'vue';
import { ref } from 'vue';
import { NameSpaceOtherOperation,interfaceEmitsAction } from '../../../hooks/operate';


//prop emit and variables
const props = defineProps<{
    show:boolean,
    title?:string
}>();

const showModal:Ref<boolean> = ref(props.show);  
const Emits = defineEmits([NameSpaceOtherOperation.closeModal])
//event
function closeModalEmits(){
    const action:interfaceEmitsAction<boolean> = {
        action:NameSpaceOtherOperation.closeModal,
        val:false
    }
    Emits(NameSpaceOtherOperation.closeModal,action);
}
//hooks
watch(props,(newVal)=>{
    showModal.value = newVal.show;
})
</script>

<style scoped lang="scss">
.modal-container{
    width: 100vw;
    height: 100vh;
    background-color: rgba(83, 83, 83, 0.699);
    position: absolute;
    left: 0%;
    top: 0%;
    
    .modal-box{
        width: 75vw;
        height: 78vh;
        background-color: rgb(243, 243, 243);
        border-radius: 8px;
        margin: 11vh auto;
        padding: 5px;
        box-sizing: border-box;
        min-width: 480px;
        .box-header{
            display: flex;
            height: 45px;
            justify-content: space-between;
            align-items: center;
            font-size: 19px;
            border-bottom: 1px solid var(--color-border-default);
            div{
                padding:0 12px;
            }
            .close-modal{
                border: 0.5px solid rgb(202, 202, 202);
                height: fit-content;
                padding: 0;
                border-radius: 4px;
                font-size: 24px;
                width: 24px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                margin-right: 8px;
                cursor: pointer;
                &:hover{
                    background-color: var(--color-font-focus);
                    transition: .2s;
                }
            }
        }
        .box-body{
           padding: 4px; 
           display: flex;
           height: calc(100% - 45px);
        }
    }
}

</style>