export const msgTypes:string[]  = ["success", "error", "normal", "warning"];
export interface msgProperty{
    show?:boolean,
    text:string,
    positionX:number,
    positionY:number,
    remainTime:number,
    classList:string[],
}
