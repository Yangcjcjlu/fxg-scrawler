import { CmdCode } from '../../code/index';
import { CmdSignModel,WoGreeItemModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class WoGreeItemPostCmd extends AHttpCmd {
    constructor(private model: WoGreeItemModel) {
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
        return CmdCode.WO_GREE_ITEM_POST;
    }
}
