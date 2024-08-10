export enum PriorytyLevel{
    highest=0,
    higher,
    medium,
    lower,
    lowest
}
export type NodeIdType = string

export interface MindNodeData {
    id:NodeIdType,
    createdTime:number,//timeStamp
    text:string,
    priority?:PriorytyLevel,//value smaller, priority higher
};

export type MindNode = { // tree
    data:MindNodeData,
    children:Array<MindNode>,
}|null;

//tree struct funcyion
export function traverseMindNode(node:MindNode):void{
    if(!node) return;
    if(node && node.data){
        console.log('node :>> ', node.data.id);//operate here 
    }
    for(let child of node.children){
        traverseMindNode(child);
    }
}

export function findMindNodebyId(node:MindNode,id:NodeIdType):MindNode|null{
    if(!node) return null; 
    if(node.data &&  node.data.id === id){
        return node;
    }
    for(let child of node.children){
        let found = findMindNodebyId(child,id);
        if(found) return found;
    }
    return null;
}

//插入子节点
export function insertChildNode(tree:MindNode,child:MindNode,fatherId:NodeIdType){
    if(!tree || !tree.children) return;

    for(let node of tree.children){
        if(node?.data?.id===fatherId){
            node.children.push(child);
            return;
        }
        insertChildNode(node,child,fatherId);
    }
}

//插入父节点
export function insertFatherNode(tree:MindNode,fatherNode:MindNode,childId:NodeIdType){
    if(!tree || !tree.children){
        return;
    }
    for(let i = 0; i < tree.children.length; i++){
        if(tree.children[i]?.data?.id === childId){
            fatherNode?.children.push(tree.children[i]);
            tree.children[i] = fatherNode;
            return;
        }
        insertFatherNode(tree.children[i],fatherNode,childId);
    }
}

//插入同级
export function insertSiblingNode(tree:MindNode,siblingNode:MindNode,targetId:NodeIdType){
    if(!tree || !tree.children) return;
    for(let node of tree.children){
        if(node?.data.id === targetId){
            node.children.push(siblingNode);
            return;
        }
        insertSiblingNode(node,siblingNode,targetId);
    }
}