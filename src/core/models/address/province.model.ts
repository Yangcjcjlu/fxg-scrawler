import {BaseModel, CityModel} from "../index";

export class ProvinceModel extends BaseModel{
    
    name:string;//名称

    cityList:Array<CityModel>;//区
    
}