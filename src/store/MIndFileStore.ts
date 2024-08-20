import {defineStore} from 'pinia';
import { mindFileContent } from '../hooks/operate';

export const FileStore = defineStore('mind-file-store',{
    state:()=>{
        return {
            fileName:"" as string,
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
        setFileName(newFileName:string):void{
            this.fileName = newFileName;
        },
        setfileContent(newFileContent:mindFileContent):void{
            this.fileContent = {...newFileContent}
        }
    },
    persist:{
        enabled:true,
        strategies:[{
            storage:localStorage
        }]
    }

})

