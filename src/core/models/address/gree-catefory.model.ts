import {BaseModel} from "./../index";
import { GreeSmallClassModel } from "./gree-small-class.model";

export class GreeCateforyModel extends BaseModel{
    
    name:string;//品类名称
    value:string;//品类值
    type:number;//0安装 1维修

    smallClassList:Array<GreeSmallClassModel>//小类
}