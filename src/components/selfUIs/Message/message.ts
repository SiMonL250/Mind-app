import {createVNode,render} from 'vue'
import MessagePopup from './MessagePopup.vue';

const div = document.createElement('div')
div.setAttribute('class', 'my-message')
document.body.appendChild(div)



export default ({text,type},remainMs:number)=>{
    const vNode = createVNode(MessagePopup,{text,type});

    render(vNode,div);
    setTimeout(()=>{
        render(null,div);
    },remainMs); //TODO message queue, calculate position
}