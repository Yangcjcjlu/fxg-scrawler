import {BaseModel,WoGreeModel,WoGreeItemModel,WoGreeUserModel} from "..";

export class MideaMaintainOrderModel extends BaseModel{
    productname:string;//产品名称
    clientname:string;//客户名称
    phone:string;//客户电话
    address:string;//地址
    servicetime:string;//维修时间
    createtime:string//订单生成时间
    underwarranty:number//是否在保：1是0否 	
}