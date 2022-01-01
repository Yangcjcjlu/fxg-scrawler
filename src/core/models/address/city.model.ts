import {BaseModel,DistrictModel} from "../index";

export class CityModel extends BaseModel{
    
    name:string;//名称 
    
    districtList:Array<DistrictModel>;
}