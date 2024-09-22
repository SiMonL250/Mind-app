import { MindNode } from "../interfaces/MindNodeProperty";
import { showLoading,hideLoading } from "../components/selfUIs/Loading/loading";

/*
	file operate and node operates 

*/

/*NAMESPACE START  */ 
export namespace NameSpaceFileOperation {
	export const changeMindName = "change-mindname";
	export const openFile = "open-file";
	export const createNewFile = "create-file";
	export const saveFile = "save-file";

	
}

export namespace NameSpaceNodeOperate{
	export const NodeAction= "node-action";

	export const NodeRightClick = "node-right-click"

	export const redo = "redo";
    export const undo = "undo";
    export const insertNodeChild = "insert-child";
	export const insertNodeParent = "insert-parent";
	export const insertNodeSibling = "insert-sibling";
    export const moveUp = "move-up";
	export const moveDown = "move-down";
    export const editText = "edit-text";
    export const deleteNode = "delete-node";
    export const setPriority = "set-priority";
}

export namespace NameSpaceOtherOperation{
	export const switchTool = 'switch-tool';
	export const showModal = "show-modal";
	export const closeModal = "close-modal";
}
/*NAMESPACE END  */ 
/*ENUMS START  */ 
export enum EnumReconiteCode {
	MindJson = "type-mind-json",
}
export enum EnumOpenDirectoryMode {
	read = "read",
	readWrite = "readwrite",
}
export enum EnumDirectoryWellknow {
	desktop = "desktop",
	documents = "documents",
	downloads = "downloads",
	music = "music",
	pictures = "pictures",
	videos = "videos",
}
/*ENUMS  END  */
/*INTERFACE START  */ 
export interface interfaceEmitsAction {
	action:string,
	val?:any
}
export interface mindFileContent {
	reconicode: EnumReconiteCode;
	mindName: string;
	mindNode: MindNode;
}
interface filePickerOptions {
	startIn?: FileSystemHandle | EnumDirectoryWellknow;
	types: {
		description: string;
		accept: { [key: string]: string[] };
	}[];

	multiple?: boolean;
}
interface directoryPickerOptions {
	id?: any;
	startIn?: FileSystemHandle | EnumDirectoryWellknow;
	mode: EnumOpenDirectoryMode;
}
interface fileSaveOptions {
	startIn?: FileSystemHandle | EnumDirectoryWellknow;
	suggestedName: string;
	types: {
		description: string;
		accept: { [key: string]: string[] };
	}[];
}
/*INTERFACE  END  */


//this function return Node property object, then topbar emit this object
export async function handleOpenFile(): Promise<{mind:mindFileContent ,fileName:string}| null> {
	try {
		// 定义文件选择器的选项
		const options: filePickerOptions = {
			types: [
				{
					description: "mindfiletype",
					accept: {
						"application/lsm": [".lsm"],
					},
				},
			],
			multiple: false, // 允许选择多个文件
		};

		// 调用showOpenFilePicker
		const handle = await window.showOpenFilePicker(options);
		// 获取文件句柄数组
		const file = await handle[0].getFile();
		//console.log('file :>> ', file);
		const content = await file.text();
		//console.log('content :>> ', content);

		if (content.length === 0) return null;

		const Mind: mindFileContent = JSON.parse(content);
		let reconicode: EnumReconiteCode = Mind.reconicode;

		return reconicode &&
			Object.values(EnumReconiteCode).includes(reconicode)
			? {mind:Mind,fileName:file.name}
			: null;
	} catch (error) {
		//console.error(error);
		throw error;
		
	}
}

//select folder and return files&directory in this directory
export async function handleSelectDirectory(): Promise<
	[string, FileSystemFileHandle][] | null
> {
	//new

	try {
		const options: directoryPickerOptions = {
			mode: EnumOpenDirectoryMode.read,
		};

		const directoryHandle = await window.showDirectoryPicker(options);

		const list: [string, FileSystemFileHandle][] = [];
		for await (const entries of directoryHandle.entries())
			list.push(entries);

		return list;
	} catch (error) {
		throw error;
	}
}

function createEmptyMindFileContent(
	mindName: string,
	reconite: EnumReconiteCode
): mindFileContent {
	const createdTime = new Date().getTime();
	return {
		reconicode: reconite,
		mindName: mindName,
		mindNode: {
			data: {
				id: "mindroot" + createdTime,
				createdTime: createdTime,
				text: "思维导图",
			},
			children: [],
		},
	};
}
//save file  and create file , 
//save操作fileObject和fileName不能为空
export async function handleNewAndSaveFile(
	fileName?:string,
	fileObject?: mindFileContent
): Promise<mindFileContent | null> {
	let date = new Date();
	let MindName = 'Mind'+date.getTime();
	try {
		const option: fileSaveOptions = {
			suggestedName: fileName?fileName:MindName,
			types: [
				{
					description: "",
					accept: {
						"application/lsm": [".lsm"],
					},
				},
			],
		};
		let fileContent: mindFileContent;
		if (!fileObject) {
			fileContent = createEmptyMindFileContent(
				MindName,
				EnumReconiteCode.MindJson
			);
		} else {
			fileContent = fileObject;
		}
		const fileHandle = await window.showSaveFilePicker(option);

		const Writable = await fileHandle.createWritable();

		/*
			FileSystemFileHandle -> FileSystemWritableStream -> write() ->close stream
		*/

		Writable.write(JSON.stringify(fileContent)).then(()=>{
			showLoading();
		});
		await Writable.close().finally(()=>{
			hideLoading();
		});
		return fileContent;
	} catch (error) {
		//console.error(e);
		throw error;
	}
}
