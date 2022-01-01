import { CmdCode } from '../../code/index';
import { CmdSignModel,WcWorkOrderModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class WcWorkOrderPostCmd extends AHttpCmd {
    constructor(private model: Array<WcWorkOrderModel>) {
        super();
    }

    req(): CmdSignModel {
        return super.buildCmdSign(this.model);
    }

    resp(data: any): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.WC_WORK_ORDER_POST;
    }
}
