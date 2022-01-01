import {BaseModel} from "../index";

export class WcWorkOrderModel extends BaseModel{
    factoryCode:string;//厂商
    factoryId:number;//厂商
    sourceId:any;//来源订单唯一标示
    hasCrawler:number;//1已爬取 0未爬去
    settlementStatus:number;//结算状态 0 未结算 1结算未录入 2 已录入
    mobile:string;
    bizType:number;
    detailUrl:string;
}