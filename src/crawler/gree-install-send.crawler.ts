import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel } from '../core/models/index'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, BizType } from '../core/code/index'
import { Scheduler } from '../core/services/index'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeSettlementPostCmd, WoGreeSendPostCmd } from '../core/cmd/index'
import * as $ from 'jquery';
import { ScFactoryGetCmd } from '../core/cmd/sc';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { WoGreeSettlementModel } from '../core/models/index'

class GreeInstallSendCrawler extends BaseCrawler {

    getCrawlerCode(): string {
        return Constants.FACTORY_GREE_INSTALL_SEND;
    }

    crawl() {
        let pathname = location.pathname;
        if (pathname == '/hjzx/az/doListLcLsAz' && this.getQueryString("cd") == "dpg" && this.getQueryString("otype") == "az" && this.getQueryString("xsorsh") == "1") {
            this.crawlList();
        }

    }



    crawlList() {
        let model = this.getDataByCode("AZ_SEND_LIST") || {}
        $("#tbody:first tr").each((trIndex: number, tr: any) => {
            let woId: string = $(tr).find("td:eq(4)").text().trim().replace(/[\r\n]/g, "");
            model[woId] = true;
        })
        this.saveDataByCode("AZ_SEND_LIST", model);
        let array: Array<WoGreeModel> = [];
        Object.keys(model).forEach(function (key) {
            let item: WoGreeModel = new WoGreeModel();
            item.orderNo = key;
            array.push(item);
        });
        let cmd: WoGreeSendPostCmd = new WoGreeSendPostCmd(array);
        cmd.setAfterRespDo((data: any) => {
            this.delDataByCode("AZ_SEND_LIST");
            // let eventMsg = new EventMsgModel('content', 'bg');
            // eventMsg.action = MsgActionCode.CLOSE_TAB;
            // eventMsg.data = greeInstallSendCrawler.getCrawlerCode();
            // chrome.runtime.sendMessage(eventMsg, function (response) {
            //     localStorage.setItem("sessionToken", response.sessionToken);
            // });
            setTimeout(() => {
                location.href = "/hjzx/assign/doListAssign?p=1";
            }, 10000);
        })
        Scheduler.exe(cmd);
    }



    processMsg(request: EventMsgModel): any {
        if (request.action == MsgActionCode.CONTENT_RELOAD) {
            location.reload();
        } else if (request.action == MsgActionCode.CLEAR_CACHE) {
            localStorage.removeItem(Constants.FACTORY_GREE_INSTALL_SEND);
        }
    }
}

let greeInstallSendCrawler = new GreeInstallSendCrawler();

chrome.runtime.onMessage.addListener(
    function (request: EventMsgModel, sender, sendResponse) {
        if (request.target == 'content') {
            let result = greeInstallSendCrawler.processMsg(request);
            if (result) {
                sendResponse(result);
            }
        }
    });

$(document).ready(() => {
    let eventMsg = new EventMsgModel('content', 'bg');
    eventMsg.action = MsgActionCode.CRAWLER_STATUS;
    eventMsg.data = greeInstallSendCrawler.getCrawlerCode();
    chrome.runtime.sendMessage(eventMsg, function (response) {
        localStorage.setItem("sessionToken", response.sessionToken);
        if (response.running) {
            greeInstallSendCrawler.crawl();
        }
    });


});
