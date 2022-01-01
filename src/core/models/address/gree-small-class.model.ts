import {BaseModel} from "./../index";
import { GreeSeriesModel } from "./gree-series.model";

export class GreeSmallClassModel extends BaseModel{
    
    name:string;//品类名称
    value:string;//小类值
    cateforyId:number;//品类id

    seriesList:Array<GreeSeriesModel>//系列
}