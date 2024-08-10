import { MindNode } from "./MindNodeProperty";

export enum EnumReconiteCode {
	MindJson = "type-mind-json",
}
/* TODO TopbarView.vue:64 [Vue warn]: 
Component emitted event "create-file" but it is neither 
declared in the emits option nor as an "onCreate-file" prop.
修改这个，使其更加合理
*/
export enum EnumFileOperation {
	changeMindName = "change-mindname",
	openFile = "open-file",
	createNewFile = "create-file",
	saveFile = "save-file",
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
//this function return Node property object, then topbar emit this object
export async function handleOpenFile(): Promise<mindFileContent | null> {
	try {
		// 定义文件选择器的选项
		const options: filePickerOptions = {
			types: [
				{
					description: "JSON/TXT files",
					accept: {
						"application/json": [".json"],
						"text/txt": [".txt"],
					},
				},
			],
			multiple: false, // 允许选择多个文件
		};

		// 调用showOpenFilePicker
		const handle = await window.showOpenFilePicker(options);
		// 获取文件句柄数组
		const file = await handle[0].getFile();
		const content = await file.text();

		if(content.length===0) return null;

		const Mind: mindFileContent = JSON.parse(content);
		let reconicode: EnumReconiteCode = Mind.reconicode;
		return reconicode &&
			Object.values(EnumReconiteCode).includes(reconicode)
			? Mind
			: null;
	} catch (error) {
		console.error(error);

		return null;
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
		return null;
	}
}

function createEmptyMindFileContent(mindName:string,reconite:EnumReconiteCode):mindFileContent{
	const createdTime = new Date().getTime();
	return {
		reconicode:reconite,
		mindName:mindName,
		mindNode:{
			data:{
				id:'mindroot'+createdTime,
				createdTime: createdTime,
				text:'思维导图'
			},
			children:[]
		}
	}
}
//save file  and create file
export async function handleNewAndSaveFile(
	fileName: string,
	fileObject?: mindFileContent
): Promise<mindFileContent | null> {
	try {
		const option: fileSaveOptions = {
			suggestedName: fileName,
			types: [
				{
					description: "",
					accept: {
						"application/json": [".json"],
						"text/txt": [".txt"],
					},
				},
			],
		};
		let fileContent:mindFileContent;
		if(!fileObject){
			fileContent = createEmptyMindFileContent(fileName,EnumReconiteCode.MindJson);
		}else{
			fileContent = fileObject;
		}
		const fileHandle = await window.showSaveFilePicker(option);
		
		const Writable = await fileHandle.createWritable();


		/*
			FileSystemFileHandle -> FileSystemWritableStream -> write() ->close stream
		*/
		
		Writable.write(JSON.stringify(fileContent));

		Writable.close();
	} catch (e) {
		console.error(e);
		return null;
	}
}
