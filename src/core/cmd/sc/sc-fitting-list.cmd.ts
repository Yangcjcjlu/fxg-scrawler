import { CmdCode } from '../../code/index';
import { CmdSignModel,WcFactoryModel, GreeModel, FittingModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class ScFittingListCmd extends AHttpCmd {
    constructor() {
        super();
    }

    req(): CmdSignModel {
        return super.buildCmdSign();
    }

    resp(data: CmdSignModel): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.SC_FITTINGS_LIST;
    }
}
