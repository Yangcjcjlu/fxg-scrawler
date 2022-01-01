//# sourceURL=dynamicScript.js
import { EventMsgModel } from "../core/models";
chrome.runtime.onMessage.addListener(
    function (request: EventMsgModel, sender, sendResponse) {
        console.log("request==>");
        // console.log("request==>"+JSON.stringify(request))
        if (request.target == 'bg') {
            if (request.action == "CRAWLER_STATUS") {//爬虫状态
                let running = localStorage.getItem(request.data + "_RUNNING");
                let session = localStorage.getItem("sessionToken");
                sendResponse({
                    running: running == "true",
                    sessionToken: session
                });
            } else if (request.action == 'START_CRAWLER') { //启动
                console.log("request.data");
                localStorage.setItem(request.data + "_RUNNING", "true");
                sendResponse({});
            } else if (request.action == 'STOP_CRAWLER') { //停用
                localStorage.setItem(request.data + "_RUNNING", "false");
                sendResponse({});
            } else if (request.action == 'SET_SESSION') { //设置session
                localStorage.setItem("sessionToken", request.data);
            } else if (request.action == 'CLOSE_TAB') { //设置session
                chrome.tabs.remove(sender.tab.id)
            } else if (request.action == 'CREATE_TAB') { //设置session
                chrome.tabs.create({ url: `http://pgxt.gree.com:7909/hjzx/assign/doWxJsList_Wxtojs?summaryStat=yhz` })
            } else if (request.action == 'GET_TAB') { //设置session
                sendResponse({ id: sender.tab.id });
            }
        }
    });

    // background.js
chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开百度才显示pageAction
					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'jinritemai.com'}})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});

class Daemon {

    private static _instance: Daemon

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    private arrayMap: Map<String, Array<any>>;

    private constructor(){
        this.arrayMap = new Map();
    }

    getArray(key: string): Array<any> {
        let array = this.arrayMap.get(key) || [];
        return array;
    }

    setArray(key: string, array: Array<any>): void {
        this.arrayMap.set(key, array);
    }
}

const instance = Daemon.Instance;
export default instance;