import { CmdCode } from '../../code/index';
import { CmdSignModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class WcSessionGetCmd extends AHttpCmd {
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

    returnStruct(): any {
        return {
            name:""
        };
    }

    getCmdCode(): string {
        return CmdCode.WC_SESSION_GET;
    }
}
