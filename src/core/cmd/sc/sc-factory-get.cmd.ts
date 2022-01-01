import { CmdCode } from '../../code/index';
import { CmdSignModel,WcFactoryModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class ScFactoryGetCmd extends AHttpCmd {
    constructor(private code:string,private bizType:number) {
        super();
    }

    req(): CmdSignModel {
        let model = new WcFactoryModel();
        model.code = this.code;
        model.bizType= this.bizType;
        return super.buildCmdSign(model);
    }

    resp(data: CmdSignModel): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.SC_FACTORY_GET;
    }
}
