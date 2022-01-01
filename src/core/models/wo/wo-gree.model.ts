import {BaseModel} from "../index";

export class WoGreeModel extends BaseModel{
    
    orderId:number;//订单id
    orderNo:any;//格力信息编号
    requireRead:string;//新增要求阅读情况
    opDetails:string;//操作明细情况
    completionDetails:string;//完工明细情况
    historyRepair:string;//历史维修记录
    feedbackStatus:number;
    sendStatus:number;
}