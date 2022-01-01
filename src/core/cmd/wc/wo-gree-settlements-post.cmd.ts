import { CmdCode } from '../../code';
import { CmdSignModel,WoGreeSettlementModel } from '../../models';
import { AHttpCmd } from '../base.cmd';

export class WoGreeSettlementsPostCmd extends AHttpCmd {
    constructor(private model: Array<WoGreeSettlementModel>) {
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
        return CmdCode.WO_GREE_SETTLEMENTS_POST;
    }
}
