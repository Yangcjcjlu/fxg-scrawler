import { CmdCode } from '../../code/index';
import { CmdSignModel,WoGreeModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class WoGreePatchCmd extends AHttpCmd {
    constructor(private model: any) {
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
        return CmdCode.WO_GREE_PATCH;
    }
}
