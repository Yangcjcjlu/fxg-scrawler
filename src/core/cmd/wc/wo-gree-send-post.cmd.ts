import { CmdCode } from '../../code/index';
import { CmdSignModel,WoGreeModel } from '../../models/index';
import { AHttpCmd } from '../base.cmd';

export class WoGreeSendPostCmd extends AHttpCmd {
    constructor(private model: Array<WoGreeModel>) {
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
        return CmdCode.WO_GREE_SEND_POST;
    }
}
