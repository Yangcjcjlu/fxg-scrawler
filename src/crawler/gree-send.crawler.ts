import * as $ from 'jquery'
import { WoGreeSendPostCmd } from '../core/cmd/index'
import { Constants, MsgActionCode } from '../core/code/index'
import { EventMsgModel, WoGreeModel } from '../core/models/index'
import { Scheduler } from '../core/services/index'
import { BaseCrawler } from './base.crawler'

class GreeSendCrawler extends BaseCrawler {

    getCrawlerCode(): string {
        return Constants.FACTORY_GREE_SEND;
    }

    crawl() {
        let pathname = location.pathname;
        if (pathname == '/hjzx/assign/doListAssign' && this.getQueryString("p")=="2") {
            this.crawlList();
        }
        
    }


    crawlList() {
        let model = this.getDataByCode("WX_SEND_LIST") || {}
        $("#tbody:first tr").each((trIndex: number, tr: any) => {
            let woId: string = $(tr).find("td:eq(3)").text().trim().replace(/[\r\n]/g, "");
            model[woId] = true;
        })
        this.saveDataByCode("WX_SEND_LIST", model);
        let array: Array<WoGreeModel> = [];
        Object.keys(model).forEach(function (key) {
            let item: WoGreeModel = new WoGreeModel();
            item.orderNo = key;
            array.push(item);
        });
        let cmd: WoGreeSendPostCmd = new WoGreeSendPostCmd(array);
        cmd.setAfterRespDo((data: any) => {
            this.delDataByCode("WX_SEND_LIST");
            // let eventMsg = new EventMsgModel('content', 'bg');
            // eventMsg.action = MsgActionCode.CLOSE_TAB;
            // eventMsg.data = greeSendCrawler.getCrawlerCode();
            // chrome.runtime.sendMessage(eventMsg, function (response) {
            //     localStorage.setItem("sessionToken", response.sessionToken);
            // });
            location.href = "/hjzx/az/doListLcLsAz?otype=az&xsorsh=1&cd=pgcx";
        })
        Scheduler.exe(cmd);
        
    }
    


    processMsg(request: EventMsgModel): any {
        if (request.action == MsgActionCode.CONTENT_RELOAD) {
            location.reload();
        } else if (request.action == MsgActionCode.CLEAR_CACHE) {
            localStorage.removeItem(Constants.FACTORY_GREE_SEND);
        }
    }
}

let greeSendCrawler = new GreeSendCrawler();

chrome.runtime.onMessage.addListener(
    function (request: EventMsgModel, sender, sendResponse) {
        if (request.target == 'content') {
            let result = greeSendCrawler.processMsg(request);
            if (result) {
                sendResponse(result);
            }
        }
    });

$(document).ready(() => {
    console.log("load");
    let eventMsg = new EventMsgModel('content', 'bg');
    eventMsg.action = MsgActionCode.CRAWLER_STATUS;
    eventMsg.data = greeSendCrawler.getCrawlerCode();
    chrome.runtime.sendMessage(eventMsg, function (response) {
        localStorage.setItem("sessionToken", response.sessionToken);
        if (response.running) {
            greeSendCrawler.crawl();
        }
    });


});
