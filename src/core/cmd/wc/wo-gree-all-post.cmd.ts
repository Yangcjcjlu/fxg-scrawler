import { CmdCode } from '../../code';
import { CmdSignModel,WoGreeAllModel } from '../../models';
import { AHttpCmd } from '../base.cmd';

export class WoGreeAllPostCmd extends AHttpCmd {
    constructor(private model: Array<WoGreeAllModel>) {
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
        return CmdCode.WO_GREE_ALL_POST;
    }
}
