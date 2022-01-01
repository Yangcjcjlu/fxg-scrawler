import {BaseModel,WcFactoryModel} from "../index";

export class ScFactoryModel extends BaseModel{
    
    scId:number;//
    factoryId:number;//
    lastCrawlerTime:string;//最后一次爬取时间
    maxWoId:number;//最大工单号
    status:number;//1开启 0未开启

    running:boolean;
    wcFactoryVO:WcFactoryModel;
}