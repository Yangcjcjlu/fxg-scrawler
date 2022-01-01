import {BaseModel,WoGreeModel,WoGreeItemModel,WoGreeUserModel} from "..";

export class MideaInstallOrderModel extends BaseModel{
    productname:string;//产品名称
    clientname:string;//客户名称
    phone:string;//客户电话
    address:string;//地址
    installtime:string//安装时间
    createtime:string//订单生成时间
}