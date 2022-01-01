import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel, FittingModel, GreeModel } from '../core/models/index'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, Fittings, RespCode } from '../core/code/index'
import { Scheduler } from '../core/services/index'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeAllPostCmd, HsProductModelPostCmd } from '../core/cmd/index'
import * as $ from 'jquery';
import { ScFactoryGetCmd, ScFittingPostCmd, ScFittingListCmd } from '../core/cmd/index';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';

class GreeFittingCrawler extends BaseCrawler {

	getCrawlerCode(): string {
		return Constants.FACTORY_GREE_FITTING;
	}

	crawl() {
		let pathName = location.pathname;
		if (pathName == "/pjxt/peijianx/search/xJSSKCAction.do") {
			/**爬取配件 */
			let count = this.getFittingData().crawlPage ? this.getFittingData().crawlPage : 0;
			if (count == 0) {
				let url = "http://pjgl.gree.com:7101/pjxt/peijianx/search/xJSSKCAction.do?xorjFlag=03&opt.value=doList&paged=" + 1;
				let greeFittingData = this.getFittingData();
				greeFittingData.crawlPage = 1;
				localStorage.setItem(Constants.FACTORY_GREE_FITTING, JSON.stringify(greeFittingData));
				location.href = url;
			}
			this.getFittings(count);
		}
	}

	/**爬取配件 */
	getFittings(count) {
		let greeFittingData = this.getFittingData();
		$('table').eq(3).find("tbody tr").each(function (i) {
			/**判断是否有数据 */
			let code = $(this).children('td').eq(0).text().trim() ? $(this).children('td').eq(0).text().trim() : "";
			let name = $(this).children('td').eq(1).text().trim() ? $(this).children('td').eq(1).text().trim() : "";
			let price = $(this).children('td').eq(5).text().trim() ? $(this).children('td').eq(5).text().trim() : "";
			if (code != "" && name != "" && price != "") {
				let fittingModel: FittingModel = new FittingModel();
				fittingModel.code = code;
				fittingModel.name = name;
				fittingModel.factoryPrice = price;
				greeFittingData.fittingList = greeFittingData.fittingList ? greeFittingData.fittingList : [];
				greeFittingData.codeList = greeFittingData.codeList ? greeFittingData.codeList : [];
				if (greeFittingData.codeList.indexOf(code) < 0) {
					greeFittingData.fittingList.push(fittingModel);
				}
			}
			/**获取总共页数 */
			if ($(this).children('td') && $(this).children('td').length == 1) {
				let reg = /\/[\w]+/
				let str = $(this).children('td').eq(0).text();
				let maxPage = reg.exec(str)[0].replace(/\//, "");
				greeFittingData.maxPage = parseInt(maxPage);
			}
		});
		/**下页个页面 */
		greeFittingData.crawlPage = count + 1;
		localStorage.setItem(Constants.FACTORY_GREE_FITTING, JSON.stringify(greeFittingData));
		if ((count + 1) <= greeFittingData.maxPage) {
			let url = "http://pjgl.gree.com:7101/pjxt/peijianx/search/xJSSKCAction.do?xorjFlag=03&opt.value=doList&paged=" + (count + 1);
			location.href = url;
		} else {
			/***爬取完成 */
			let fittingsList: Array<FittingModel> = greeFittingData.fittingList;
			let newFitiinglist: Array<FittingModel> = new Array<FittingModel>();
			let codeList = greeFittingData.codeList;
			/**判断数据库是否有此条记录 */
			for (let fittingModel of fittingsList) {
				if (codeList.indexOf(fittingModel.code) < 0) {
					newFitiinglist.push(fittingModel);
					greeFittingData.codeList.push(fittingModel.code);
				}
			}
			greeFittingData.crawlPage = 0;
			localStorage.setItem(Constants.FACTORY_GREE_FITTING, JSON.stringify(greeFittingData));
			let fittingPostCmd: ScFittingPostCmd = new ScFittingPostCmd(newFitiinglist);
			fittingPostCmd.setAfterRespDo((cmdSign) => {
				if (cmdSign.respCode == RespCode.SUCCESS) {
					alert("添加成功!!!");
				}
			})
			Scheduler.exe(fittingPostCmd);

		}
	}

	/**获得已经添加数据 */
	getFittingCodeList() {
		let greeFittingData = this.getFittingData();
		let fittingListCmd: ScFittingListCmd = new ScFittingListCmd();
		fittingListCmd.setAfterRespDo((cmdSign: any) => {
			console.log("读取完成")
			if (cmdSign.respCode == RespCode.SUCCESS) {
				let codeList = [];
				for (let fittingModel of cmdSign.source) {
					codeList.push(fittingModel.code);
				}
				greeFittingData.codeList = codeList;
				localStorage.setItem(Constants.FACTORY_GREE_FITTING, JSON.stringify(greeFittingData));
				this.crawl();
			}
		})
		Scheduler.exe(fittingListCmd);
	}


	processMsg(request: EventMsgModel): any {
		if (request.action == MsgActionCode.CONTENT_RELOAD) {
			location.reload();
		} else if (request.action == MsgActionCode.CLEAR_CACHE) {
			localStorage.removeItem(Constants.FACTORY_GREE_FITTING);
		}
	}
}

let greeFittingCrawler = new GreeFittingCrawler();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = greeFittingCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = greeFittingCrawler.getCrawlerCode();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		if (response.running) {
			greeFittingCrawler.crawl();
		}
	});

});
