import * as React from "react";
import * as ReactDOM from "react-dom";
import { Constants, MainTypeCode, MsgActionCode } from "../../core/code";
import { EventMsgModel, WcFactoryModel } from '../../core/models';
import { ScFactoryModel } from "../../core/models/sc/sc-factory.model";
import './main.scss';

class MainComponent extends React.Component<any, any> {


    constructor(props: any, context: any) {
        super(props);
        this.state = {
            user: {
                name: ""
            },
            showSet: false,
            ordersList: [],
            crawlerOrderList: [],
            downLoadOrderList: [],
            factoryModel: null,
            typeCheck: MainTypeCode.HAS_CRAWLER
        }
    }

    /**
     * 调用chrome storage 存储数据
     * @param key 
     * @param data 
     */
    chromeLocalSetData(key1: string, data: any) {
        // console.log("key1==>" + key1);
        // console.log("data==>" + JSON.stringify(data));
        chrome.storage.local.set({ [key1]: data });
        // this.chromeLocalGetData(key1, fn => (data) => {
        //     console.log("data==>" + JSON.stringify(data));

        // });
    }

    /**
     * 调用chrome storage 获取数据
     * @param key 
     * @param fn 
     */
    chromeLocalGetData(key: string, fn: Function) {
        chrome.storage.local.get([key], fn.apply(this));
    }

    componentDidMount() {
        // let sessionToken = localStorage.getItem("sessionToken");

        // let ordersList = Daemon.getArray("crawlerOrderList");
        // this.setState({
        //     crawlerOrderList: ordersList
        // })
        // if (sessionToken) {
        // let cmd = new WcSessionGetCmd();
        // cmd.setAfterRespDo((sign: CmdSignModel) => {
        //     let user: ScUserModel = sign.source;
        //     this.setState({
        //         user: user
        //     })
        // })
        // Scheduler.exe(cmd);
        this.initCrawler();
        // }

        // let array = Daemon.getArray("crawlerOrderList");
        // console.log("crawlerOrderList==>");
        let that = this;
        this.chromeLocalGetData("crawlerOrderList", fn => (data) => {
            // console.log("data==>" + JSON.stringify(data));
            if (data.crawlerOrderList) {
                that.setState({
                    crawlerOrderList: data.crawlerOrderList
                })
            }
        })
        // chrome.storage.local.get(["crawlerOrderList"], function (data) {
        //     if (data.crawlerOrderList) {
        //         that.setState({
        //             crawlerOrderList: data.crawlerOrderList
        //         })
        //     }
        // })
        // console.log("array==>"+array);
        // if(array){
        //     array.forEach(e =>{
        //         console.log("item==>"+e);
        //     })
        // }

        let factoryModel = { running: false, wcFactoryVO: { name: 'gree' } };
        this.setState({
            factoryModel: factoryModel
        })
        // let eventMsg = new EventMsgModel('content', 'bg');
        // eventMsg.action = MsgActionCode.CRAWLER_STATUS;
        // eventMsg.data = Constants.FACTORY_GREE;
        // chrome.runtime.sendMessage(eventMsg, function (response) {
        //     localStorage.setItem("sessionToken", response.sessionToken);
        //     let factoryModel = this.state.factoryModel;
        //     if (response.running) {
        //         factoryModel.running = true
        //         this.setState({
        //             factoryModel: factoryModel
        //         });
        //     }
        //     else {
        //         factoryModel.running = true;
        //         this.setState({
        //             factoryModel: factoryModel
        //         });
        //     }
        // });
    }



    /**
     * 停用爬虫
     */
    stopCrawler() {
        this.state.factoryModel.running = false;
        this.setState({});

        let eventMsg = new EventMsgModel('popup', 'bg');
        eventMsg.action = MsgActionCode.STOP_CRAWLER;
        eventMsg.data = this.state.factoryModel.wcFactoryVO.code;
        chrome.runtime.sendMessage(eventMsg, (response) => {
            this.responseMsg(response)
        });

        let settlementEventMsg = new EventMsgModel('popup', 'bg');
        settlementEventMsg.action = MsgActionCode.STOP_CRAWLER;
        settlementEventMsg.data = Constants.FACTORY_GREE_SETTLEMENT;
        chrome.runtime.sendMessage(settlementEventMsg, (response) => {

        });
        let settlementsEventMsg = new EventMsgModel('popup', 'bg');
        settlementsEventMsg.action = MsgActionCode.STOP_CRAWLER;
        settlementsEventMsg.data = Constants.FACTORY_GREE_SETTLEMENTS;
        chrome.runtime.sendMessage(settlementsEventMsg, (response) => {

        });
        let detailEventMsg = new EventMsgModel('popup', 'bg');
        detailEventMsg.action = MsgActionCode.STOP_CRAWLER;
        detailEventMsg.data = Constants.FACTORY_GREE_DETAIL;
        chrome.runtime.sendMessage(detailEventMsg, (response) => {

        });
        let fittingEventMsg = new EventMsgModel('popup', 'bg');
        fittingEventMsg.action = MsgActionCode.STOP_CRAWLER;
        fittingEventMsg.data = Constants.FACTORY_GREE_FITTING;
        chrome.runtime.sendMessage(fittingEventMsg, (response) => {
            this.responseMsg(response)
        });
        let fittingModelEventMsg = new EventMsgModel('popup', 'bg');
        fittingModelEventMsg.action = MsgActionCode.STOP_CRAWLER;
        fittingModelEventMsg.data = Constants.FACTORY_GREE_FITTING_MODEL;
        chrome.runtime.sendMessage(fittingModelEventMsg, (response) => {
            this.responseMsg(response)
        });
        let selectEventMsg = new EventMsgModel('popup', 'bg');
        selectEventMsg.action = MsgActionCode.STOP_CRAWLER;
        selectEventMsg.data = Constants.FACTORY_GREE_ADDRESS;
        chrome.runtime.sendMessage(selectEventMsg, (response) => {
            this.responseMsg(response)
        });

        let feedbackEventMsg = new EventMsgModel('popup', 'bg');
        feedbackEventMsg.action = MsgActionCode.STOP_CRAWLER;
        feedbackEventMsg.data = Constants.FACTORY_GREE_FEEDBACK;
        chrome.runtime.sendMessage(feedbackEventMsg, (response) => {
            this.responseMsg(response)
        });

        let installEventMsg = new EventMsgModel('popup', 'bg');
        installEventMsg.action = MsgActionCode.STOP_CRAWLER;
        installEventMsg.data = Constants.FACTORY_GREE_INSTALL;
        chrome.runtime.sendMessage(installEventMsg, (response) => {
            this.responseMsg(response)
        });

        let installDetailEventMsg = new EventMsgModel('popup', 'bg');
        installDetailEventMsg.action = MsgActionCode.STOP_CRAWLER;
        installDetailEventMsg.data = Constants.FACTORY_GREE_INSTALL_DETAIL;
        chrome.runtime.sendMessage(installDetailEventMsg, (response) => {
            this.responseMsg(response)
        });

        let installSettlementEventMsg = new EventMsgModel('popup', 'bg');
        installSettlementEventMsg.action = MsgActionCode.STOP_CRAWLER;
        installSettlementEventMsg.data = Constants.FACTORY_GREE_INSTALL_SETTLEMENT;
        chrome.runtime.sendMessage(installSettlementEventMsg, (response) => {
            this.responseMsg(response)
        });

        let installSettlementsEventMsg = new EventMsgModel('popup', 'bg');
        installSettlementsEventMsg.action = MsgActionCode.STOP_CRAWLER;
        installSettlementsEventMsg.data = Constants.FACTORY_GREE_INSTALL_SETTLEMENTS;
        chrome.runtime.sendMessage(installSettlementsEventMsg, (response) => {
            this.responseMsg(response)
        });
        let sendEventMsg = new EventMsgModel('popup', 'bg');
        sendEventMsg.action = MsgActionCode.STOP_CRAWLER;
        sendEventMsg.data = Constants.FACTORY_GREE_SEND;
        chrome.runtime.sendMessage(sendEventMsg, (response) => {
        });

        let installSendEventMsg = new EventMsgModel('popup', 'bg');
        installSendEventMsg.action = MsgActionCode.STOP_CRAWLER;
        installSendEventMsg.data = Constants.FACTORY_GREE_INSTALL_SEND;
        chrome.runtime.sendMessage(installSendEventMsg, (response) => {
        });

        let mideaInstallOrderEventMsg = new EventMsgModel('popup', 'bg');
        mideaInstallOrderEventMsg.action = MsgActionCode.STOP_CRAWLER;
        mideaInstallOrderEventMsg.data = Constants.FACTORY_MIDEA_INSTALL_ORDER;
        chrome.runtime.sendMessage(mideaInstallOrderEventMsg, (response) => {
            this.responseMsg(response)
        });
        let mideaMaintainOrderEventMsg = new EventMsgModel('popup', 'bg');
        mideaMaintainOrderEventMsg.action = MsgActionCode.STOP_CRAWLER;
        mideaMaintainOrderEventMsg.data = Constants.FACTORY_MIDEA_MAINTAIN_ORDER;
        chrome.runtime.sendMessage(mideaMaintainOrderEventMsg, (response) => {
            this.responseMsg(response)
        });

    }

    /**
     * 启用爬虫
     */
    startCrawler() {
        this.state.factoryModel.running = true;
        this.setState({});

        /***格力*/
        // let eventMsg = new EventMsgModel('popup', 'bg');
        // eventMsg.action = MsgActionCode.START_CRAWLER;
        // eventMsg.data = this.state.factoryModel.wcFactoryVO.code;
        // chrome.runtime.sendMessage(eventMsg, (response) => {
        //     if(chrome.runtime.lastError){
        //         console.log("chrome.runtime.lastError");
        //         setTimeout(() => {
        //             this.startCrawler();
        //         }, 1000);
        //     }else{
        //         this.responseMsg(response)
        //     }

        // });

        // let fittingEventMsg = new EventMsgModel('popup', 'bg');
        // fittingEventMsg.action = MsgActionCode.START_CRAWLER;
        // fittingEventMsg.data = Constants.FACTORY_GREE_FITTING;
        // chrome.runtime.sendMessage(fittingEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let detailEventMsg = new EventMsgModel('popup', 'bg');
        // detailEventMsg.action = MsgActionCode.START_CRAWLER;
        // detailEventMsg.data = Constants.FACTORY_GREE_DETAIL;
        // chrome.runtime.sendMessage(detailEventMsg, (response) => {

        // });

        // let fittingModelEventMsg = new EventMsgModel('popup', 'bg');
        // fittingEventMsg.action = MsgActionCode.START_CRAWLER;
        // fittingEventMsg.data = Constants.FACTORY_GREE_FITTING_MODEL;
        // chrome.runtime.sendMessage(fittingEventMsg, (response) => {
        //     this.responseMsg(response)
        // });


        // let settlementEventMsg = new EventMsgModel('popup', 'bg');
        // settlementEventMsg.action = MsgActionCode.START_CRAWLER;
        // settlementEventMsg.data = Constants.FACTORY_GREE_SETTLEMENT;
        // chrome.runtime.sendMessage(settlementEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let settlementsEventMsg = new EventMsgModel('popup', 'bg');
        // settlementsEventMsg.action = MsgActionCode.START_CRAWLER;
        // settlementsEventMsg.data = Constants.FACTORY_GREE_SETTLEMENTS;
        // chrome.runtime.sendMessage(settlementsEventMsg, (response) => {
        //     this.responseMsg(response)
        // });


        // let selectEventMsg = new EventMsgModel('popup', 'bg');
        // selectEventMsg.action = MsgActionCode.START_CRAWLER;
        // selectEventMsg.data = Constants.FACTORY_GREE_ADDRESS;
        // chrome.runtime.sendMessage(selectEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let feedbackEventMsg = new EventMsgModel('popup', 'bg');
        // feedbackEventMsg.action = MsgActionCode.START_CRAWLER;
        // feedbackEventMsg.data = Constants.FACTORY_GREE_FEEDBACK;
        // chrome.runtime.sendMessage(feedbackEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let installEventMsg = new EventMsgModel('popup', 'bg');
        // installEventMsg.action = MsgActionCode.START_CRAWLER;
        // installEventMsg.data = Constants.FACTORY_GREE_INSTALL;
        // chrome.runtime.sendMessage(installEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let installDetailEventMsg = new EventMsgModel('popup', 'bg');
        // installDetailEventMsg.action = MsgActionCode.START_CRAWLER;
        // installDetailEventMsg.data = Constants.FACTORY_GREE_INSTALL_DETAIL;
        // chrome.runtime.sendMessage(installDetailEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let installSettlementEventMsg = new EventMsgModel('popup', 'bg');
        // installSettlementEventMsg.action = MsgActionCode.START_CRAWLER;
        // installSettlementEventMsg.data = Constants.FACTORY_GREE_INSTALL_SETTLEMENT;
        // chrome.runtime.sendMessage(installSettlementEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let installSettlementsEventMsg = new EventMsgModel('popup', 'bg');
        // installSettlementsEventMsg.action = MsgActionCode.START_CRAWLER;
        // installSettlementsEventMsg.data = Constants.FACTORY_GREE_INSTALL_SETTLEMENTS;
        // chrome.runtime.sendMessage(installSettlementsEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let sendEventMsg = new EventMsgModel('popup', 'bg');
        // sendEventMsg.action = MsgActionCode.START_CRAWLER;
        // sendEventMsg.data = Constants.FACTORY_GREE_SEND;
        // chrome.runtime.sendMessage(sendEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let installSendEventMsg = new EventMsgModel('popup', 'bg');
        // installSendEventMsg.action = MsgActionCode.START_CRAWLER;
        // installSendEventMsg.data = Constants.FACTORY_GREE_INSTALL_SEND;
        // chrome.runtime.sendMessage(installSendEventMsg, (response) => {
        //     this.responseMsg(response)
        // });
        // /***美的 */
        // let mideaInstallOrderEventMsg = new EventMsgModel('popup', 'bg');
        // mideaInstallOrderEventMsg.action = MsgActionCode.START_CRAWLER;
        // mideaInstallOrderEventMsg.data = Constants.FACTORY_MIDEA_INSTALL_ORDER;
        // chrome.runtime.sendMessage(mideaInstallOrderEventMsg, (response) => {
        //     this.responseMsg(response)
        // });

        // let mideaMaintainOrderEventMsg = new EventMsgModel('popup', 'bg');
        // mideaMaintainOrderEventMsg.action = MsgActionCode.START_CRAWLER;
        // mideaMaintainOrderEventMsg.data = Constants.FACTORY_MIDEA_MAINTAIN_ORDER;
        // chrome.runtime.sendMessage(mideaMaintainOrderEventMsg, (response) => {
        //     this.responseMsg(response)
        // });


        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let eventMsg = new EventMsgModel('popup', 'content');
            eventMsg.action = MsgActionCode.CONTENT_RELOAD;
            let that = this;
            chrome.tabs.sendMessage(tabs[0].id, eventMsg, (response) => {
                let ordersList = [];
                console.log("response==>" + JSON.stringify(response));

                that.chromeLocalGetData("crawlerOrderList", fn => (data) => {
                    ordersList = data.crawlerOrderList;
                    if (!ordersList) {
                        ordersList = [];
                    }

                    if (!response) {
                        response = [];
                    }

                    ordersList = this.removeSameItem(ordersList, response, "ordersNo");


                    this.chromeLocalSetData("crawlerOrderList", ordersList);
                    let factoryModel = this.state.factoryModel;
                    factoryModel.running = false;
                    console.log("crawlerOrderList==>" + JSON.stringify(ordersList));
                    this.setState({
                        crawlerOrderList: ordersList,
                        factoryModel: factoryModel
                    });
                })
            });
        });
    }


    /**
     * 旧数组与新数组合并，其中如果key值一致，新数组的数据会替换旧数组的数据
     * @param oldArray 
     * @param newArray 
     * @param key 
     * @returns 
     */
    removeSameItem(oldArray: Array<any>, newArray: Array<any>, key: string): Array<any> {
        return [].concat(newArray, oldArray.filter(item => {
            return !newArray.find(e => e[key] == item[key])
        }))
    }


    downLoadStat() {
        let orderList = this.state.crawlerOrderList;
        let downLoadOrderList = this.state.downLoadOrderList;

        let fileName = "订单.csv";

        let title = ["订单编号", "订单状态", "创建时间", "用户姓名", "用户手机", "用户地址"];
        let titleKey = ["ordersNo", "orderStatus", "createdTime", "customerName", "mobile", "address"];

        let row = "";
        let csvData = "";
        for (let titleInfo of title) {
            row += '"' + titleInfo + '",';
        }
        csvData += row + "\r\n";

        orderList.forEach(e => {
            row = "";
            for (let key of titleKey) {
                if (e[key]) {
                    row += '"' + e[key] + '",';
                }
            }
            csvData += row + "\r\n";
        });

        if (!csvData) {
            return;
        }
        let alink = document.createElement("a");
        let _utf = "\uFEFF";
        if (window.Blob && window.URL && window.URL.createObjectURL) {
            // DOMStrings会被编码为UTF-8，utf-8保存的csv格式要让Excel正常打开的话，必须加入在文件最前面加入BOM(Byte order mark)
            const csvDataBlob = new Blob([_utf + csvData], {
                type: "text/csv",
            });
            alink.href = URL.createObjectURL(csvDataBlob);
        }

        document.body.appendChild(alink);
        alink.setAttribute("download", fileName);
        alink.click();
        document.body.removeChild(alink);
        downLoadOrderList = this.removeSameItem(downLoadOrderList, orderList, "ordersNo");
        this.setState({
            downLoadOrderList: downLoadOrderList,
            crawlerOrderList: []
        });

        this.chromeLocalSetData("downLoadOrderList", downLoadOrderList);
        this.chromeLocalSetData("crawlerOrderList", []);

        this.chromeLocalGetData("downLoadOrderList", fn => (data: any) => {
            if (data.downLoadOrderList) {
                console.log("data.downLoadOrderList==>" + JSON.stringify(data.downLoadOrderList));
            }
        });
        this.chromeLocalGetData("crawlerOrderList", fn => (data: any) => {
            if (data.crawlerOrderList) {
                console.log("data.crawlerOrderList==>" + JSON.stringify(data.crawlerOrderList));
            }
        });
    }

    /**
     * 清除缓存
     */
    clearCache() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let eventMsg = new EventMsgModel('popup', 'content');
            eventMsg.action = MsgActionCode.CLEAR_CACHE;
            chrome.tabs.sendMessage(tabs[0].id, eventMsg, (response) => {
                this.responseMsg(response)
            });
        });
    }

    /**
     * 获取爬虫信息
     */
    initCrawler() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let factory: string;
            factory = Constants.FACTORY_BOJUN;

            if (factory) {
                let factoryModel: ScFactoryModel = new ScFactoryModel();
                let wcFactoryVO = new WcFactoryModel();
                wcFactoryVO.name = "太素技术支持";
                factoryModel.wcFactoryVO = wcFactoryVO;
                let eventMsg = new EventMsgModel('content', 'bg');
                eventMsg.action = MsgActionCode.CRAWLER_STATUS;
                eventMsg.data = factory;
                factoryModel.running = false;
                this.setState({
                    factoryModel: factoryModel
                })
            }
        });

    }


    responseMsg(response: any) {
        if (response) {
        }
    }
    logout() {
        localStorage.removeItem('sessionToken');
        window.location.href = "../popup/popup.html";
    }
    showSet() {
        this.setState({
            showSet: true
        })
    }
    cancelSet() {
        this.setState({
            showSet: false
        })
    }


    changeTypeCheck(item: any) {
        this.setState({
            typeCheck: item
        })

        if (item == MainTypeCode.HAS_CRAWLER) {

            this.chromeLocalGetData("crawlerOrderList", fn => (data: any) => {
                if (data.crawlerOrderList) {
                    this.setState({
                        crawlerOrderList: data.crawlerOrderList
                    })
                }
            });
        }
        if (item == MainTypeCode.CAN_UPATE) {
            this.chromeLocalGetData("downLoadOrderList", fn => (data: any) => {
                if (data.downLoadOrderList) {
                    this.setState({
                        downLoadOrderList: data.downLoadOrderList
                    })
                }
            });
        }
    }
    render() {
        return <div>
            <div className="header clearfix">
                <div className="header-left">
                    <span>
                        <img src="/assets/images/avatar.png" alt="" />
                    </span>
                    <span className="user-name">{this.state.user.name}</span>
                </div>
                {/* <div className="header-right" onMouseEnter={() => { this.showSet() }} onMouseLeave={() => { this.cancelSet() }}>
                    <span className="logout" >设置</span>
                    {
                        this.state.showSet && <div className="select">
                            <p onClick={() => { this.clearCache() }}>清除缓存</p>
                            <p onClick={() => { this.logout() }}>退出</p>
                        </div>
                    }
                </div> */}
            </div>
            <div className="factory-list">
                {
                    this.state.factoryModel && <div className="factory-item clearfix">
                        <div className="item-left">
                            <div>
                                {
                                    this.state.factoryModel.factoryId == 1 ?
                                        <img src="/assets/images/favicon.ico" alt={this.state.factoryModel.wcFactoryVO.name} /> :
                                        <img src="/assets/images/favicon.ico" alt={this.state.factoryModel.wcFactoryVO.name} />
                                }
                            </div>
                            <div>
                                {this.state.factoryModel.wcFactoryVO.name}
                            </div>
                        </div>
                        <div className="item-right">
                            <div className="crawler-button">
                                {
                                    this.state.factoryModel.running ?
                                        <button className="item-running" onClick={() => { this.stopCrawler() }}>停止爬取</button> :
                                        <button className="item-stop" onClick={() => { this.startCrawler() }}>立即爬取</button>
                                }

                            </div>
                            <div>
                                <button className="item-running" onClick={() => { this.downLoadStat() }}>下载数据</button>
                            </div>
                            <div>
                                {
                                    this.state.factoryModel.lastCrawlerTime && '上次爬取时间:' + this.state.factoryModel.lastCrawlerTime
                                }
                            </div>
                            <div>
                                {
                                    this.state.factoryModel.lastCrawlerTime && '已更新至:' + this.state.factoryModel.lastCrawlerTime
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="factory-content">
                <div className="content-head">
                    <div className={this.state.typeCheck == MainTypeCode.HAS_CRAWLER ? "head-item-check" : 'head-item'} onClick={() => { this.changeTypeCheck(MainTypeCode.HAS_CRAWLER) }}>
                        <p>已爬取工单</p>
                    </div>
                    <div className={this.state.typeCheck == MainTypeCode.CAN_UPATE ? "head-item-check" : 'head-item'} onClick={() => { this.changeTypeCheck(MainTypeCode.CAN_UPATE) }}>
                        <p>已下载工单</p>
                    </div>
                </div>
                <div className="content-detail">
                    <div className="table">
                        <div className="table-title">

                        </div>
                        {
                            this.state.typeCheck == MainTypeCode.HAS_CRAWLER && this.state.crawlerOrderList && this.state.crawlerOrderList.map((item, index) => {
                                return <div className="table-content" key={item.ordersNo}>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">订单编号</div>
                                        <div className="table-content_data-info">{item.ordersNo}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">订单状态</div>
                                        <div className="table-content_data-info">{item.orderStatus}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">创建时间</div>
                                        <div className="table-content_data-info">{item.createdTime}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">用户姓名</div>
                                        <div className="table-content_data-info">{item.customerName}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">用户手机</div>
                                        <div className="table-content_data-info">{item.mobile}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">用户地址</div>
                                        <div className="table-content_data-info">{item.address}</div>
                                    </div>
                                </div>

                            })
                        }
                        {
                            this.state.typeCheck == MainTypeCode.CAN_UPATE && this.state.downLoadOrderList && this.state.downLoadOrderList.map((item, index) => {
                                return <div className="table-content" key={item.ordersNo}>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">订单编号</div>
                                        <div className="table-content_data-info">{item.ordersNo}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">订单状态</div>
                                        <div className="table-content_data-info">{item.orderStatus}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">创建时间</div>
                                        <div className="table-content_data-info">{item.createdTime}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">用户姓名</div>
                                        <div className="table-content_data-info">{item.customerName}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">用户手机</div>
                                        <div className="table-content_data-info">{item.mobile}</div>
                                    </div>
                                    <div className="table-content_data">
                                        <div className="table-content_data-title">用户地址</div>
                                        <div className="table-content_data-info">{item.address}</div>
                                    </div>
                                </div>

                            })
                        }

                    </div>


                </div>
                <div>

                </div>
            </div>
        </div>


    }
}


ReactDOM.render(
    <MainComponent>
    </MainComponent>,
    document.getElementById("app")
);
