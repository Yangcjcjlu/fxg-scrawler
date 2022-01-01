import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel } from '../core/models'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, BizType } from '../core/code'
import { Scheduler } from '../core/services'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeAllPostCmd } from '../core/cmd'
import * as $ from 'jquery';
import { ScFactoryGetCmd } from '../core/cmd/sc';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { WoGreeAllModel } from '../core/models'

class GreeInstallDetailCrawler extends BaseCrawler {

	getCrawlerCode(): string {
		return Constants.FACTORY_GREE_INSTALL_DETAIL;
	}

	crawl() {
		let pathname = location.pathname;
		if (pathname == '/hjzx/az/doUpdateAz') {
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

		let orderNo = <number>super.elementValueBySelector("#xsdh")

		let name: string = <string>super.elementValueBySelector("#gmdw");
		let lxr: string = <string>super.elementValueBySelector("#lxr");
		let dhhm: string = <string>super.elementValueBySelector("#dhhm");
		let yddh: string = <string>super.elementValueBySelector("#yddh");
		let yddh2: string = <string>super.elementValueBySelector("#yddh2");
		let dzyx: string = <string>super.elementValueBySelector("#dzyx");
		let ssqy: string = <string>super.elementValueBySelector("#ssqy");
		let xsdh: string = <string>super.elementValueBySelector("#xsdh");
		let yyazsj: string = <string>super.elementValueBySelector("#yyazsj");
		let gmrq: string = <string>super.elementValueBySelector("#gmrq");
		let xsdwno: string = <string>super.elementValueBySelector("#xsdwno");
		let xswdmc: string = <string>super.elementValueBySelector("#xswdmc ");

		let userType: string = <string>super.elementTextBySelector("#yhsx option:selected");
		let xslx: string = <string>super.elementTextBySelector("#xslx option:selected");
		let province: string = <string>super.elementTextBySelector("#sfen option:selected");
		let city: string = <string>super.elementTextBySelector("#cshi option:selected");
		let district: string = <string>super.elementTextBySelector("#xian option:selected");
		let street: string = <string>super.elementTextBySelector("#jied option:selected");
		let address: string = <string>super.elementValueBySelector("#dizi");
		let fphm: string = <string>super.elementValueBySelector("#fphm");



		let woGreeUserModel: WoGreeUserModel = new WoGreeUserModel();
		woGreeUserModel.name = name;
		woGreeUserModel.areaCode = ssqy;
		woGreeUserModel.telephone = dhhm;
		woGreeUserModel.userType = userType;
		woGreeUserModel.mobile = yddh;
		woGreeUserModel.mobile2 = yddh2;
		woGreeUserModel.province = province;
		woGreeUserModel.city = city;
		woGreeUserModel.district = district;
		woGreeUserModel.street = street;
		woGreeUserModel.address = address;
		woGreeUserModel.lxr = lxr;
		woGreeUserModel.dzyx = dzyx;
		woGreeUserModel.xsdh = xsdh;
		woGreeUserModel.yyazsj = yyazsj;
		woGreeUserModel.gmrq = gmrq;
		woGreeUserModel.xsdwno = xsdwno;
		woGreeUserModel.xswdmc = xswdmc;
		woGreeUserModel.xslx = xslx;
		woGreeUserModel.fphm = fphm;

		let cpxx = $("[id=cpxx]");
		let length = (cpxx.eq(0).find("tr").length - 1) / 2;
		let items: any = [];
		for (let i = 0; i < length; i++) {
			let item: any = {};
			item.id=i+1;
			item.category = <string>super.elementTextBySelector(`#spid${i} option:selected`);
			item.subclass = <string>super.elementTextBySelector(`#xlid${i} option:selected`);
			item.series = <string>super.elementValueBySelector(`#xiid${i} option:selected`);
			item.danwei = <string>super.elementValueBySelector(`#danwid${i} option:selected`);
			item.wjsl= <string>super.elementValueBySelector(`#wjslid${i}`);
			item.jxid = <string>super.elementValueBySelector(`#jxid${i}`);
			item.wldm= <string>super.elementValueBySelector(`#wldmid${i}`);
			item.jiege = <string>super.elementValueBySelector(`#jiegeid${i}`);
			item.shul = <string>super.elementValueBySelector(`#shulid${i}`);
			item.njsl = <string>super.elementValueBySelector(`#njslid${i}`);
			items.push(item);
		}


		let zjia: string = <string>super.elementValueBySelector("#zjia");
		let jcguan: string = <string>super.elementValueBySelector("#jcguan");
		let kqkg: string = <string>super.elementValueBySelector("#kqkg");
		let gkzy: string = <string>super.elementValueBySelector("#gkzy");
		let yccxqk: string = <string>super.elementValueBySelector("#yccxqk");
		let beiz: string = <string>super.elementTextBySelector("#beiz");


		let woGreeItemModel: WoGreeItemModel = new WoGreeItemModel();
		woGreeItemModel.items=items;
		woGreeItemModel.zjia = zjia;
		woGreeItemModel.kqkg = kqkg;
		woGreeItemModel.gkzy = gkzy;
		woGreeItemModel.yccxqk = yccxqk;
		woGreeItemModel.jcguan = jcguan;
		woGreeItemModel.beiz = beiz;




		let requireReadArr: any = [];
		let opDetails: any = [];
		let completionDetails: any = [];
		let historyRepair: any = [];

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
			model.fkjg = tdArr.eq(5).text();
			opDetails.push(model)

		}
		for (let i = 1; i < tab3List.eq(1).find("tr").length; i++) {
			let model: any = {

			}
			let tdArr = tab3List.eq(1).find("tr").eq(i).find("td");
			model.id = i;
			model.czlb = tdArr.eq(0).text();//收入类别
			model.cznr = tdArr.eq(1).text();//收入金额
			model.njtm = tdArr.eq(2).text();//    备注
			model.wjtm = tdArr.eq(3).text();
			model.njtm2 = tdArr.eq(4).text();
			model.azr = tdArr.eq(5).text();
			model.fkjg = tdArr.eq(6).text();
			completionDetails.push(model)
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

		if (localStorage.getItem(Constants.GREE_DETAIL_INSTALL_ARRAY)) {
			greeDetailArr = JSON.parse(localStorage.getItem(Constants.GREE_DETAIL_INSTALL_ARRAY))
			for (let i = 0; i < greeDetailArr.length; i++) {
				if (greeDetailArr[i].orderNo == orderNo) {
					continue;
				}
				if (i == (greeDetailArr.length - 1)) {
					greeDetailArr.push(greeDetail)
					localStorage.setItem(Constants.GREE_DETAIL_INSTALL_ARRAY, JSON.stringify(greeDetailArr));
				}
			}

		}
		else {
			greeDetailArr.push(greeDetail);
			localStorage.setItem(Constants.GREE_DETAIL_INSTALL_ARRAY, JSON.stringify(greeDetailArr));
		}
		let greeDetailData = this.getData();
		let woIdArray = greeDetailData.woIdList;
		if (woIdArray && woIdArray.length) {
			let nextWoId = woIdArray[0].url;
			woIdArray.shift();
			greeDetailData.woIdList = woIdArray;
			this.saveData(greeDetailData);
			location.href = nextWoId;
		}
		else {
			let model: Array<WoGreeAllModel> = [];
			let arr = JSON.parse(localStorage.getItem(Constants.GREE_DETAIL_INSTALL_ARRAY));
			for (let item of arr) {
				item.gree = JSON.parse(item.gree)
				item.greeItem = JSON.parse(item.greeItem)
				item.greeUser = JSON.parse(item.greeUser)
			}
			model = arr;
			let woGreeAllPostCmd = new WoGreeAllPostCmd(model)
			woGreeAllPostCmd.setAfterRespDo((data: any) => {
				if (greeDetailData.isEnd) {
					localStorage.removeItem(Constants.FACTORY_GREE_INSTALL_DETAIL);
					localStorage.removeItem(Constants.GREE_DETAIL_INSTALL_ARRAY);
					location.href = "/hjzx/az/azdSp_doListAzd?azorjs=az";
				}
				else {
					let cmd = new WcWorkOrderListCmd(Constants.FACTORY_GREE, ReqCode.WO_LIST_CAN_CRAWL, greeDetailData.pageIndex, BizType.INSTALL);
					cmd.setAfterRespDo((cmdSign) => {
						localStorage.removeItem(Constants.GREE_DETAIL_INSTALL_ARRAY);
						let thdOrderArray: Array<WcWorkOrderModel> = cmdSign.source;
						if (thdOrderArray.length) {
							let woIdArray: Array<any> = [];
							for (let order of thdOrderArray) {
								woIdArray.push({ url: order.detailUrl });
							}
							let nextWoId = woIdArray.shift().url;
							greeDetailData.pageIndex = cmdSign.pageIndex;
							if (cmdSign.source.length < cmdSign.pageSize) {
								greeDetailData.isEnd = true;
							}
							greeDetailData.woIdList = woIdArray;
							this.saveData(greeDetailData);//设置可爬取的工单id
							location.href = nextWoId;
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
			localStorage.removeItem(Constants.FACTORY_GREE_INSTALL_DETAIL);
		}
	}
}

let greeInstallDetailCrawler = new GreeInstallDetailCrawler();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = greeInstallDetailCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = greeInstallDetailCrawler.getCrawlerCode();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		if (response.running) {
			greeInstallDetailCrawler.crawl();
		}
	});

});
