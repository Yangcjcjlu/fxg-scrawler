import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel } from '../core/models'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, BizType } from '../core/code'
import { Scheduler } from '../core/services'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeAllPostCmd } from '../core/cmd'
import * as $ from 'jquery';
import { ScFactoryGetCmd } from '../core/cmd/sc';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { WoGreeAllModel } from '../core/models'

class GreeInstallCrawler extends BaseCrawler {

	getCrawlerCode(): string {
		return Constants.FACTORY_GREE_INSTALL;
	}

	crawl() {
		let data = this.getData();
		let pathname = location.pathname;
		if (pathname == "/hjzx/az/doListLcLsAz" && this.getQueryString("otype") == "az" && this.getQueryString("cd")=="pgcx"
		) {
			this.buttonClick();
		} else if (pathname == "/hjzx/az/doListLcLsAz" && !this.getQueryString("otype")) {
			this.crawlList();
		} else {

		}
	}


	crawlList() {
		//是否在爬取列表
		let greeData = this.getData();
		if (greeData.crawlPage) {
			let currentPage: any = <number>$("#paged").val();//当前页数
			if (currentPage != greeData.crawlPage) {
				// location.href = `/hjzx/assign/doListAssign?p=1&paged=${greeData.crawlPage}`;
				return;
			}
			//设置基础信息
			let maxId: number = greeData.maxId || 0;//后台已经存取的最大工单号
			let woIdMap = greeData.woIdMap || {};
			let woIdArr = JSON.parse(localStorage.getItem("GREE_INSTALL_LIST")) || [];
			let canCraw: boolean = true;
			//获取本页所有工单号
			$("#dv tbody:first tr").each((trIndex: number, tr: any) => {
				let woId: string = $(tr).find("td:eq(2)").text().trim().replace(/[\r\n]/g, "");
				let orderNo: string = $(tr).find("td:eq(3)").text().trim().replace(/[\r\n]/g, "");
				let url: string = $(tr).find("td:eq(0)").find("a:eq(0)").attr("href");
				let status: any = this.switchStatus($(tr).find("td:eq(1)").text().trim().replace(/[\r\n]/g, ""));
				let mobile: any = $(tr).find("td:eq(5)").text().trim().replace(/[\r\n]/g, "");
				if (parseInt(woId) <= maxId) {//如果发现本页有比maxId小的工单，则结束抓取
					canCraw = false;
				} else {
					woIdMap[woId] = true;
					let model: any = {
						id: woId,
						orderNo: orderNo,
						status: status,
						mobile: mobile,
						url: url
					}
					woIdArr.push(model)
				}
			})
			localStorage.setItem("GREE_INSTALL_LIST", JSON.stringify(woIdArr));
			if (canCraw && $("#LcLsAz img[title='后一页']").length) {//可抓取并且还有下一页
				let nextPage: number = (parseInt(currentPage) + 1);
				greeData.woIdMap = woIdMap;
				greeData.crawlPage = nextPage;
				localStorage.setItem(Constants.FACTORY_GREE_INSTALL, JSON.stringify(greeData));
				$("#LcLsAz img[title='后一页']").click();
			} else {
				//处理已经爬到的工单
				let wcWoArray: Array<WcWorkOrderModel> = [];
				for (let woId of Object.keys(woIdMap)) {
					let model: WcWorkOrderModel = new WcWorkOrderModel();
					let woIdArr = JSON.parse(localStorage.getItem("GREE_INSTALL_LIST"));
					for (let item of woIdArr) {
						if (item.id == (woId)) {
							model.mobile = item.mobile
							model.detailUrl = item.url
							model.sourceId = item.orderNo
						}
					}
					model.factoryCode = Constants.FACTORY_GREE;
					model.bizType = BizType.INSTALL;
					wcWoArray.push(model);
				}
				let cmd = new WcWorkOrderPostCmd(wcWoArray);
				cmd.setAfterRespDo((cmdSign) => {
					localStorage.removeItem(Constants.FACTORY_GREE_INSTALL);
					localStorage.removeItem("GREE_INSTALL_LIST");
					this.gotoNextCrawlOrder();
				})
				Scheduler.exe(cmd);
			}
		} else {
			let factoryCmd = new ScFactoryGetCmd(Constants.FACTORY_GREE, BizType.INSTALL);
			factoryCmd.setAfterRespDo((sign: CmdSignModel) => {
				let factoryModel: ScFactoryModel = sign.source;
				let maxId = factoryModel ? factoryModel.maxWoId : 0;
				greeData.crawlPage = 1;
				greeData.maxId = maxId;
				localStorage.setItem(Constants.FACTORY_GREE_INSTALL, JSON.stringify(greeData));
				location.href = "/hjzx/az/doListLcLsAz?otype=az&xsorsh=1&cd=pgcx";
			})
			Scheduler.exe(factoryCmd);

		}
	}
	buttonClick() {
		$("#search")[0].click();
	}

	switchStatus(string: string) {
		let number: number = 0;
		switch (string) {
			case "服务人员报完工":
				number = 1;
				break;
			case "服务人员接收派工":
				number = 2;
				break;
			case "待服务人员确认接收派工":
				number = 3;
				break;
			case "已保存工单":
				number = 4;
				break;
			default:
				number = 0;
				break;
		}
		return number
	}


	gotoNextCrawlOrder() {
		let greeDetailData = this.getDataByCode(Constants.FACTORY_GREE_INSTALL_DETAIL);
		let woIdList: Array<any> = greeDetailData.woIdList || [];
		if (woIdList && woIdList.length) {
			let nextWoId = woIdList.shift();
			this.saveDataByCode(Constants.FACTORY_GREE_INSTALL_DETAIL, greeDetailData);
			location.href = nextWoId;
		} else {
			let cmd = new WcWorkOrderListCmd(Constants.FACTORY_GREE, ReqCode.WO_LIST_CAN_CRAWL, 1, BizType.INSTALL);
			cmd.setAfterRespDo((cmdSign) => {
				let thdOrderArray: Array<WcWorkOrderModel> = cmdSign.source;
				if (thdOrderArray.length) {
					let woIdArray: Array<any> = [];
					for (let order of thdOrderArray) {
						woIdArray.push({ url: order.detailUrl });
					}
					let nextWoId = woIdArray[0].url;
					woIdArray.shift()
					greeDetailData.pageIndex = cmdSign.pageIndex;
					if (cmdSign.source.length < cmdSign.pageSize) {
						greeDetailData.isEnd = true;
					}
					greeDetailData.woIdList = woIdArray;
					this.saveDataByCode(Constants.FACTORY_GREE_INSTALL_DETAIL, greeDetailData)//设置可爬取的工单id
					location.href = nextWoId;
				}
				else{
					location.href = "/hjzx/az/azdSp_doListAzd?azorjs=az";
				}

			})
			Scheduler.exe(cmd);
		}
	}

	processMsg(request: EventMsgModel): any {
		if (request.action == MsgActionCode.CONTENT_RELOAD) {
			location.reload();
		} else if (request.action == MsgActionCode.CLEAR_CACHE) {
			localStorage.removeItem(Constants.FACTORY_GREE);
		}
	}
}

let greeInstallCrawler = new GreeInstallCrawler();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = greeInstallCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = greeInstallCrawler.getCrawlerCode();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		if (response.running) {
			greeInstallCrawler.crawl();
		}
	});

});
