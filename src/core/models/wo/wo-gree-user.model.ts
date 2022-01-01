import {BaseModel} from "../index";

export class WoGreeUserModel extends BaseModel{
    
    woId:number;//
    name:string;//姓名
    areaCode:string;//区号
    mobile:string;//手机号码
    mobile2:string;//手机号码2
    telephone:string;//固定电话
    userType:string;//用户属性
    callerMobile:string;//来电号码
    priority:string;//优先级
    province:string;//省
    city:string;//市
    district:string;//区
    street:string;//街道
    address:string;//详细地址
    xsdwno:string;//
    xswdmc:string;//销售单位名称
    lxr:string;
    dzyx:string;//电子邮箱
    xsdh:string;//销售单号
    yyazsj:string;
    gmrq:string;
    xslx:string;
    fphm:string;
}