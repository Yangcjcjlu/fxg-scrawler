import {BaseModel} from "../index";

export class WoGreeSettlementModel extends BaseModel{
    
    greeWoId:number;//wo_gree_id
    orderAmount:number;//订单原价
    payableAmount:number;//应付金额
    orderNo:string;
}