import * as $ from 'jquery';
import { FittingModel, GreeModel ,EventMsgModel} from '../core/models';
import { Dictionary } from 'async';
import { ThdSourceCode, ReqCode, Constants, MsgActionCode } from '../core/code/index'

export interface CrawlerData {
	crawlPage: number;//正在爬取的页数
	maxId: number;//最大工单号
	woIdMap: any;//本地缓存的工单id
    woIdList: Array<any>;//可爬取的工单id
    isEnd:boolean;//是否是最后一组数据
    pageIndex:number;
    selectMap: Map<string,any>;//格力工单信息
}
export interface CrawlerFittingData {
    crawlPage: number;//正在爬取的页数
	maxPage: number;//共几页
	codeList: Array<string>;//本地缓存的配件编码
	fittingList: Array<FittingModel>;//配件
}

export abstract class BaseCrawler {
    running:boolean = false;
    abstract crawl();

    abstract getCrawlerCode():string;

	getData():CrawlerData{
		let dataStr: string = localStorage.getItem(this.getCrawlerCode());//是否在爬取列表
        return dataStr?JSON.parse(dataStr):{};
    }
    getDataByCode(code:string):any{
		let dataStr: string = localStorage.getItem(code);
        return dataStr?JSON.parse(dataStr):{};
    }
    delDataByCode(code:string):any{
	    localStorage.removeItem(code);
    }
   
	saveData(data:any):void{
		localStorage.setItem(this.getCrawlerCode(),JSON.stringify(data));
    }
    
    getFittingModelData():any{
		let dataStr: string = localStorage.getItem(this.getCrawlerCode());
        return dataStr?JSON.parse(dataStr):{};
    }
    saveFittingModelData(data:any):void{
		localStorage.setItem(this.getCrawlerCode(),JSON.stringify(data));
	}
    getFittingData():CrawlerFittingData{
		let dataStr: string = localStorage.getItem(this.getCrawlerCode());
        return dataStr?JSON.parse(dataStr):{};
    }
    saveDataByCode(code:string,data:any):void{
		localStorage.setItem(code,JSON.stringify(data));
    }
    saveFittingData(data:CrawlerFittingData):void{
		localStorage.setItem(this.getCrawlerCode(),JSON.stringify(data));
	}

    elementValueBySelector(selector: string): string | number | string[] | undefined {
        return $(selector).val();
    }

    elementTextBySelector(selector: string): string | number | string[] | undefined {
        return $(selector).text();
    }

    elementInputBySelector(selector: string, value: string) {
        $(selector).val(value);
    }

    elementClickBySelector(selector: string) {
        $(selector).click();
    }
    goSettlement() {
		let eventMsg = new EventMsgModel('content', 'bg');
		eventMsg.action = MsgActionCode.CREATE_TAB;
		eventMsg.data = '';
		chrome.runtime.sendMessage(eventMsg, function (response) {
		});
    }
    getQueryString(name:string) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var q = window.location.pathname.substr(1).match(reg_rewrite);
        if(r != null){
            return unescape(r[2]);
        }else if(q != null){
            return unescape(q[2]);
        }else{
            return null;
        }
    }
}