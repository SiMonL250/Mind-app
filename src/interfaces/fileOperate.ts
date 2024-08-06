import {MindNode} from "./MindNodeProperty"

export enum EnumReconiteCode{
	MindJson="type-mind-json"
}
export enum EnumFileOperation {
	changeMindName="change-mindname",
	openFile="open-file",
	createNewFile="create-file",
	saveFile="save-file"
}
export interface mindFileContent{
	reconicode:EnumReconiteCode,
	mindName:string,
	fileName:string,
	mindNode:MindNode
}

interface filePickerOptions {
	types: {
		description: string;
		accept: { [key: string]: string[] };
	}[];

	multiple?: boolean;
}
//this function return Node property object, then topbar emit this object
export async function handleOpenFile(): Promise<mindFileContent|null> {
	try {
		// 定义文件选择器的选项
		const options: filePickerOptions = {
			types: [
				{
					description: "JSON/TXT files",
					accept: {
						"application/json": [".json"],
						"text/txt": [".txt"]
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
		const Mind:mindFileContent = JSON.parse(content);
		let reconicode:EnumReconiteCode = Mind.reconicode;
		return reconicode &&  Object.values(EnumReconiteCode).includes(reconicode)?Mind:null;
		
	} catch (error) {

		return null;
	}
}
