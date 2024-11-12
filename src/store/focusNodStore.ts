import { MindNode, NodeIdType, PriorytyLevel } from "./../interfaces/MindNodeProperty";
import { StoreDefinition, defineStore } from "pinia";
type stateType = {
	focusedNode: MindNode | null;
};

export const focusNodeStore: StoreDefinition<
	"focused-node",
	stateType,
	{
		getText: (state: stateType) => string;
		getId: (state: stateType) => NodeIdType;
        getPriority:(state:stateType)=>PriorytyLevel;
	},
	{
        setText:(newText:string)=>void;
    }
> = defineStore("focused-node", {
	state: () => {
		return {
			focusedNode: null,
		};
	},
	getters: {
		getId: (state: stateType) => {
			if (!state.focusedNode) {
				return null;
			}
			return state.focusedNode.data.id;
		},
        getText:(state:stateType)=>{
            if (!state.focusedNode) {
				return null;
			}
			return state.focusedNode.data.text;
        }
	},
    actions:{
        setText(newText:string) {
            if(this.focusNode){
                (this.focusNode as MindNode).data.text = newText; 
            }
        },
        
    }
});
