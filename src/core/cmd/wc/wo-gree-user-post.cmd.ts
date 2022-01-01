import { CmdCode } from '../../code/index';
import { CmdSignModel,WoGreeUserModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class WoGreeUserPostCmd extends AHttpCmd {
    constructor(private model: WoGreeUserModel) {
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
        return CmdCode.WO_GREE_USER_POST;
    }
}
