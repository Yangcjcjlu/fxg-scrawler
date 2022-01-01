import { CmdCode } from '../../code/index';
import { CmdSignModel,WcFactoryModel, GreeModel, FittingModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class ScFittingPostCmd extends AHttpCmd {
    constructor(private modelList:Array<FittingModel>) {
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
        return CmdCode.SC_FITTINGS_POST;
    }
}
