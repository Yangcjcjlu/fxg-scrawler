import { ACmd, AHttpCmd } from "../cmd/base.cmd";
import { CmdCode, Constants, RespCode } from "../code/index";
import { CmdSignModel } from "../models/index";
import { HttpService } from "./index";
let cmdMap: Map<string, ACmd> = new Map();
let cmdPost: any = {};


export class Scheduler {

	static exe(cmd: ACmd): void {
		cmd.scheduler = this;
		let model: CmdSignModel = cmd.req();
		cmdMap.set(model.token, cmd);
		if (cmd instanceof AHttpCmd) {
			let mockSign = cmd.mock(model);
			if (mockSign != null) {
				Scheduler.handleWsResp(mockSign);
			} else {
				if (JSON.stringify(cmdPost) == "{}") {
					cmdPost.cmd = cmd;
					cmdPost.count = 1;
				}
				HttpService.sendData(model)
					.then((cmdSign: CmdSignModel) => {
						cmdSign.source = JSON.parse(cmdSign.source);
						Scheduler.handleWsResp(cmdSign);
					}).catch((error: any) => {
						cmdPost = {};
						alert("后台网络出错,请刷新页面");
					});
			}
		}
	}

	static handleWsResp(cmdSign: CmdSignModel) {
		let cmd: ACmd = cmdMap.get(cmdSign.token);
		if (cmd) {
			if (cmdSign.respCode == RespCode.SUCCESS) {
				cmdPost = {};
				cmd.resp(cmdSign);
				cmd.afterRespDo && cmd.afterRespDo(cmd.afterRespData || cmdSign);
			} else {
				this.checkData(cmdSign)
				cmd.error(cmdSign);
				cmd.afterErrorDo && cmd.afterErrorDo(cmdSign);
			}
			cmd.scheduler = null;
		}
		cmdMap.delete(cmdSign.token);
	}
	static  countTime() {
		if (cmdPost.count < 3) {
			cmdPost.count = cmdPost.count + 1
			this.exe(cmdPost.cmd);
			return false
		}
		else if (cmdPost.count == 3) {
			cmdPost = {};
			return true
		}
	}

	static checkData(cmdSign: CmdSignModel) {
		if (cmdSign.cmdCode == ("CRAWLER_" + CmdCode.SC_FACTORY_GET)) {
			if(this.countTime())
			{
				alert("请求上次列表记录失败,请联系管理员");
			}
		}
		if (cmdSign.cmdCode ==  ("CRAWLER_" + CmdCode.WC_WORK_ORDER_POST) && localStorage.getItem(Constants.FACTORY_GREE) && localStorage.getItem("GREE_LIST")) {
			if(this.countTime())
			{
				alert("提交爬取列表失败,请联系管理员");
			}
		}
		if (cmdSign.cmdCode ==  ("CRAWLER_" + CmdCode.WO_GREE_ALL_POST) && localStorage.getItem(Constants.FACTORY_GREE_DETAIL) && localStorage.getItem(Constants.GREE_DETAIL_ARRAY)) {
			if(this.countTime())
			{
				alert("提交维修详情失败,请联系管理员");
			}
		}
		if (cmdSign.cmdCode ==  ("CRAWLER_" + CmdCode.WO_GREE_ALL_POST) && localStorage.getItem(Constants.FACTORY_GREE_INSTALL_DETAIL) && localStorage.getItem(Constants.GREE_DETAIL_INSTALL_ARRAY)) {
			if(this.countTime())
			{
				alert("提交安装详情失败,请联系管理员");
			}
		}
		if (cmdSign.cmdCode ==  ("CRAWLER_" + CmdCode.WO_GREE_SETTLEMENTS_POST) && (localStorage.getItem("WX_SETTLEMENT_LIST") || localStorage.getItem("AZ_SETTLEMENT_LIST"))) {
			if(this.countTime())
			{
				alert("提交结算详情失败,请联系管理员");
			}
		}
		if (cmdSign.cmdCode ==  ("CRAWLER_" + CmdCode.WO_GREE_SEND_POST) && (localStorage.getItem("WX_SEND_LIST") || localStorage.getItem("AZ_SEND_LIST"))) {
			if(this.countTime())
			{
				alert("提交派送详情失败,请联系管理员");
			}
		}
	}

}
