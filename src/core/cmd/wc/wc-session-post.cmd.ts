import { CmdCode, MsgActionCode } from '../../code/index';
import { CmdSignModel, ScUserModel, EventMsgModel } from '../../models/index';
import { AHttpCmd } from './../base.cmd';

export class WcSessionPostCmd extends AHttpCmd {
    constructor(private model: ScUserModel) {
        super();
    }

    req(): CmdSignModel {
        return super.buildCmdSign(this.model);
    }

    resp(data: CmdSignModel): void {
        let model:ScUserModel = data.source;
        localStorage.setItem("sessionToken",data.sessionToken);
        let eventMsg = new EventMsgModel('popup', 'bg');
        eventMsg.action = MsgActionCode.SET_SESSION;
        eventMsg.data = data.sessionToken;
        chrome.runtime.sendMessage(eventMsg, (response) => {
        });
    }

    error(model: CmdSignModel): void {
    }

    returnStruct(): any {
        return {
            name:""
        };
    }
    getCmdCode(): string {
        return CmdCode.WC_SESSION_POST;
    }
}
