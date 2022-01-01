import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel } from '../core/models'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, BizType } from '../core/code'
import { Scheduler } from '../core/services'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeAllPostCmd } from '../core/cmd'
import * as $ from 'jquery';
import { ScFactoryGetCmd } from '../core/cmd/sc';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { WoGreeAllModel } from '../core/models'

class GreeDetailCrawler extends BaseCrawler {

	getCrawlerCode(): string {
		return Constants.FACTORY_GREE_DETAIL;
	}

	crawl() {
		let pathname = location.pathname;
		if (pathname == '/hjzx/assign/doLookupAssign.action') {
			this.crawlDetail();
		}
	}


	switchStatus(string: string) {
		let number: number = 0;
		switch (string) {
			case "正常关闭":
				number = 1;
				break;
			case "分部报完工":
				number = 1;
				break;
			default:
				number = 0;
				break;
		}
		return number
	}

	getParam(name) {
		var search = document.location.search;
		//alert(search);
		var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
		var matcher = pattern.exec(search);
		var items = null;
		if (null != matcher) {
			try {
				items = decodeURIComponent(decodeURIComponent(matcher[1]));
			} catch (e) {
				try {
					items = decodeURIComponent(matcher[1]);
				} catch (e) {
					items = matcher[1];
				}
			}
		}
		return items;
	};

	crawlDetail() {

		let orderNo = this.getParam("pgid");

		let name: string = <string>super.elementValueBySelector("#yhmc");
		let areaCode: string = <string>super.elementValueBySelector("#areaCode");
		let telephone: string = <string>super.elementValueBySelector("dhhm");
		let userType: string = <string>super.elementTextBySelector("#yhsx option:selected");
		let mobile: string = <string>super.elementValueBySelector("#yddh");
		let mobile2: string = <string>super.elementValueBySelector("#yddh2");
		let callerMobile: string = <string>super.elementValueBySelector("#ldhmid");
		let priority: string = <string>super.elementTextBySelector("#yxjiid option:selected");
		let province: string = <string>super.elementTextBySelector("#sfen option:selected");
		let city: string = <string>super.elementTextBySelector("#cshi option:selected");
		let district: string = <string>super.elementTextBySelector("#xian option:selected");
		let street: string = <string>super.elementTextBySelector("#xzhen option:selected");
		let address: string = <string>super.elementValueBySelector("#dizi");

		let woGreeUserModel: WoGreeUserModel = new WoGreeUserModel();
		woGreeUserModel.name = name;
		woGreeUserModel.areaCode = areaCode;
		woGreeUserModel.telephone = telephone;
		woGreeUserModel.userType = userType;
		woGreeUserModel.mobile = mobile;
		woGreeUserModel.mobile2 = mobile2;
		woGreeUserModel.callerMobile = callerMobile;
		woGreeUserModel.priority = priority;
		woGreeUserModel.province = province;
		woGreeUserModel.city = city;
		woGreeUserModel.district = district;
		woGreeUserModel.street = street;
		woGreeUserModel.address = address;



		let demand: string = <string>super.elementTextBySelector("#xxlbid option:selected");
		let channel: string = <string>super.elementTextBySelector("#xxqdid option:selected");
		let source: string = <string>super.elementTextBySelector("#xxlyid option:selected");
		let visitDate: string = <string>super.elementValueBySelector("#yhqwsmsjid");
		let infoRemark: string = <string>super.elementTextBySelector("#assignbeizid");
		let category: string = <string>super.elementTextBySelector("#spid0 option:selected");
		let subclass: string = <string>super.elementTextBySelector("#xlid0 option:selected");
		let series: string = <string>super.elementValueBySelector("#xiid0");
		let model: string = <string>super.elementValueBySelector("#jxid0");
		let symptom: string = <string>super.elementValueBySelector("#gzxxid0 option:selected");
		let barcode: string = <string>super.elementValueBySelector("#njtmid0");
		let buyDate: string = <string>super.elementValueBySelector("#gmsjid0");
		let sellUnit: string = <string>super.elementValueBySelector("#xsdwid0");
		let sellPhone: string = <string>super.elementValueBySelector("#xsdwdhid0");
		let serviceUnit: string = <string>super.elementValueBySelector("#fwdwid0");
		let servicePhone: string = <string>super.elementValueBySelector("#fwdwdhid0");
		let detail: string = <string>super.elementTextBySelector("#beizid0");

		let woGreeItemModel: WoGreeItemModel = new WoGreeItemModel();
		woGreeItemModel.demand = demand;
		woGreeItemModel.channel = channel;
		woGreeItemModel.source = source;
		woGreeItemModel.visitDate = visitDate;
		woGreeItemModel.infoRemark = infoRemark;
		woGreeItemModel.category = category;
		woGreeItemModel.subclass = subclass;
		woGreeItemModel.series = series;
		woGreeItemModel.model = model;
		woGreeItemModel.symptom = symptom;
		woGreeItemModel.barcode = barcode;
		woGreeItemModel.buyDate = buyDate;
		woGreeItemModel.sellUnit = sellUnit;
		woGreeItemModel.sellPhone = sellPhone;
		woGreeItemModel.serviceUnit = serviceUnit;
		woGreeItemModel.servicePhone = servicePhone;
		woGreeItemModel.detail = detail;

		let requireReadArr: any = [];
		let opDetails: any = [];
		let completionDetails: any = [];
		let historyRepair: any = [];

		let tab2List = $("#tab2").find("tr");
		for (var i = 1; i < tab2List.length; i++) {
			let model: any = {

			}
			let tdArr = tab2List.eq(i).find("td");
			model.id = i;
			model.operator = tdArr.eq(0).text();//收入类别
			model.operateDate = tdArr.eq(1).text();//收入金额
			model.operateSc = tdArr.eq(2).text();//    备注
			model.xzyqlb = tdArr.eq(3).text();
			model.xzyqnr = tdArr.eq(4).text();
			model.sfyd = tdArr.eq(5).text();
			model.ydsj = tdArr.eq(6).text();
			model.ydrzh = tdArr.eq(7).text();
			model.ydrmc = tdArr.eq(8).text();
			model.ydrscid = tdArr.eq(9).text();
			model.ydrscmc = tdArr.eq(10).text();
			requireReadArr.push(model);
		}
		let tab3List = $("[id=tab3]");
		for (let i = 1; i < tab3List.eq(0).find("tr").length; i++) {
			let model: any = {

			}
			let tdArr = tab3List.eq(0).find("tr").eq(i).find("td");
			model.id = i;
			model.czlb = tdArr.eq(0).text();//收入类别
			model.cznr = tdArr.eq(1).text();//收入金额
			model.czsj = tdArr.eq(2).text();//    备注
			model.czr = tdArr.eq(3).text();
			model.czwd = tdArr.eq(4).text();
			model.wdgh = tdArr.eq(5).text();
			model.wdyddh = tdArr.eq(6).text();
			model.cjr = tdArr.eq(7).text();
			model.cjsj = tdArr.eq(8).text();
			model.fkjg = tdArr.eq(9).text();
			opDetails.push(model)

		}
		for (let i = 1; i < tab3List.eq(1).find("tr").length; i++) {
			let model: any = {

			}
			let tdArr = tab3List.eq(1).find("tr").eq(i).find("td");
			model.id = i;
			model.czlb = tdArr.eq(0).text();//收入类别
			model.jqtm = tdArr.eq(1).text();//收入金额
			model.njtm = tdArr.eq(2).text();//    备注
			model.wxg = tdArr.eq(3).text();
			model.wxzfy = tdArr.eq(4).text();
			model.jszt = tdArr.eq(5).text();
			completionDetails.push(model)

		}
		for (let i = 1; i < tab3List.eq(2).find("tr").length; i++) {
			let model: any = {

			}
			let tdArr = tab3List.eq(2).find("tr").eq(i).find("td");
			model.id = i;
			model.xxbh = tdArr.eq(0).text();//收入类别
			model.cpdl = tdArr.eq(1).text();//收入金额
			model.bxsj = tdArr.eq(2).text();//    备注
			model.xxly = tdArr.eq(3).text();
			model.xxlb = tdArr.eq(4).text();
			model.xxzt = tdArr.eq(5).text();
			model.wxdw = tdArr.eq(6).text();
			model.yhmc = tdArr.eq(7).text();
			model.yhdz = tdArr.eq(8).text();
			historyRepair.push(model)
		}
		let woGreeModel: WoGreeModel = new WoGreeModel();
		woGreeModel.requireRead = JSON.stringify(requireReadArr);
		woGreeModel.opDetails = JSON.stringify(opDetails);
		woGreeModel.completionDetails = JSON.stringify(completionDetails);
		woGreeModel.historyRepair = JSON.stringify(historyRepair);
		woGreeModel.orderNo = orderNo;

		let greeDetail: any = {};
		let greeDetailArr: any = []
		greeDetail.orderNo = orderNo;
		greeDetail.gree = JSON.stringify(woGreeModel);
		greeDetail.greeItem = JSON.stringify(woGreeItemModel);
		greeDetail.greeUser = JSON.stringify(woGreeUserModel);

		if (localStorage.getItem(Constants.GREE_DETAIL_ARRAY)) {
			greeDetailArr = JSON.parse(localStorage.getItem(Constants.GREE_DETAIL_ARRAY))
			for (let i = 0; i < greeDetailArr.length; i++) {
				if (greeDetailArr[i].orderNo == orderNo) {
					continue;
				}
				if (i == (greeDetailArr.length - 1)) {
					greeDetailArr.push(greeDetail)
					localStorage.setItem(Constants.GREE_DETAIL_ARRAY, JSON.stringify(greeDetailArr));
				}
			}

		}
		else {
			greeDetailArr.push(greeDetail);
			localStorage.setItem(Constants.GREE_DETAIL_ARRAY, JSON.stringify(greeDetailArr));
		}
		let greeDetailData = this.getData();
		let woIdArray = greeDetailData.woIdList;
		if (woIdArray && woIdArray.length) {
			let nextWoId = woIdArray[0].orderNo;
			woIdArray.shift();
			greeDetailData.woIdList = woIdArray;
			this.saveData(greeDetailData);
			location.href = `/hjzx/assign/doLookupAssign.action?pgid=${nextWoId}&p=6`;
		}
		else {
			let model: Array<WoGreeAllModel> = [];
			let arr = JSON.parse(localStorage.getItem(Constants.GREE_DETAIL_ARRAY));
			for (let item of arr) {
				item.gree = JSON.parse(item.gree)
				item.greeItem = JSON.parse(item.greeItem)
				item.greeUser = JSON.parse(item.greeUser)
			}
			model = arr;
			let woGreeAllPostCmd = new WoGreeAllPostCmd(model)
			woGreeAllPostCmd.setAfterRespDo((data: any) => {
				if (greeDetailData.isEnd) {
					localStorage.removeItem(Constants.FACTORY_GREE_DETAIL);
					localStorage.removeItem(Constants.GREE_DETAIL_ARRAY);
					location.href = "/hjzx/az/azdSp_doListWxd?wxorjs=wx";
					
				}
				else {
					let cmd = new WcWorkOrderListCmd(Constants.FACTORY_GREE, ReqCode.WO_LIST_CAN_CRAWL, greeDetailData.pageIndex, BizType.REPAIR);
					cmd.setAfterRespDo((cmdSign) => {
						localStorage.removeItem(Constants.GREE_DETAIL_ARRAY);
						let thdOrderArray: Array<WcWorkOrderModel> = cmdSign.source;
						if (thdOrderArray.length) {
							let woIdArray: Array<any> = [];
							for (let order of thdOrderArray) {
								woIdArray.push({ orderNo: order.sourceId });
							}
							let nextWoId = woIdArray.shift().orderNo;
							greeDetailData.pageIndex = cmdSign.pageIndex;
							if (cmdSign.source.length < cmdSign.pageSize) {
								greeDetailData.isEnd = true;
							}
							greeDetailData.woIdList = woIdArray;
							this.saveData(greeDetailData);//设置可爬取的工单id
							location.href = `/hjzx/assign/doLookupAssign.action?pgid=${nextWoId}&p=6`;
						}
					})
					Scheduler.exe(cmd);
				}


			})
			Scheduler.exe(woGreeAllPostCmd);
		}
	}



	processMsg(request: EventMsgModel): any {
		if (request.action == MsgActionCode.CONTENT_RELOAD) {
			location.reload();
		} else if (request.action == MsgActionCode.CLEAR_CACHE) {
			localStorage.removeItem(Constants.FACTORY_GREE_DETAIL);
		}
	}
}

let greeDetailCrawler = new GreeDetailCrawler();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = greeDetailCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = greeDetailCrawler.getCrawlerCode();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		if (response.running) {
			greeDetailCrawler.crawl();
		}
	});

});
