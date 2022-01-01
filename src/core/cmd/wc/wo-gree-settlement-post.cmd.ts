import { CmdCode } from '../../code/index';
import { CmdSignModel,WoGreeSettlementModel } from '../../models/index';
import { AHttpCmd } from '../base.cmd';

export class WoGreeSettlementPostCmd extends AHttpCmd {
    constructor(private model: WoGreeSettlementModel) {
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
        return CmdCode.WO_GREE_SETTLEMENT_POST;
    }
}
