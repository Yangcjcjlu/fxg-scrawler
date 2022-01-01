import { AHttpCmd } from "..";
import { CmdSignModel } from '../../../core/models'
import { CmdCode } from '../../../core/code'

export class OrdersListCmd extends AHttpCmd{

    constructor(private orderList:any) {
        super();
    }

    req(): CmdSignModel {
        return super.buildCmdSign(this.orderList);
    }

    resp(data: CmdSignModel): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.ORDERS_LIST;
    }

}