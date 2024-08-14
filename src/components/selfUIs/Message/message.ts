import { createVNode, render, } from "vue";
import MessagePopup from "./MessagePopup.vue";
import { StyleValue } from "vue";


const className = "my-message";
let count = 0;
const height: number = 32;

function calcOffect(index:number):number{ //TODO find some way to get index and offset to calc top position 
    return 0;
}
export default ({ text, type }, remainMs: number) => {
    console.log('text :>> ', typeof text);
	const div = document.createElement("div");
	div.setAttribute("class", className);
	document.body.appendChild(div);


    let str = text+count
	const style: StyleValue = { height: `${height}px`, top: `0px` };
	const vNode = createVNode(MessagePopup, { text:str, type:type, style:style });


	render(vNode, div);
    count ++;
	setTimeout(() => {
		const toMove:any = document.body.getElementsByClassName(className)[0];
        document.body.removeChild(toMove);//直接进行一个DOM的操
	}, remainMs);
};
