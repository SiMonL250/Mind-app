import { createVNode, render, VNode} from "vue";
import loading from "./loading.vue";

let vNodeLoading:VNode=createVNode(loading);
const id = 'loading-div'
export  const showLoading = ()=>{
    const loadingDiv = document.createElement('div');
    loadingDiv.setAttribute('id',id);

    document.body.appendChild(loadingDiv);


    render(vNodeLoading,loadingDiv);
}

export const hideLoading = ()=>{
    document.body.removeChild(document.querySelector(`#${id}`))
}