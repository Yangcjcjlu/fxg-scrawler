import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel } from '../core/models'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, BizType } from '../core/code'
import { Scheduler } from '../core/services'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeSettlementPostCmd, WoGreeSettlementsPostCmd } from '../core/cmd'
import * as $ from 'jquery';
import { ScFactoryGetCmd } from '../core/cmd/sc';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { WoGreeSettlementModel } from '../core/models'

class GreeInstallSettlementsCrawler extends BaseCrawler {

    getCrawlerCode(): string {
        return Constants.FACTORY_GREE_INSTALL_SETTLEMENTS;
    }

    crawl() {
        let pathname = location.pathname;
        if (pathname == '/hjzx/az/azdSp_doListAzd' && this.getQueryString("azorjs") == "az") {
            this.categorySelect();
        }
        else if (pathname == '/hjzx/az/azdSp_doListAzd' && this.getQueryString("azorjs") != "az") {
            this.crawlList();
        }
        else if (pathname == '/hjzx/az/azdSp_doDetailAzd.action') {
            this.crawSettlement();
        }
    }



    categorySelect() {
        if (JSON.stringify(this.getDataByCode("AZ101")) == "{}" && JSON.stringify(this.getDataByCode("AZ102")) == "{}") {
            $("#category").val("101");
            $("#search")[0].click();
            this.saveDataByCode("AZ_STATUS", true);
        }
    }
    categorySelectOther() {
        $("#category").val("102");
        $("#search")[0].click();
        setTimeout(() => {
            this.saveDataByCode("AZ_STATUS", true);
        }, 2000);
    }

    crawlList() {
        if (this.elementValueBySelector("#category option:selected") == "101" && JSON.stringify(this.getDataByCode("AZ_STATUS")) != "{}") {
            if (this.getDataByCode("AZ101") && this.getDataByCode("AZ101").length) {
                let urlList = this.getDataByCode("AZ101");
                let target = urlList.pop();
                this.saveDataByCode("AZ101", urlList);
                this.delDataByCode("AZ_STATUS");
                window.open("http://pgxt.gree.com:7909" + target);
            }
            else if (this.getDataByCode("AZ101") && JSON.stringify(this.getDataByCode("AZ101")) != "{}") {
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
                this.saveDataByCode("AZ101", urlList);
                this.delDataByCode("AZ_STATUS");
                window.open("http://pgxt.gree.com:7909" + target);
            }
        }
        if (this.elementValueBySelector("#category option:selected") == "102" && JSON.stringify(this.getDataByCode("AZ_STATUS")) != "{}") {
            if (this.getDataByCode("AZ102") && this.getDataByCode("AZ102").length) {
                let urlList = this.getDataByCode("AZ102");
                let target = urlList.pop();
                this.saveDataByCode("AZ102", urlList);
                this.delDataByCode("AZ_STATUS");
                window.open("http://pgxt.gree.com:7909" + target);
            }
            else if (this.getDataByCode("AZ102") && JSON.stringify(this.getDataByCode("AZ102")) != "{}") {
                this.delDataByCode("AZ101");
                this.delDataByCode("AZ102");
                this.delDataByCode("AZ_STATUS");
                // let eventMsg = new EventMsgModel('content', 'bg');
                // eventMsg.action = MsgActionCode.CLOSE_TAB;
                // eventMsg.data = greeInstallSettlementsCrawler.getCrawlerCode();
                // chrome.runtime.sendMessage(eventMsg, function (response) {
                //     localStorage.setItem("sessionToken", response.sessionToken);
                // });
                location.href = "/hjzx/az/doListLcLsAz?cd=dpg&otype=az&xsorsh=1";

            }
            else {
                if($("#assignlist tbody:first tr").eq(1).find("td:eq(7)").text().trim().replace(/[\r\n]/g, "")=="【S1800436】浙江盛世欣兴格力贸易有限公司")
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
                    this.saveDataByCode("AZ102", urlList);
                    this.delDataByCode("AZ_STATUS");
                    window.open("http://pgxt.gree.com:7909" + target);
                }
                
            }
        }
        setTimeout(() => {
            this.crawlList()
        }, 1000);


    }
    crawSettlement() {
        let model = this.getDataByCode("AZ_SETTLEMENT_LIST") || {}
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
        this.saveDataByCode("AZ_SETTLEMENT_LIST", model);
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
            this.delDataByCode("AZ_SETTLEMENT_LIST");
            this.saveDataByCode("AZ_STATUS", true);
            let eventMsg = new EventMsgModel('content', 'bg');
            eventMsg.action = MsgActionCode.CLOSE_TAB;
            eventMsg.data = greeInstallSettlementsCrawler.getCrawlerCode();
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

let greeInstallSettlementsCrawler = new GreeInstallSettlementsCrawler();

chrome.runtime.onMessage.addListener(
    function (request: EventMsgModel, sender, sendResponse) {
        if (request.target == 'content') {
            let result = greeInstallSettlementsCrawler.processMsg(request);
            if (result) {
                sendResponse(result);
            }
        }
    });

$(document).ready(() => {
    let eventMsg = new EventMsgModel('content', 'bg');
    eventMsg.action = MsgActionCode.CRAWLER_STATUS;
    eventMsg.data = greeInstallSettlementsCrawler.getCrawlerCode();
    chrome.runtime.sendMessage(eventMsg, function (response) {
        localStorage.setItem("sessionToken", response.sessionToken);
        if (response.running) {
            greeInstallSettlementsCrawler.crawl();
        }
    });


});
