import { BaseCrawler } from "./base.crawler";
import { EventMsgModel, MideaInstallOrderModel } from "../core/models/index";
import { Constants, MsgActionCode, ReqCode, RespCode } from "../core/code";
import * as $ from 'jquery';
import { MideaInstallOrderPostCmd } from "../core/cmd/index";
import { Scheduler } from "../core/services";


class MideaInstallOrderCrawker extends BaseCrawler {
	crawl() {
		console.log("start---");
		let href = location.href;
		if (href != "https://cs.midea.com/c-css/wom/archives/install/list_install_archives") {
			window.location.href = "https://cs.midea.com/c-css/wom/archives/install/list_install_archives"
		}

		/***安装工单 */
		$(document).ready(function () {
			//增加爬取按钮
			$("#listInstallArchivesAdd").before("<a id='crawlOrder' class='easyui-linkbutton l-btn l-btn-small l-btn-plain'  plain='true' ><span class='l-btn-left'><span class='l-btn-text' style='color:red'>爬取</span></span></a>");
			//监听按钮点击
			$("#crawlOrder").click(function () {
				//判断是否选中工单
				if (typeof ($(".datagrid-row-checked").html()) == 'undefined') {
					alert("请选择工单爬取");
				} else {
					$(".datagrid-row-checked:eq(1)").each((trIndex: number, tr: any) => {
						let meidiOrder: MideaInstallOrderModel = new MideaInstallOrderModel();
						meidiOrder.productname = $(tr).find("td[field='product_model']").text();
						meidiOrder.clientname = $(tr).find("td[field='scene_customer_name']").text();
						meidiOrder.phone = $(tr).find("td[field='scene_customer_tel1']").text();
						meidiOrder.address = $(tr).find("td[field='scene_customer_address']").text();
						meidiOrder.installtime = $(tr).find("td[field='install_date']").text();
						meidiOrder.createtime = $(tr).find("td[field='pub_create_date']").text();

						/***提交 */
						let mideaInstallOrderCmd: MideaInstallOrderPostCmd = new MideaInstallOrderPostCmd(meidiOrder,ReqCode.MIDEA_ORDER_INSTALL);
						mideaInstallOrderCmd.setAfterRespDo((data: any) => {
							if (data.respCode == RespCode.SUCCESS) {
								alert("爬取成功");
							} else {
								alert(data.msg);
							}
						});
						Scheduler.exe(mideaInstallOrderCmd);
						console.log(meidiOrder);
					})
				}

			})
		})

	}

	getCrawlerCode(): string {
		return Constants.FACTORY_MIDEA_INSTALL_ORDER;
	}

	processMsg(request: EventMsgModel): any {
		if (request.action == MsgActionCode.CONTENT_RELOAD) {
			location.reload();
		} else if (request.action == MsgActionCode.CLEAR_CACHE) {
			localStorage.removeItem(Constants.FACTORY_MIDEA_INSTALL_ORDER);
		}
	}
}

let mideaInstallOrderCrawler = new MideaInstallOrderCrawker();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = mideaInstallOrderCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = mideaInstallOrderCrawler.getCrawlerCode();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		if (response.running) {
			mideaInstallOrderCrawler.crawl();
		}
	});

});
