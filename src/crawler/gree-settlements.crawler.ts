import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel } from '../core/models'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, BizType } from '../core/code'
import { Scheduler } from '../core/services'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeSettlementPostCmd, WoGreeSettlementsPostCmd } from '../core/cmd'
import * as $ from 'jquery';
import { ScFactoryGetCmd } from '../core/cmd/sc';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { WoGreeSettlementModel } from '../core/models'

class GreeSettlementsCrawler extends BaseCrawler {

    getCrawlerCode(): string {
        return Constants.FACTORY_GREE_SETTLEMENTS;
    }

    crawl() {
        let pathname = location.pathname;
        if (pathname == '/hjzx/az/azdSp_doListWxd' && this.getQueryString("wxorjs") == "wx") {
            this.categorySelect();
        }
        else if (pathname == '/hjzx/az/azdSp_doListWxd' && this.getQueryString("wxorjs") != "wx") {
            this.crawlList();
        }
        else if (pathname == '/hjzx/az/azdSp_doDetailWxd.action') {
            this.crawSettlement();
        }
    }



    categorySelect() {
        if (JSON.stringify(this.getDataByCode("WX101")) == "{}" && JSON.stringify(this.getDataByCode("WX102")) == "{}") {
            $("#category").val("101");
            $("#search")[0].click();
            this.saveDataByCode("WX_STATUS", true);
        }
    }
    categorySelectOther() {
        $("#category").val("102");
        $("#search")[0].click();
        setTimeout(() => {
            this.saveDataByCode("WX_STATUS", true);
        }, 2000);
    }

    crawlList() {
        if (this.elementValueBySelector("#category option:selected") == "101" && JSON.stringify(this.getDataByCode("WX_STATUS")) != "{}") {
            if (this.getDataByCode("WX101") && this.getDataByCode("WX101").length) {
                let urlList = this.getDataByCode("WX101");
                let target = urlList.pop();
                this.saveDataByCode("WX101", urlList);
                this.delDataByCode("WX_STATUS");
                window.open("http://pgxt.gree.com:7909" + target);
            }
            else if (this.getDataByCode("WX101") && JSON.stringify(this.getDataByCode("WX101")) != "{}") {
                this.categorySelectOther();
            }
            else {
                let urlList = [];
                $("#assignlist tbody:first tr").each((trIndex: number, tr: any) => {
                    if (trIndex != 0) {
                        let url: string = $(tr).find("td:eq(0)").find("a:eq(0)").attr("href");
                        urlList.push(url);
                    }
                })
                urlList.pop();
                urlList = urlList.slice(-5);
                let target = urlList.pop();
                this.saveDataByCode("WX101", urlList);
                this.delDataByCode("WX_STATUS");
                window.open("http://pgxt.gree.com:7909" + target);
            }
        }
        if (this.elementValueBySelector("#category option:selected") == "102" && JSON.stringify(this.getDataByCode("WX_STATUS")) != "{}") {
            if (this.getDataByCode("WX102") && this.getDataByCode("WX102").length) {
                let urlList = this.getDataByCode("WX102");
                let target = urlList.pop();
                this.saveDataByCode("WX102", urlList);
                this.delDataByCode("WX_STATUS");
                window.open("http://pgxt.gree.com:7909" + target);
            }
            else if (this.getDataByCode("WX102") && JSON.stringify(this.getDataByCode("WX102")) != "{}") {
                this.delDataByCode("WX101");
                this.delDataByCode("WX102");
                this.delDataByCode("WX_STATUS");
                // let eventMsg = new EventMsgModel('content', 'bg');
                // eventMsg.action = MsgActionCode.CLOSE_TAB;
                // eventMsg.data = greeSettlementsCrawler.getCrawlerCode();
                // chrome.runtime.sendMessage(eventMsg, function (response) {
                //     localStorage.setItem("sessionToken", response.sessionToken);
                // });
                location.href = "/hjzx/assign/doListAssign?p=2";
            }
            else {
                if($("#assignlist tbody:first tr").eq(1).find("td:eq(0)").find("a:eq(0)").attr("href")=="/hjzx/az/azdSp_doDetailWxd.action?jsguid=50D71329A5777A75E053140C020A1678&wdph=S18000330001&spid=102&wxorjs=wx")
                {
                    let urlList = [];
                    $("#assignlist tbody:first tr").each((trIndex: number, tr: any) => {
                        if (trIndex != 0) {
                            let url: string = $(tr).find("td:eq(0)").find("a:eq(0)").attr("href");
                            urlList.push(url);
                        }
                    })
                    urlList.pop();
                    urlList = urlList.slice(-5);
                    let target = urlList.pop();
                    this.saveDataByCode("WX102", urlList);
                    this.delDataByCode("WX_STATUS");
                    window.open("http://pgxt.gree.com:7909" + target);
                }
            }
        }
        setTimeout(() => {
            this.crawlList()
        }, 1000);


    }
    crawSettlement() {
        let model = this.getDataByCode("WX_SETTLEMENT_LIST") || {}
        $("#tab2 tbody:first tr").each((trIndex: number, tr: any) => {
            if (trIndex != 0) {
                let price: number = parseInt($(tr).find("td:eq(4)").text().trim().replace(/[\r\n]/g, ""));
                let orderNo: string = $(tr).find("td:eq(7)").text().trim().replace(/[\r\n]/g, "")
                if (model[orderNo]) {
                    model[orderNo] = parseInt(model[orderNo]) + price;
                }
                else {
                    model[orderNo] = price
                }
            }
        })
        this.saveDataByCode("WX_SETTLEMENT_LIST", model);
        let array: Array<WoGreeSettlementModel> = [];
        Object.keys(model).forEach(function (key) {
            let item: WoGreeSettlementModel = new WoGreeSettlementModel();
            item.orderNo = key;
            item.payableAmount = model[key];
            item.orderAmount = model[key];
            array.push(item);
        });
        let cmd: WoGreeSettlementsPostCmd = new WoGreeSettlementsPostCmd(array);
        cmd.setAfterRespDo((data: any) => {
            this.delDataByCode("WX_SETTLEMENT_LIST");
            this.saveDataByCode("WX_STATUS", true);
            let eventMsg = new EventMsgModel('content', 'bg');
            eventMsg.action = MsgActionCode.CLOSE_TAB;
            eventMsg.data = greeSettlementsCrawler.getCrawlerCode();
            chrome.runtime.sendMessage(eventMsg, function (response) {
                localStorage.setItem("sessionToken", response.sessionToken);
            });
        })
        Scheduler.exe(cmd);
    }

    processMsg(request: EventMsgModel): any {
        if (request.action == MsgActionCode.CONTENT_RELOAD) {
            location.reload();
        } else if (request.action == MsgActionCode.CLEAR_CACHE) {
            localStorage.removeItem(Constants.FACTORY_GREE_INSTALL_SETTLEMENTS);
        }
    }
}

let greeSettlementsCrawler = new GreeSettlementsCrawler();

chrome.runtime.onMessage.addListener(
    function (request: EventMsgModel, sender, sendResponse) {
        if (request.target == 'content') {
            let result = greeSettlementsCrawler.processMsg(request);
            if (result) {
                sendResponse(result);
            }
        }
    });

$(document).ready(() => {
    let eventMsg = new EventMsgModel('content', 'bg');
    eventMsg.action = MsgActionCode.CRAWLER_STATUS;
    eventMsg.data = greeSettlementsCrawler.getCrawlerCode();
    chrome.runtime.sendMessage(eventMsg, function (response) {
        localStorage.setItem("sessionToken", response.sessionToken);
        if (response.running) {
            greeSettlementsCrawler.crawl();
        }
    });
});
