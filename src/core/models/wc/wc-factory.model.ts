import {BaseModel} from "../index";

export class WcFactoryModel extends BaseModel{
    code:string;
    name:string;//厂家名称
    icon:string;//厂家icon
    woUrl:string;//工单地址
    bizType:number;
}