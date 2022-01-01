import { CmdCode } from '../../code/index';
import { CmdSignModel,GreeDictionaryModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class GreeDictionaryPostCmd extends AHttpCmd {
    constructor(private redCode:string,private model:Array<GreeDictionaryModel>) {
        super();
    }

    req(): CmdSignModel {
        return super.buildCmdSign(this.model,this.redCode);
    }

    resp(data: any): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.GREE_DICTIONARY_POST;
    }
}
