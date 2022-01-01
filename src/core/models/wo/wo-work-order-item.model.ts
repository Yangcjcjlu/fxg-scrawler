import { BaseModel } from "../index";

export class WoWorkOrderItemModel extends BaseModel {

    orderId: number;//工单id
    serviceId: number;//服务id
    snapServiceId: number;//快照服务id
    skuId: number;//sku id
    itemCount: number;//数量
    reason: string;//故障描述
    amount: number;//总金额
}