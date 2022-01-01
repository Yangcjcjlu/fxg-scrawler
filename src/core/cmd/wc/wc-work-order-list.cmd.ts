import { CmdCode } from '../../code/index';
import { CmdSignModel,WcFactoryModel } from '../../models/index';
import { AHttpCmd, } from './../base.cmd';

export class WcWorkOrderListCmd extends AHttpCmd {
    constructor(private factoryCode:string,private reqCode:string,private pageIndex:number,private bizType:number) {
        super();
    }

    req(): CmdSignModel {
        let model = new WcFactoryModel();
        model.code = this.factoryCode;
        model.bizType = this.bizType;
        return super.buildCmdSign(model,this.reqCode,this.pageIndex);
    }

    resp(data: any): void {
    }

    error(model: CmdSignModel): void {
    }

    getCmdCode(): string {
        return CmdCode.WC_WORK_ORDER_LIST;
    }
}
