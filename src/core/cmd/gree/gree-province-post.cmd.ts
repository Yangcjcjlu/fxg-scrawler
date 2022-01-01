import { CmdCode } from '../../code/index';
import { CmdSignModel,ProvinceModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class GreeProvincePostCmd extends AHttpCmd {
    constructor(private modelArr: Array<ProvinceModel>) {
        super();
    }

    req(): CmdSignModel {
        return super.buildCmdSign(this.modelArr);
    }

    resp(data: any): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.GREE_PROVINCE_POST;
    }
}
