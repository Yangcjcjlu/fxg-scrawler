import { BaseModel, WoWorkOrderItemModel } from "../index";

export class WoWorkOrderModel extends BaseModel {

    parentId: number;//父工单 用于拆单
    isParent: number;//1是父订单 0不是
    source: number;//工单来源 1:c端 2:网点 3:运维
    serviceName: string;//服务名字
    scId: number;//服务中心id
    engineerId: number;//工程师id
    orderNo: string;//工单号
    customerId: number;//客户id
    addressId: number;//地址id
    planVisitTime: Date;//计划上门时间
    nodeReceiveTime: Date;//网点接单时间
    engineerReceiveTime: Date;//工程师接单时间
    reservationVisitTime: Date;//预约上门时间
    reservationVisitRemark: string;//预约上门备注
    realityVisitTime: Date;//真实上门时间
    finishTime: Date;//完工时间
    payType: number;//支付方式 1微信支付 2支付宝 3余额 4体验卡
    payBaseId: number;//支付的依据
    payTime: Date;//支付时间
    evaluateTime: Date;//评价时间
    settleTime: Date;//结算时间
    isUrge: number;//是否催促 1催促 0无催促
    isComplaint: number;//是否投诉 1投诉 0无投诉
    complaintCause: string;//投诉原因
    userComment: string;//用户留言
    amount: number;//总金额
    status: number;//0已取消 1已结算 2待派单 3待预约 4待上门 5服务中 6待收款 7待结算 8待评价 100未下发

    items: Array<WoWorkOrderItemModel>;
}