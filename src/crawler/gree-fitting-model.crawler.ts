import { BaseCrawler } from './base.crawler'
import { EventMsgModel, CmdSignModel, WoGreeModel, FittingModel, GreeModel } from '../core/models/index'
import { ReqCode, Constants, MsgActionCode, Fittings, RespCode } from '../core/code/index'
import { Scheduler } from '../core/services/index'
import { WoGreeAllPostCmd, HsProductModelPostCmd } from '../core/cmd/index'
import * as $ from 'jquery';

class GreeFittingModelCrawler extends BaseCrawler {

	getCrawlerCode(): string {
		return Constants.FACTORY_GREE_FITTING_MODEL;
	}

	crawl() {
		let href = location.href;
		let pathName = location.pathname;
		if (pathName == "/pjxt/loginAction.do") {
			location.href = "http://pjgl.gree.com:7101/pjxt/peijian/model/partJx1khAction.do?SearchStr=&SearchStrSpcd=&searchStrjxbm=0";
		} else if (pathName == "/pjxt/peijian/model/partJx1khAction.do") {
			let count = href.charAt(href.length - 1) == "#" ? href.charAt(href.length - 2) : href.charAt(href.length - 1);
			this.crawlList(parseInt(count));
		}
	}

	/***爬取型号 */
	crawlList(count: number) {
		/***型号列表根据物料编码模糊查询0-9 */
		let fittingModelData = this.getFittingModelData() ? this.getFittingModelData() : {};
		/**查出空调型号列表 */
		$('table tbody tr').each(function (i) {
			let code = $(this).children('td').eq(0).text().trim() ? $(this).children('td').eq(0).text().trim() : "";
			let name = $(this).children('td').eq(1).text().trim() ? $(this).children('td').eq(1).text().trim() : "";
			if (code != "" && name != "") {
				let greeModel: GreeModel = new GreeModel();
				greeModel.code = code;
				greeModel.name = name;
				/**型号下配件查询地址 */
				let href = $(this).children('td').eq(1).find("a").attr("onclick")
					.replace(/(window.open\(')/, "").replace(/(',)[\S]+/, "");
				greeModel.url = "http://pjgl.gree.com:7101/pjxt/peijian/model/" + href;
				if (href != "") {
					fittingModelData[code] = greeModel;
				}
			}
		});
		localStorage.setItem(Constants.FACTORY_GREE_FITTING_MODEL, JSON.stringify(fittingModelData));

		/***型号爬取完毕 */
		if ((count + 1) == 10) {
			/***爬取完成 */
			let greeModelList: Array<GreeModel> = []
			for (let index in fittingModelData) {
				greeModelList.push(fittingModelData[index]);
			}
			/**存储品类 */
			let hsProductPostCmd: HsProductModelPostCmd = new HsProductModelPostCmd(greeModelList);
			hsProductPostCmd.setAfterRespDo((cmdSign) => {
				if (cmdSign.respCode == RespCode.SUCCESS) {
					fittingModelData = {};
					localStorage.setItem(Constants.FACTORY_GREE_FITTING_MODEL, JSON.stringify(fittingModelData));
					alert("添加完成");
				}
			})
			Scheduler.exe(hsProductPostCmd);

		} else {
			/***爬取下一个查询 */
			location.href = "http://pjgl.gree.com:7101/pjxt/peijian/model/partJx1khAction.do?SearchStr=&SearchStrSpcd=&searchStrjxbm=" + (count + 1);
		}
	}

	processMsg(request: EventMsgModel): any {
		if (request.action == MsgActionCode.CONTENT_RELOAD) {
			location.reload();
		} else if (request.action == MsgActionCode.CLEAR_CACHE) {
			localStorage.removeItem(Constants.FACTORY_GREE_FITTING_MODEL);
		}
	}
}

let greeFittingModelCrawler = new GreeFittingModelCrawler();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = greeFittingModelCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = greeFittingModelCrawler.getCrawlerCode();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		if (response.running) {
			greeFittingModelCrawler.crawl();
		}
	});

});
