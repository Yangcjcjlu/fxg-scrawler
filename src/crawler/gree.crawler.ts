import * as $ from 'jquery'
import { Constants, MsgActionCode } from '../core/code/index'
import { OrdersModel } from '../core/models'
import { EventMsgModel } from '../core/models/index'
import { BaseCrawler } from './base.crawler'
var xpath = require('xpath');
var dom = require('xmldom').DOMParser

class GreeCrawler extends BaseCrawler {

	getCrawlerCode(): string {
		return Constants.FACTORY_GREE;
	}

	crawl() {
		let data = this.getData();
		let pathname = location.pathname;
		// console.log("pathName==>" + pathname);
		// if (pathname == '/hjzx/' || pathname == '/hjzx/login.jsp' || pathname == '/hjzx/menu.jsp') {

		// } else if ((pathname == "/hjzx/assign/doListAssign.action" || pathname == "/hjzx/assign/doListAssign")&&(this.getQueryString("p")!="3")&&(this.getQueryString("p")!="2")) {
		this.crawlList();
		// } else {

		// }
	}


	crawlList() {
		//是否在爬取列表





		// let greeData = this.getData();
		// if (greeData.crawlPage) {
		// 	let currentPage: any = <number>$("#paged").val();//当前页数
		// 	if (currentPage != greeData.crawlPage) {
		// 		location.href = `/hjzx/assign/doListAssign?p=1&paged=${greeData.crawlPage}`;
		// 		return;
		// 	}

		// 	//设置基础信息
		// 	let maxId: number = greeData.maxId || 0;//后台已经存取的最大工单号
		// 	let woIdMap = greeData.woIdMap || {};
		// 	let woIdArr = JSON.parse(localStorage.getItem("GREE_LIST"))||[];
		// 	let canCraw: boolean = true;
		// 	//获取本页所有工单号
		// 	$("#tbody:first tr").each((trIndex: number, tr: any) => {
		// 		let woId: string = $(tr).find("td:eq(3)").text().trim().replace(/[\r\n]/g, "");
		// 		let status: any = this.switchStatus($(tr).find("td:eq(14)").find("b:eq(0)").text());
		// 		let mobile: any = $(tr).find("td:eq(5)").text().trim().replace(/[\r\n]/g, "");
		// 		if (parseInt(woId) <= maxId) {//如果发现本页有比maxId小的工单，则结束抓取
		// 			canCraw = false;
		// 		} else {
		// 			woIdMap[woId] = true;
		// 			let model: any = {
		// 				id: woId,
		// 				status: status,
		// 				mobile: mobile,
		// 			}
		// 			woIdArr.push(model)
		// 		}
		// 	})
		// 	localStorage.setItem("GREE_LIST", JSON.stringify(woIdArr));
		// 	if (canCraw && $("#dv img[title='后一页']").length) {//可抓取并且还有下一页
		// 		let nextPage: number = (parseInt(currentPage) + 1);
		// 		greeData.woIdMap=woIdMap;
		// 		greeData.crawlPage = nextPage;
		// 		localStorage.setItem(Constants.FACTORY_GREE, JSON.stringify(greeData));
		// 		location.href = `/hjzx/assign/doListAssign?p=1&paged=${nextPage}`;
		// 	} else {
		// 		//处理已经爬到的工单
		// 		let wcWoArray: Array<WcWorkOrderModel> = [];
		// 		for (let woId of Object.keys(woIdMap)) {
		// 			let model: WcWorkOrderModel = new WcWorkOrderModel();
		// 			let woIdArr = JSON.parse(localStorage.getItem("GREE_LIST"));
		// 			for (let item of woIdArr) {
		// 				if (item.id == parseInt(woId)) {
		// 					model.mobile = item.mobile
		// 				}
		// 			}
		// 			model.bizType=BizType.REPAIR;
		// 			model.factoryCode = this.getCrawlerCode();
		// 			model.sourceId = (woId);
		// 			wcWoArray.push(model);
		// 		}
		// 		let cmd = new WcWorkOrderPostCmd(wcWoArray);
		// 		cmd.setAfterRespDo((cmdSign) => {
		// 			localStorage.removeItem(Constants.FACTORY_GREE);
		// 			localStorage.removeItem("GREE_LIST");
		// 			this.gotoNextCrawlOrder();
		// 		})
		// 		Scheduler.exe(cmd);
		// 	}
		// } else {
		// 	let factoryCmd = new ScFactoryGetCmd(this.getCrawlerCode(),BizType.REPAIR);
		// 	factoryCmd.setAfterRespDo((sign: CmdSignModel) => {
		// 		let factoryModel: ScFactoryModel = sign.source;
		// 		let maxId = factoryModel ? factoryModel.maxWoId : 0;
		// 		greeData.crawlPage = 1;
		// 		greeData.maxId = maxId;
		// 		localStorage.setItem(Constants.FACTORY_GREE, JSON.stringify(greeData));
		// 		location.href = "/hjzx/assign/doListAssign?p=1";
		// 	})
		// 	Scheduler.exe(factoryCmd);

		// }
	}

	// switchStatus(string: string) {
	// 	let number: number = 0;
	// 	switch (string) {
	// 		case "正常关闭":
	// 			number = 1;
	// 			break;
	// 		case "分部报完工":
	// 			number = 1;
	// 			break;
	// 		default:
	// 			number = 0;
	// 			break;
	// 	}
	// 	return number
	// }


	// gotoNextCrawlOrder() {
	// 	let greeDetailData = this.getDataByCode(Constants.FACTORY_GREE_DETAIL);
	// 	let woIdList: Array<number> = greeDetailData.woIdList || [];
	// 	if (woIdList && woIdList.length) {
	// 		let nextWoId = woIdList.shift();
	// 		this.saveDataByCode(Constants.FACTORY_GREE_DETAIL, greeDetailData);
	// 		location.href = `/hjzx/assign/doLookupAssign.action?pgid=${nextWoId}&p=6`;
	// 	} else {
	// 		let cmd = new WcWorkOrderListCmd(this.getCrawlerCode(), ReqCode.WO_LIST_CAN_CRAWL, 1, BizType.REPAIR);
	// 		cmd.setAfterRespDo((cmdSign) => {
	// 			let thdOrderArray: Array<WcWorkOrderModel> = cmdSign.source;
	// 			if (thdOrderArray.length) {
	// 				let woIdArray: Array<any> = [];
	// 				for (let order of thdOrderArray) {
	// 					woIdArray.push({ ordersNo: order.sourceId });
	// 				}
	// 				let nextWoId = woIdArray[0].ordersNo;
	// 				woIdArray.shift()
	// 				greeDetailData.pageIndex = cmdSign.pageIndex;
	// 				if (cmdSign.source.length < cmdSign.pageSize) {
	// 					greeDetailData.isEnd = true;
	// 				}
	// 				greeDetailData.woIdList = woIdArray;
	// 				this.saveDataByCode(Constants.FACTORY_GREE_DETAIL, greeDetailData)//设置可爬取的工单id
	// 				location.href = `/hjzx/assign/doLookupAssign.action?pgid=${nextWoId}&p=6`;
	// 			}

	// 		})
	// 		Scheduler.exe(cmd);
	// 	}
	// }

	dateTime2str(dateTime, format) {
		var z = {
			y: dateTime.getFullYear(),
			M: dateTime.getMonth() + 1,
			d: dateTime.getDate(),
			h: dateTime.getHours(),
			m: dateTime.getMinutes(),
			s: dateTime.getSeconds()
		};
		return format.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
			return ((v.length > 1 ? '0' : '') + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
	});
}

/**
 * 爬取订单信息
 */
processOrderInfo(): Array < OrdersModel > {
	//console.log("processOrderInfo");
	let info = document.getElementById('app').innerHTML.toString();
	let doc = new dom().parseFromString(info);
	let node = xpath.select("//div[contains(@class,'index_tableRow__tpbkM')]", doc);
	let array =[];
	if(node.length) {
	let length = node.length;
	for (let i = 0; i < length; i++) {
		array.push(node.slice(i, i + 1));
	}
}
let orderList: Array<OrdersModel> = [];
for (let i = 0; i < array.length; i++) {
	array[i].forEach((e, index) => {
		let order = new OrdersModel();
		let header = new dom().parseFromString(e.toString());

		//订单号
		let ordersNo: string = xpath.select("//div[contains(@class,'index_RowHeader__3h8Cz')]//span//div[contains(text(),'订单号')]", header)[0].firstChild.data;
		let req = new RegExp(/[0-9]*$/);
		ordersNo = req.exec(ordersNo)[0];
		// console.log("num==>"+num);
		// ordersNo = ordersNo.replace(req,"$2");

		//下单时间
		let orderTime: string = xpath.select("//div[contains(@class,'index_RowHeader__3h8Cz')]//span[contains(text(),'下单时间')]", header)[0].firstChild.data;
		// let date = new Date(Date.parse(orderTime));

		//订单状态
		let orderStatus = xpath.select("//div[@class='index_cell__35tuI'][3]/div[1]", header)[1].firstChild.data;


		//商品名称
		// let goodsName = xpath.select("//div[contains(@class,'style_name__3ChB9')]/div[starts-with(@class,'index_ellipsis__29MP5')]", header)[0].firstChild.data;


		let customerInfo = xpath.select("//span[starts-with(@class,'index_infoItem')]", header);
		//用户姓名
		if (customerInfo[0] && customerInfo[0].firstChild && customerInfo[0].firstChild.data) {
			order.customerName = customerInfo[0].firstChild.data
		}
		//用户手机
		if (customerInfo[1] && customerInfo[1].firstChild && customerInfo[1].firstChild.data) {
			order.mobile = customerInfo[1].firstChild.data+"\t"
		}
		//用户地址
		if (customerInfo[2] && customerInfo[2].firstChild && customerInfo[2].firstChild.data) {
			order.address = customerInfo[2].firstChild.data
		}


		// console.log("customerInfo==>"+customerInfo);

		order.orderStatus = orderStatus;
		order.ordersNo = ordersNo.substring(5, ordersNo.length)+"\t";
		order.createdTime = this.dateTime2str(new Date(orderTime.substring(5, orderTime.length)),"yyyy-MM-dd hh:mm:ss")+"\t";
		// console.log("order.createTime==>"+order.createdTime);
		// if(customerInfo){
		// 	let customerInfoArray = customerInfo.split(", ");
		// 	if(customerInfoArray[0]){
		// 		order.customerName = customerInfoArray[0]
		// 	}
		// 	if(customerInfoArray[1]){
		// 		order.mobile = customerInfoArray[1];
		// 	}
		// 	if(customerInfoArray[2]){
		// 		order.address = customerInfoArray[2];
		// 	}
		// }
		// console.log(JSON.stringify(order));
		orderList.push(order);

		// console.log("orderTime==>" + orderTime);
		// console.log("goodsName==>" + goodsName);
		// console.log("customerInfo==>" + customerInfo);


	});
}
return orderList;
	}

processMsg(request: EventMsgModel): any {
	// if (request.action == MsgActionCode.CONTENT_RELOAD) {
	// 	location.reload();
	// } else if (request.action == MsgActionCode.CLEAR_CACHE) {
	// 	localStorage.removeItem(Constants.FACTORY_GREE);
	// }
	$('.index_actions__2MKuV a').on('click', function () {

	})

	let orderList: Array<OrdersModel> = [];
	let children = $('.index_actions__2MKuV a span');
	let that = this;
	// console.log("children.length==>"+children.length);
	if (children.length != 0) {
		children.each(function (e, index) {
			$(this).on("click", function () {

				if (e == children.length - 1) {
					orderList = that.processOrderInfo();
				}


			})
			$(this).trigger("click");

		})
	} else {
		orderList = this.processOrderInfo();
	}


	return orderList;
	// let children = $('.index_actions__2MKuV').children('a')
	// .each(function (index) {
	// 	console.log("index==>"+index);
	// 	let a=$(this);
	// 	a.click();
	// 	console.log(a);

	// })
	// .click(e=>{
	// 	console.log("click");
	// });

	// for(let i=0;i<children.length;i++){
	// 	children[i].click();
	// }

	// if(!handVerify){
	// 	alert("请先手动验证地址！");

	// }






	// greeCrawler.crawl();
}
}

let greeCrawler = new GreeCrawler();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = greeCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	console.log("docum");
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = greeCrawler.getCrawlerCode();

	let info = $(document).val();
	// console.log(info);
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		// if (response.running) {
		greeCrawler.crawl();
		// }
	});

});
