import { BaseCrawler } from "./base.crawler";
import { EventMsgModel,  MideaMaintainOrderModel } from "../core/models/index";
import { Constants, MsgActionCode, ReqCode, RespCode } from "../core/code";
import * as $ from 'jquery';
import { Scheduler } from "../core/services";
import { MideaMaintainOrderPostCmd } from "../core/cmd/index";


class MideaMaintainOrderCrawker extends BaseCrawler {
	crawl() {
		console.log("start---");
		let href = location.href;
		if (href != "https://cs.midea.com/c-css/render/preView/988380ff-e96c-4cdb-a7f") {
			window.location.href = "https://cs.midea.com/c-css/render/preView/988380ff-e96c-4cdb-a7f"
		}

		/***维修工单 */
		$(document).ready(function () {
			//增加爬取按钮
			$(".datagrid-toolbar table tbody tr td:first").before("<a id='crawlOrder' class='l-btn l-btn-small l-btn-plain'  plain='true' ><span class='l-btn-left'><span class='l-btn-text' style='color:red'>爬取</span></span></a>");
			//监听按钮点击
			$("#crawlOrder").click(function () {
				//判断是否选中工单
				if (typeof ($(".datagrid-row-checked").html()) == 'undefined') {
					alert("请选择工单爬取");
				} else {
					$(".datagrid-row-checked:eq(1)").each((trIndex: number, tr: any) => {
						let meidiOrder: MideaMaintainOrderModel = new MideaMaintainOrderModel();
						meidiOrder.productname = $(tr).find("td[field='product_model']").text();
						meidiOrder.clientname = $(tr).find("td[field='scene_customer_name']").text();
						meidiOrder.phone = $(tr).find("td[field='scene_customer_tel1']").text();
						meidiOrder.address = $(tr).find("td[field='scene_customer_address']").text();
						meidiOrder.servicetime = $(tr).find("td[field='renovate_time']").text();
						meidiOrder.createtime = $(tr).find("td[field='pub_create_date']").text();
						let warrantyType: string = $(tr).find("td[field='warranty_type_code']").text();
						if (warrantyType == "包内") {
							meidiOrder.underwarranty = 1;
						} else if (warrantyType == "包外") {
							meidiOrder.underwarranty = 0;
						}
						/***提交 */
						let mideaMaintainOrderCmd: MideaMaintainOrderPostCmd = new MideaMaintainOrderPostCmd(meidiOrder,ReqCode.MIDEA_ORDER_MAINTAIN);
						mideaMaintainOrderCmd.setAfterRespDo((data: any) => {
							if (data.respCode == RespCode.SUCCESS) {
								alert("爬取成功");
							} else {
								alert(data.msg);
							}
						});
						Scheduler.exe(mideaMaintainOrderCmd);
						console.log(meidiOrder);
					})
				}

			})
		})

	}

	getCrawlerCode(): string {
		return Constants.FACTORY_MIDEA_MAINTAIN_ORDER;
	}

	processMsg(request: EventMsgModel): any {
		if (request.action == MsgActionCode.CONTENT_RELOAD) {
			location.reload();
		} else if (request.action == MsgActionCode.CLEAR_CACHE) {
			localStorage.removeItem(Constants.FACTORY_MIDEA_MAINTAIN_ORDER);
		}
	}
}

let mideaMaintainOrderCrawler = new MideaMaintainOrderCrawker();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = mideaMaintainOrderCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = mideaMaintainOrderCrawler.getCrawlerCode();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		if (response.running) {
			mideaMaintainOrderCrawler.crawl();
		}
	});

});
