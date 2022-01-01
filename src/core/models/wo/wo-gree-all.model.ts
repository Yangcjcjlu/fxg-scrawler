import {BaseModel,WoGreeModel,WoGreeItemModel,WoGreeUserModel} from "..";

export class WoGreeAllModel extends BaseModel{
    orderNo:number;//格力信息编号
    gree:WoGreeModel;
    greeItem:WoGreeItemModel;
    greeUser:WoGreeUserModel;
}