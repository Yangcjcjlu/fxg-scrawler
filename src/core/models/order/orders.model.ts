import {BaseModel} from '../base.model'

export class OrdersModel extends BaseModel{

    ordersNo:string;
    createdTime:string;
    customerName:string;
    mobile:string;
    address:string;
    orderStatus:string;
    
}