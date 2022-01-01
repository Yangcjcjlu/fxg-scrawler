import { BaseModel, WoWorkOrderModel } from "../index";

export class WoWorkOrderThdModel extends BaseModel {

    source: number;//来源 1=格力
    sourceId: number;//来源订单唯一标示

    workOrder: WoWorkOrderModel;
}