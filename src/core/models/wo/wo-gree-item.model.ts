import {BaseModel} from "../index";

export class WoGreeItemModel extends BaseModel{
    
    woId:number;//
    itemId:number;//
    demand:string;//需求类别
    channel:string;//渠道
    source:string;//来源
    visitDate:string;//期望上门时间
    infoRemark:string;//基本内容备足
    category:string;//品类
    subclass:string;//小类
    series:string;//系列
    model:string;//产品型号
    symptom:string;//故障现象
    barcode:string;//条形码
    buyDate:string;//购买日期
    sellUnit:string;//销售单位
    sellPhone:string;//销售电话
    serviceUnit:string;//服务单位
    servicePhone:string;//服务单位电话
    detail:string;
    danwei:string;
    wjsl:string;
    jxid:string;
    wldm:string;
    jiege:string;
    shul:string;
    njsl:string;
    zjia:string;
    jcguan:string;
    kqkg:string;
    gkzy:string;
    yccxqk:string;
    beiz:string;
    items:Array<any>;
}