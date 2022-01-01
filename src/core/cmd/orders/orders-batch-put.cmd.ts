import { AHttpCmd } from './../base.cmd';
import { CmdSignModel } from '../../models/cmdsign.model';
import { CmdCode } from '../../code/index';


export class OrdersBatchPutCmd extends AHttpCmd{

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
        return CmdCode.ORDERS_BATCH_PUT;
    }
}