/* 
    mind node tree struct and tree functions
*/

export enum PriorytyLevel {
	highest = "0",
	higher = "1",
	medium = "2",
	lower = "3",
	lowest = "4",
	none = "-1",
}
export type typeNodeId = string;

export interface MindNodeData {
	id: typeNodeId;
	createdTime: number; //timeStamp
	text: string;
	priority?: PriorytyLevel; //value smaller, priority higher
}

export type MindNode = {
	// tree
	data: MindNodeData;
	children: Array<MindNode>;
} | null;

export const KeyPropertyText = "text";
export const KeyPropertyPriority = "priority";
//tree struct function
// generate tree node id function
export function generateNodeId(): typeNodeId {
	const timeStampStr: string = new Date().getTime().toString();
	return `Tree-Node${timeStampStr}`;
}
export function traverseMindNode(node: MindNode): void {
	if (!node) return;
	if (node && node.data) {
		console.log("node :>> ", node.data.id); //operate here
	}
	for (let child of node.children) {
		traverseMindNode(child);
	}
}

export function findMindNodebyId(
	node: MindNode,
	id: typeNodeId
): MindNode | null {
	if (!node) return null;
	if (node.data && node.data.id === id) {
		return node;
	}
	for (let child of node.children) {
		let found = findMindNodebyId(child, id);
		if (found) return found;
	}
	return null;
}

export function getFatherNodeByChildId(
	tree: MindNode,
	childId: typeNodeId
): MindNode | null {
	if (!tree) return null;
	if (tree.data.id === childId) return null;
	const stack = [tree];

	while (stack.length) {
		const node = stack.pop();
		if (node.children.some((child) => child.data.id === childId)) {
			return node;
		}
		stack.push(...node.children);
	}
	return null;
}
export function getFatherNode(
	tree: MindNode,
	child: MindNode
): MindNode | null {
	if (!tree) return null;
	if (tree === child) return null;

	let childId: typeNodeId = child.data.id;
	const stack = [tree];

	while (stack.length) {
		const node = stack.pop();
		if (node.children.some((child) => child.data.id === childId)) {
			return node;
		}
		stack.push(...node.children);
	}
	return null;
}
//插入子节点
export function insertChildNode(
	tree: MindNode,
	child: MindNode,
	fatherId: typeNodeId
) {
	if (!tree || !tree.children) return;

	for (let node of tree.children) {
		if (node?.data?.id === fatherId) {
			node.children.push(child);
			return;
		}
		insertChildNode(node, child, fatherId);
	}
}

//插入父节点
export function insertFatherNode(
	tree: MindNode,
	fatherNode: MindNode,
	childId: typeNodeId
) {
	if (!tree || !tree.children) {
		return;
	}
	for (let i = 0; i < tree.children.length; i++) {
		if (tree.children[i]?.data?.id === childId) {
			fatherNode?.children.push(tree.children[i]);
			tree.children[i] = fatherNode;
			return;
		}
		insertFatherNode(tree.children[i], fatherNode, childId);
	}
}

//插入同级
export function insertSiblingNode(
	tree: MindNode,
	siblingNode: MindNode,
	targetId: typeNodeId
) {
	if (!tree || !tree.children) return;
	for (let node of tree.children) {
		if (node?.data.id === targetId) {
			node.children.push(siblingNode);
			return;
		}
		insertSiblingNode(node, siblingNode, targetId);
	}
}

export function deleteNode(tree: MindNode, nodeId: typeNodeId) {
	//返回操作后的树
	if (!tree) return null;
	if (!nodeId) throw new Error("null param while delete tree node");

	tree.children = tree.children
		.map((child) => {
			const result = deleteNode(child, nodeId);
			// 如果子节点被删除（返回null），则不包含在新的children数组中
			return result === null ? null : result;
		})
		.filter((child) => (child !== null && child.data.id!==nodeId));
		
	// 返回更新后的节点
	return tree;

	// return tree;
}

export function updateNodeProperty(
	_tree: MindNode,
	_id: typeNodeId,
	_propertyKey: string,
	_newVal: any
) {
	//obj={a:1,b:'sdsdsd'}
	//obj['a'] = 23 ==>{a: 23, b: 'sdsdsd'}
	//obj['c'] == undefined

	if (!_tree || !_id || !_propertyKey) {
		throw new Error("null params when update NodeProperty");
	}
	if (_tree && _tree.data.id === _id) {
		if (_tree.data[_propertyKey]) {
			_tree.data[_propertyKey] = _newVal;
		} else {
			throw new Error("doesnt has this property!");
		}
	}
	for (let child of _tree.children) {
		updateNodeProperty(child, _id, _propertyKey, _newVal);
	}
}
