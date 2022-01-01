import {BaseModel} from "../index";
import { Dictionary } from "async";

export class FittingModel extends BaseModel{
    
    code:string;//物料代码
    name:string;//物料名称
    factoryPrice:string;//厂家价格

    greeCode:Array<string>/***五位编码 */
}