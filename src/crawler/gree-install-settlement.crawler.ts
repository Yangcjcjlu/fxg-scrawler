import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, WcWorkOrderModel, WoGreeModel, WoGreeItemModel, WoGreeUserModel } from '../core/models'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, BizType } from '../core/code'
import { Scheduler } from '../core/services'
import { WcWorkOrderPostCmd, WcWorkOrderListCmd, WoGreeSettlementPostCmd } from '../core/cmd'
import * as $ from 'jquery';
import { ScFactoryGetCmd } from '../core/cmd/sc';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { WoGreeSettlementModel } from '../core/models'

class GreeInstallSettlementCrawler extends BaseCrawler {

    getCrawlerCode(): string {
        return Constants.FACTORY_GREE_INSTALL_SETTLEMENT;
    }

    crawl() {
        // let pathname = location.pathname;
        // if (pathname == '/hjzx/az/doListAztojs' && !localStorage.getItem("IS_INSTALL_SETTLEMENT")) {
        //     this.categorySelect();
        // }
        // else if (pathname == '/hjzx/az/doListAztojs' && localStorage.getItem("IS_INSTALL_SETTLEMENT")) {
        //     this.crawlList();
        // }
        // else if (pathname == '/hjzx/az/doUpdateAztojs') {
        //     this.crawSettlement();
        // }
    }



    categorySelect() {
        let greeSettlement = this.getData();
        if (!greeSettlement) {
            let cmd = new WcWorkOrderListCmd(Constants.FACTORY_GREE, ReqCode.WO_LIST_CAN_SETTLEMENT, 1, BizType.INSTALL);
            cmd.setAfterRespDo((cmdSign) => {
                let thdOrderArray: Array<WcWorkOrderModel> = cmdSign.source;
                let woIdArray: Array<any> = [];
                if (thdOrderArray.length) {
                    for (let order of thdOrderArray) {
                        woIdArray.push({ id: order.sourceId, mobile: order.mobile });
                    }
                    greeSettlement.pageIndex = cmdSign.pageIndex;
                    if (cmdSign.source.length < cmdSign.pageSize) {
                        greeSettlement.isEnd = true;
                    }
                    greeSettlement.woIdList = woIdArray;
                    localStorage.setItem(Constants.FACTORY_GREE_INSTALL_SETTLEMENT, JSON.stringify(greeSettlement));//设置可爬取的工单id
                    this.categorySelect();
                }

            })
            Scheduler.exe(cmd);
        }
        else {
            let array = greeSettlement.woIdList
            if (array && array.length) {
                $("#category").val("jykt");
                $("#Aztojs_s_azWgmx_s_yddh").val(array[0].mobile);
                $("#search")[0].click();
                localStorage.setItem("IS_INSTALL_SETTLEMENT", "true")
            }
            else {
                let cmd = new WcWorkOrderListCmd(Constants.FACTORY_GREE, ReqCode.WO_LIST_CAN_SETTLEMENT, greeSettlement.pageIndex + 1, BizType.INSTALL);
                cmd.setAfterRespDo((cmdSign) => {
                    let thdOrderArray: Array<WcWorkOrderModel> = cmdSign.source;
                    if (thdOrderArray.length) {
                        let woIdArray: Array<any> = [];
                        for (let order of thdOrderArray) {
                            woIdArray.push({ id: order.sourceId, mobile: order.mobile });
                        }
                        greeSettlement.pageIndex = cmdSign.pageIndex;
                        if (cmdSign.source.length < cmdSign.pageSize) {
                            greeSettlement.isEnd = true;
                        }
                        greeSettlement.woIdList = woIdArray;
                        localStorage.setItem(Constants.FACTORY_GREE_INSTALL_SETTLEMENT, JSON.stringify(greeSettlement));//设置可爬取的工单id
                        this.categorySelect();
                    }
                    else {
                        localStorage.removeItem(Constants.FACTORY_GREE_INSTALL_SETTLEMENT);
                        localStorage.removeItem("IS_INSTALL_SETTLEMENT");
                        let settlementEventMsg = new EventMsgModel('popup', 'bg');
                        settlementEventMsg.action = MsgActionCode.STOP_CRAWLER;
                        settlementEventMsg.data = Constants.FACTORY_GREE_INSTALL_SETTLEMENT;
                        chrome.runtime.sendMessage(settlementEventMsg, (response) => {
                        });
                        let eventMsg = new EventMsgModel('content', 'bg');
                        eventMsg.action = MsgActionCode.CLOSE_TAB;
                        eventMsg.data = greeInstallSettlementCrawler.getCrawlerCode();
                        chrome.runtime.sendMessage(eventMsg, function (response) {
                            localStorage.setItem("sessionToken", response.sessionToken);
                        });

                    }
                })
                Scheduler.exe(cmd);
            }
        }

    }

    crawlList() {
        let greeSettlement = this.getData();
        let array = greeSettlement.woIdList
        if ($("#tbody:first tr:eq(0) td").length == 1) {
            if (this.elementValueBySelector("#category option:selected") == "sykt") {
                array.shift();
                greeSettlement.woIdList = array;
                this.saveData(greeSettlement);
                this.categorySelect();
                return
            }
            else {
                $("#category").val("sykt");
                $("#search")[0].click();
                return
            }
        }
        let state = false;
        let num: number = parseInt(this.getDataByCode(array[0].id)) || 0;
        if (num) {
            state=true;
            $("#tbody:first tr").eq(num - 1).find("td:eq(1)").find("a")[0].click();
        }
        else {
            $("#tbody:first tr").each((trIndex: number, tr: any) => {
                let woId: string = $(tr).find("td:eq(9)").text().trim().replace(/[\r\n]/g, "");
                let mobile: any = $(tr).find("td:eq(8)").text().trim().replace(/[\r\n]/g, "");
                let status: any = $(tr).find("td:eq(4)").text().trim().replace(/[\r\n]/g, "");
                for (let i = 0; i < array.length; i++) {
                    if ((woId) == array[i].id) {
                        state = true;
                        num = num + 1;
                    }
                    if (num != 0) {
                        this.saveDataByCode(woId, num);
                    }
                }
            })
        }
        if (!state) {
            array.shift();
            greeSettlement.woIdList = array;
            this.saveData(greeSettlement);
        }
        localStorage.removeItem("IS_INSTALL_SETTLEMENT");
        setTimeout(() => {
            this.categorySelect();
        }, 1000);

    }
    crawSettlement() {
        let money: any = (this.elementValueBySelector("#jsfy"));
        let greeSettlement = this.getData();
        let array = greeSettlement.woIdList
        let model: WoGreeSettlementModel = new WoGreeSettlementModel();
        model.orderNo = array[0].id;
        model.orderAmount = money;
        model.payableAmount = money;
        let cmd: WoGreeSettlementPostCmd = new WoGreeSettlementPostCmd(model);
        cmd.setAfterRespDo((data: any) => {
            let num = parseInt(this.getDataByCode(array[0].id));
            num = num - 1;
            this.saveDataByCode(array[0].id, num)
            if (!num) {
                array.shift();
                this.delDataByCode(array[0].id);
            }
            greeSettlement.woIdList = array;
            this.saveData(greeSettlement)
            let eventMsg = new EventMsgModel('content', 'bg');
            eventMsg.action = MsgActionCode.CLOSE_TAB;
            eventMsg.data = greeInstallSettlementCrawler.getCrawlerCode();
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
            localStorage.removeItem(Constants.FACTORY_GREE_INSTALL_SETTLEMENT);
        }
    }
}

let greeInstallSettlementCrawler = new GreeInstallSettlementCrawler();

chrome.runtime.onMessage.addListener(
    function (request: EventMsgModel, sender, sendResponse) {
        if (request.target == 'content') {
            let result = greeInstallSettlementCrawler.processMsg(request);
            if (result) {
                sendResponse(result);
            }
        }
    });

$(document).ready(() => {
    let eventMsg = new EventMsgModel('content', 'bg');
    eventMsg.action = MsgActionCode.CRAWLER_STATUS;
    eventMsg.data = greeInstallSettlementCrawler.getCrawlerCode();
    chrome.runtime.sendMessage(eventMsg, function (response) {
        localStorage.setItem("sessionToken", response.sessionToken);
        if (response.running) {
            greeInstallSettlementCrawler.crawl();
        }
    });


});
