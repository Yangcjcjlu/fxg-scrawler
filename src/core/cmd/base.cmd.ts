import { CmdSignModel, BaseModel } from '../models/index';
import { Scheduler } from '../services/index';

function guid(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


export abstract class ACmd {
    public scheduler: Scheduler;
    public syncKey: number;
    public afterRespData: any;
    protected retryCount:number = 3;
    public afterRespDo: (model: CmdSignModel) => void;
    public afterErrorDo: (model: CmdSignModel) => void;

    public setAfterRespDo(respDo: (model: CmdSignModel) => void): ACmd {
        this.afterRespDo = respDo;
        return this;
    }
    public setAfterErrorDo(errorDo: (model: CmdSignModel) => void): ACmd {
        this.afterErrorDo = errorDo;
        return this;
    }

    abstract req(): CmdSignModel;
    abstract resp(model: CmdSignModel): void;
    abstract error(model: CmdSignModel): void;
    abstract getCmdCode(): string;

    getCmdVersion(): string {
        return "1";
    }
    protected buildCmdSign(source?: BaseModel | Array<BaseModel>, reqCode?: string,pageIndex?:number): CmdSignModel {
        let cmdSign: CmdSignModel = new CmdSignModel();
        cmdSign.cmdCode = `${this.getCmdCode()}`;
        cmdSign.cmdVersion = this.getCmdVersion();
        cmdSign.reqCode = reqCode;
        cmdSign.pageSize = 50;
        cmdSign.pageIndex= pageIndex || 1;
        let returnStruct = this.returnStruct();
        if(returnStruct){
            cmdSign.returnStruct = JSON.stringify(returnStruct);
        }
        cmdSign.token = guid();
        if (source) {
            cmdSign.source = JSON.stringify(source);
        }
        cmdSign.sessionToken = localStorage.getItem("sessionToken");
        return cmdSign;
    }

    setParams(parms: any) { }

    getScope(): string {
        return "CRAWLER";
    }
    /**
     * 模拟数据
     * @param reqSign 
     */
    mock(reqSign: CmdSignModel): CmdSignModel {
        return null;
    }

    returnStruct(): any {
        return null;
    }
}

export abstract class AHttpCmd extends ACmd {
    public error(model: CmdSignModel): void {
    }
}