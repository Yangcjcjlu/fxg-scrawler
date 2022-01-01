import { CmdCode} from '../../code/index';
import { CmdSignModel,GreeCateforyModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class GreeCateforyPostCmd extends AHttpCmd {
    constructor(private model: Array<GreeCateforyModel>) {
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
        return CmdCode.GREE_CATEFORY_POST;
    }
}