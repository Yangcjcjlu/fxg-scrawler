import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel } from '../core/models'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode } from '../core/code'
import { Scheduler } from '../core/services'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeSettlementPostCmd, WoGreePatchCmd } from '../core/cmd'
import * as $ from 'jquery';
import { ScFactoryGetCmd } from '../core/cmd/sc';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { WoGreeSettlementModel } from '../core/models'

class GreeFeedbackCrawler extends BaseCrawler {

    getCrawlerCode(): string {
        return Constants.FACTORY_GREE_FEEDBACK;
    }

    crawl() {
        let pathname = location.pathname;
        if (pathname == '/hjzx/assign/doListAssign' && this.getQueryString("p") == "3") {
            this.crawlList();
        }

    }



    crawlList() {
        //是否在爬取列表
        let greeData = this.getData();
        if (greeData.crawlPage) {
            let currentPage: any = <number>$("#paged").val();//当前页数
            if (currentPage != greeData.crawlPage) {
                location.href = `/hjzx/assign/doListAssign?p=3&paged=${greeData.crawlPage}`;
                return;
            }
            //设置基础信息
            let woIdMap = greeData.woIdMap || {};
            let woIdArr = JSON.parse(localStorage.getItem("GREE_FEEDBACK_LIST")) || [];
            let canCraw: boolean = true;
            //获取本页所有工单号
            $("#assignlist tbody:first tr").each((trIndex: number, tr: any) => {
                let woId: string = $(tr).find("td:eq(1)").text().trim().replace(/[\r\n]/g, "");
                if (woId != "") {//如果发现本页有比maxId小的工单，则结束抓取
                    woIdMap[woId] = true;
                    let model: any = {
                        id: woId,
                    }
                    woIdArr.push(model)
                }
            })
            localStorage.setItem("GREE_FEEDBACK_LIST", JSON.stringify(woIdArr));
            if (canCraw && $("#assignlist img[title='后一页']").length) {//可抓取并且还有下一页
                let nextPage: number = (parseInt(currentPage) + 1);
                greeData.woIdMap = woIdMap;
                greeData.crawlPage = nextPage;
                localStorage.setItem(Constants.FACTORY_GREE_FEEDBACK, JSON.stringify(greeData));
                location.href = `/hjzx/assign/doListAssign?p=3&paged=${nextPage}`;
            } else {
                //处理已经爬到的工单
                let wcWoArray: Array<WoGreeModel> = [];
                let woIdArr = JSON.parse(localStorage.getItem("GREE_FEEDBACK_LIST"));
                for (let woId of woIdArr) {
                    let model: WoGreeModel = new WoGreeModel();
                    model.orderNo = woId.id
                    wcWoArray.push(model);
                }
                let cmd = new WoGreePatchCmd(wcWoArray);
                cmd.setAfterRespDo((cmdSign) => {
                    localStorage.removeItem(Constants.FACTORY_GREE_FEEDBACK);
                    localStorage.removeItem("GREE_FEEDBACK_LIST");
                })
                Scheduler.exe(cmd);
            }
        } else {
            greeData.crawlPage = 1;
            localStorage.setItem(Constants.FACTORY_GREE_FEEDBACK, JSON.stringify(greeData));
            location.href = "/hjzx/assign/doListAssign?p=3";
        }
    }


    processMsg(request: EventMsgModel): any {
        if (request.action == MsgActionCode.CONTENT_RELOAD) {
            location.reload();
        } else if (request.action == MsgActionCode.CLEAR_CACHE) {
            localStorage.removeItem(Constants.FACTORY_GREE_SETTLEMENT);
        }
    }
}

let greeFeedbackCrawler = new GreeFeedbackCrawler();

chrome.runtime.onMessage.addListener(
    function (request: EventMsgModel, sender, sendResponse) {
        if (request.target == 'content') {
            let result = greeFeedbackCrawler.processMsg(request);
            if (result) {
                sendResponse(result);
            }
        }
    });

$(document).ready(() => {
    let eventMsg = new EventMsgModel('content', 'bg');
    eventMsg.action = MsgActionCode.CRAWLER_STATUS;
    eventMsg.data = greeFeedbackCrawler.getCrawlerCode();
    chrome.runtime.sendMessage(eventMsg, function (response) {
        localStorage.setItem("sessionToken", response.sessionToken);
        if (response.running) {
            greeFeedbackCrawler.crawl();
        }
    });


});
