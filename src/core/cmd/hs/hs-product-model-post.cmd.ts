import { CmdCode } from '../../code/index';
import { CmdSignModel,WcFactoryModel, GreeModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class HsProductModelPostCmd extends AHttpCmd {
    constructor(private modelList:Array<GreeModel>) {
        super();
    }

    req(): CmdSignModel {
        return super.buildCmdSign(this.modelList);
    }

    resp(data: CmdSignModel): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.MIDEA_ORDER_POST;
    }
}
