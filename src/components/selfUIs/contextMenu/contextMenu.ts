import { MindNode } from "../../../interfaces/MindNodeProperty";

export type itemIdType= string
export interface contextMenuItem{
    id:itemIdType;
    text:string;
    subMenu?:Array<subMenu>
    clickEvent?:(e?:PointerEvent)=>void;
}
interface subMenu{
    id:itemIdType;
    text:string; 
    clickEvent?:(e:Event)=>void;
}
export interface menuProps {
    position:{
        clientX:number,
        clientY:number
    }
   items:Array<contextMenuItem>; 
} 
//TODO clientX clientY to decide position get from contextMenu Event

export type rightClickValType = { menu: menuProps; treeNode: MindNode }