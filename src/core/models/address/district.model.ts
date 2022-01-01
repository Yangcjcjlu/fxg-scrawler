import {BaseModel,StreetModel} from "../index";

export class DistrictModel extends BaseModel{
    
    name:string;//名称  
    
    streetList:Array<StreetModel>;//街道集合
}