import { CmdCode} from '../../code/index';
import { CmdSignModel, MideaInstallOrderModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class MideaInstallOrderPostCmd extends AHttpCmd {
    constructor(private model: MideaInstallOrderModel,private reqCode:string) {
        super();
    }

    req(): CmdSignModel {
        return super.buildCmdSign(this.model,this.reqCode);
    }

    resp(data: any): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.MIDEA_ORDER_POST;
    }
}
