import {defineStore} from 'pinia';


export const leadLineStore = defineStore('node-action-store',{
    state:()=>({
        list:[]
    })
    
    //TODO session, use queue to store none action
})