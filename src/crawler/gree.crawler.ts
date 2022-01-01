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
	}

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
		console.log(JSON.stringify(order));
		orderList.push(order);

		// console.log("orderTime==>" + orderTime);
		// console.log("goodsName==>" + goodsName);
		// console.log("customerInfo==>" + customerInfo);


	});
}
return orderList;
	}

processMsg(request: EventMsgModel): any {
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
}
}

let greeCrawler = new GreeCrawler();



chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = greeCrawler.processMsg(request);
			console.log("result==>"+JSON.stringify(result));
			if (result) {
				sendResponse(result);
			}
		}else{
			sendResponse([]);
		}
	});

$(document).ready(() => {
	console.log("docum");
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = greeCrawler.getCrawlerCode();

	let info = $(document).val();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		// if (response.running) {
		greeCrawler.crawl();
	});

});
