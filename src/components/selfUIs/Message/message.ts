import { createVNode, render } from "vue";
import MessagePopup from "./MessagePopup.vue";
import { StyleValue } from "vue";

export const msgTypes: string[] = ["success", "error", "normal", "warning"];

const className = "my-message";
const div = document.createElement("div");
div.setAttribute("class", className);
document.body.appendChild(div);
let timer: number;

export default (text: string, type?: string, remainMs?: number) => {
	if (type && !msgTypes.includes(type)) {
		console.warn("Message Type Error~");
		type = "normal";
	}
	if (timer) clearTimeout(timer);
	render(null, div);

	const style: StyleValue = { top: `0px` };
	const vNode = createVNode(MessagePopup, {
		text: text,
		type: type ? type : "normal",
		style: style,
	});

	render(vNode, div);

	timer = setTimeout(
		() => {
			// let collection:HTMLCollection = document.body.getElementsByClassName(className);
			// const toMove:any = collection[0];
			// document.body.removeChild(toMove);//直接进行一个DOM的操
			render(null, div);
		},
		remainMs ? remainMs : 2000
	);
};
