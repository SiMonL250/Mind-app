import {defineStore} from 'pinia';
import { mindFileContent } from '../interfaces/fileOperate';

export const FileStore = defineStore('mind-file-store',{
    state:()=>{
        return {
            fileName:"111" as string,
            fileContent: null as mindFileContent | null,
        }
    },
    getters:{
        getFileName(state):string{
            return state.fileName;
        },
        getFileContent(state):mindFileContent{
            return state.fileContent;
        }
    },
    actions:{
        setFileName(newFileName:string){
            this.fileName = newFileName;
        },
        setfileContent(newFileContent:mindFileContent){
            
            this.fileContent = {...newFileContent}
        }
    }
})

