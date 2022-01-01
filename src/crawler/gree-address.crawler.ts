import { BaseCrawler, CrawlerData } from './base.crawler'
import { EventMsgModel, CmdSignModel, ProvinceModel, CityModel, DistrictModel, StreetModel, GreeDictionaryModel, GreeSmallClassModel, GreeSeriesModel } from '../core/models/index'
import { ThdSourceCode, ReqCode, Constants, MsgActionCode, Fittings, RespCode } from '../core/code/index'
import { Scheduler } from '../core/services/index'
import * as $ from 'jquery';
import { ScFactoryModel, } from '../core/models/sc/sc-factory.model';
import { Dictionary } from 'async';
import { GreeProvincePostCmd } from '../core/cmd/gree';
import { GreeDictionaryPostCmd } from '../core/cmd/gree/gree-dictionary-post.cmd';
import { GreeCateforyModel } from '../core/models/address/gree-catefory.model';
import { GreeCateforyPostCmd } from '../core/cmd/gree/gree-catefory-post.cmd';

class GreeAddressCrawler extends BaseCrawler {

	getCrawlerCode(): string {
		return Constants.FACTORY_GREE_ADDRESS;
	}

	crawl() {
		let path = location.href;
		//
		if (path == "http://pgxt.gree.com:7909/hjzx/az/doAddAz?xsorsh=1&otype=az") {
			/**爬取用户属性 */
			//this.crawlUser();
			/**爬取销售类型 */
			//this.crawlSaleType();
			/**爬取销售单位 */
			//this.crawlSaleUnit();
			/**爬取信息来源 */
			//this.crawlInfoSource();
			/**爬取地址级联 */
			//this.crawlAddress();
			/**爬取品类 */
			this.crawlCatefory(0);

		}
		//维修工单 录入
		if(path == "http://pgxt.gree.com:7909/hjzx/assign/doAddAssign.action"){
		   /***故障现象 */
		   //this.crawlFault();
		   /**爬取品类 */
			//this.crawlCatefory(1);
		}
	}

	crawlUser() {
		/**爬取用户属性 */
		let dictionaryList: Array<GreeDictionaryModel> = [];
		$("#yhsx option").each(function () {
			let value: string = $(this).text();
			if (value != "") {
				let dictionary: GreeDictionaryModel = new GreeDictionaryModel();
				dictionary.name = value
				dictionaryList.push(dictionary);
			}
		});

		let dictionaryPostCmd: GreeDictionaryPostCmd = new GreeDictionaryPostCmd(ReqCode.GREE_ORDER_USER_PROPERTY, dictionaryList);
		dictionaryPostCmd.setAfterRespDo((data) => {
			if (data.respCode == RespCode.FAIL) {
				alert("用户属性添加");
			}
		})
		Scheduler.exe(dictionaryPostCmd);


	}
	crawlSaleType() {
		let greeData = this.getData();
		/**爬取销售类型 */
		let dictionaryList: Array<GreeDictionaryModel> = [];
		$("#xslx option").each(function () {
			let value: string = $(this).text();
			if (value != "") {
				let dictionary: GreeDictionaryModel = new GreeDictionaryModel();
				dictionary.name = value
				dictionaryList.push(dictionary);
			}
		});

		let dictionaryPostCmd: GreeDictionaryPostCmd = new GreeDictionaryPostCmd(ReqCode.GREE_ORDER_SALE_TYPE, dictionaryList);
		dictionaryPostCmd.setAfterRespDo((data) => {
			if (data.respCode == RespCode.FAIL) {
				alert("用户属性添加");
			}
		})
		Scheduler.exe(dictionaryPostCmd);

	}

	crawlSaleUnit() {
		let dictionaryList: Array<GreeDictionaryModel> = [];
		/**爬取销售单位 */
		let saleUnitArr: Array<String> = [];
		$("#xsdw option").each(function () {
			let value: string = $(this).text();
			if (value != "") {
				let dictionary: GreeDictionaryModel = new GreeDictionaryModel();
				dictionary.name = value
				dictionaryList.push(dictionary);
			}
		});
		let dictionaryPostCmd: GreeDictionaryPostCmd = new GreeDictionaryPostCmd(ReqCode.GREE_ORDER_SALE_UNIT, dictionaryList);
		dictionaryPostCmd.setAfterRespDo((data) => {
			if (data.respCode == RespCode.FAIL) {
				alert("用户属性添加");
			}
		})
		Scheduler.exe(dictionaryPostCmd);

	}

	crawlInfoSource() {
		let dictionaryList: Array<GreeDictionaryModel> = [];
		/**爬取信息来源 */
		let infoSourceArr: Array<String> = [];
		$("#xxly option").each(function () {
			let value: string = $(this).text();
			if (value != "") {
				let dictionary: GreeDictionaryModel = new GreeDictionaryModel();
				dictionary.name = value
				dictionaryList.push(dictionary);
			}
		});
		let dictionaryPostCmd: GreeDictionaryPostCmd = new GreeDictionaryPostCmd(ReqCode.GREE_ORDER_INFO_SOURCE, dictionaryList);
		dictionaryPostCmd.setAfterRespDo((data) => {
			if (data.respCode == RespCode.FAIL) {
				alert("用户属性添加");
			}
		})
		Scheduler.exe(dictionaryPostCmd);

	}

	crawlAddress() {
		let provinceArr: Array<string> = [];

		$("#sfen option").each(function () {
			let value: string = $(this).text();
			if (value != '省份') {
				let provinceModel: ProvinceModel = new ProvinceModel();
				provinceArr.push(value);
			}
		});
		let provinceList: Array<ProvinceModel> = [];
		for (let province of provinceArr) {
			let provinceModel: ProvinceModel = new ProvinceModel();
			provinceModel.name = province;
			provinceModel.cityList = this.crawlCity(province);
			provinceList.push(provinceModel);
		}
		console.log(provinceList);

		/***添加数据库 */
		let procincePostCmd: GreeProvincePostCmd = new GreeProvincePostCmd(provinceList);
		procincePostCmd.setAfterRespDo((data) => {
			if (data.respCode == RespCode.SUCCESS) {
				alert("省市区添加");
			}
		})
		Scheduler.exe(procincePostCmd);

	}

	/**
	 * 发送请求获取市列表
	 * @param name 省
	 */
	crawlCity(name: string): Array<CityModel> {
		let cityArr: Array<string> = [];
		$.ajax({
			url: "cityAz",
			type: "post",
			async: false,
			dataType: "json",
			data: {
				province: name
			},
			success: function (result) {
				if (result != null) {
					for (var i = 0; i < result.length; i++) {
						cityArr.push(result[i]);
					}
				}
			}
		});
		let cityList: Array<CityModel> = [];
		for (let city of cityArr) {
			let cityModel: CityModel = new CityModel();
			cityModel.name = city;
			cityModel.districtList = this.crawlDistrict(name, city);
			cityList.push(cityModel);
		}
		console.log(cityList)
		return cityList;
	}

	/**
	 * 根据省市获取区县列表
	 * @param provinceName 省
	 * @param cityName 市
	 */
	crawlDistrict(provinceName: string, cityName: string): Array<DistrictModel> {
		let districtArr: Array<string> = [];
		$.ajax({
			url: "countyAz",
			type: "post",
			dataType: "json",
			async: false,
			data: {
				province: provinceName,
				city: cityName
			},
			success: function (result) {
				if (result != null) {
					for (var i = 0; i < result.length; i++) {
						districtArr.push(result[i]);
					}
				}
			}
		});
		let districtList: Array<DistrictModel> = [];
		for (let district of districtArr) {
			let districtModel: DistrictModel = new DistrictModel();
			districtModel.name = district;
			districtModel.streetList = this.crawlStreet(provinceName, cityName, district);
			districtList.push(districtModel);
		}
		return districtList;
	}
	/**
	 * 根据省市区获取街道列表
	 * @param provinceName 省
	 * @param cityName 市
	 * @param districtName 区县
	 */
	crawlStreet(provinceName: string, cityName: string, districtName: string): Array<StreetModel> {
		let streetArr: Array<StreetModel> = [];
		$.ajax({
			url: "streetAz",
			type: "post",
			dataType: "json",
			async: false,
			data: {
				province: provinceName,
				city: cityName,
				county: districtName
			},
			success: function (result) {
				if (result != null) {
					for (var i = 0; i < result.length; i++) {
						let streetModel: StreetModel = new StreetModel();
						streetModel.name = result[i];
						streetArr.push(streetModel);
					}
				}
			}
		});
		return streetArr;
	}

	/**品类 */
	crawlCatefory(type:number) {
		let cateforyArr: Array<GreeCateforyModel> = [];

		$("#spid option").each(function () {
			let name: string = $(this).text();
			let value: string = $(this).val().toString();

			if (value != '') {
				let catefoyModel: GreeCateforyModel = new GreeCateforyModel();
				catefoyModel.name = name;
				catefoyModel.value = value;
				cateforyArr.push(catefoyModel);
			}
		});
		let cateforyList: Array<GreeCateforyModel> = [];
		for (let catefory of cateforyArr) {
			let catefoyModel: GreeCateforyModel = new GreeCateforyModel();
			catefoyModel.name = catefory.name;
			catefoyModel.value = catefory.value;
			catefoyModel.type = type;
			if(type == 0){
				catefoyModel.smallClassList = this.crawlSmall(catefory.value);
			}else{
				catefoyModel.smallClassList = this.crawlSmall1(catefory.value);
			}
			cateforyList.push(catefoyModel);
		}
		console.log(cateforyList);

		let cateforyPostCmd = new GreeCateforyPostCmd(cateforyList);
		cateforyPostCmd.setAfterRespDo((data) => {
			if (data.respCode == RespCode.SUCCESS) {
				alert("品类爬取完成");
			}
		})
		Scheduler.exe(cateforyPostCmd);

	}

	/**
	 * 获取品类下小类
	 * 
	 * @param catefory 品类id
	 */
	crawlSmall(catefory: string): Array<GreeSmallClassModel> {
		let city = $("#cshi").val();
		let county = $("#xian").val();
		let smallClassArr: Array<GreeSmallClassModel> = []
		$.ajax({
			url: "xiaoleiAz",
			type: "post",
			dataType: "json",
			async: false,
			data: {
				spid: catefory,
				city: city,
				county: county
			},
			success: function (result) {
				console.log(result);
				if (result != null) {
					let xiaoleiList = result.xiaoleiList;
					for (let xiaolei of xiaoleiList) {
						let smallClassModel: GreeSmallClassModel = new GreeSmallClassModel();
						smallClassModel.name = xiaolei.xlmc;
						smallClassModel.value = xiaolei.xlid;
						smallClassArr.push(smallClassModel);
					}
				}
			}
		});

		let smallClassList: Array<GreeSmallClassModel> = [];
		for (let smallClass of smallClassArr) {
			let smallClassModel: GreeSmallClassModel = new GreeSmallClassModel();
			smallClassModel.name = smallClass.name;
			smallClassModel.value = smallClass.value;
			smallClassModel.seriesList = this.crawlSeries(smallClass.value);
			smallClassList.push(smallClassModel);
		}
		console.log(smallClassList);
		return smallClassList;
	}

	
	/**
	 * 获取品类下小类  维修
	 * 
	 * @param catefory 品类id
	 */
	crawlSmall1(catefory: string): Array<GreeSmallClassModel> {
		let city = $("#cshi").val();
		let county = $("#xian").val();
		let smallClassArr: Array<GreeSmallClassModel> = []
		$.ajax({
			url: "/hjzx/assign/getXiaoleiAssign",
			type: "post",
			dataType: "json",
			async: false,
			data:"spid=" + catefory + "&city=" + city + "&county=" + county,
			success: function (result) {
				console.log(result);
				if (result != null) {
					let xiaoleiList = result.xiaoleiList;
					for (let xiaolei of xiaoleiList) {
						let smallClassModel: GreeSmallClassModel = new GreeSmallClassModel();
						smallClassModel.name = xiaolei.xlmc;
						smallClassModel.value = xiaolei.xlid;
						smallClassArr.push(smallClassModel);
					}
				}
			}
		});

		let smallClassList: Array<GreeSmallClassModel> = [];
		for (let smallClass of smallClassArr) {
			let smallClassModel: GreeSmallClassModel = new GreeSmallClassModel();
			smallClassModel.name = smallClass.name;
			smallClassModel.value = smallClass.value;
			smallClassModel.seriesList = this.crawlSeries1(catefory,smallClass.value);
			smallClassList.push(smallClassModel);
		}
		console.log(smallClassList);
		return smallClassList;
	}

	/**
	 * 获取小类下系列
	 * 
	 * @param smallClass 小类
	 */
	crawlSeries(smallClass: string): Array<GreeSeriesModel> {
		let city = $("#cshi").val();
		let county = $("#xian").val();
		let seriesList: Array<GreeSeriesModel> = []
		$.ajax({
			url: "xiidAz",
			type: "post",
			dataType: "json",
			async: false,
			data: {
				xlid: smallClass
			},
			success: function (result) {
				console.log(result);
				if (result != null) {
					let xilieMcList = result.xilieMcList;
					for (let xilieMc of xilieMcList) {
						if (xilieMc != "") {
							let seriesModel: GreeSeriesModel = new GreeSeriesModel();
							seriesModel.name = xilieMc;
							seriesModel.value = xilieMc;
							seriesList.push(seriesModel);
						}
					}
				}
			}
		});
		console.log(seriesList);
		return seriesList;
	}
	/**
	 * 获取小类下系列 维修
	 * 
	 * @param smallClass 小类
	 */
	crawlSeries1(spid: string,smallClass: string): Array<GreeSeriesModel> {
		let city = $("#cshi").val();
		let county = $("#xian").val();
		let seriesList: Array<GreeSeriesModel> = []
		$.ajax({
			url: "/hjzx/assign/getXilieAssign",
			type: "post",
			dataType: "json",
			async: false,
			data:"spid=" + spid + "&xlid="+ smallClass,
			success: function (result) {
				console.log(result);
				if (result != null) {
					let xilieMcList = result.data1;
					for (let xilieMc of xilieMcList) {
						if (xilieMc != "") {
							let seriesModel: GreeSeriesModel = new GreeSeriesModel();
							seriesModel.name = xilieMc.ximc;
							seriesModel.value = xilieMc.xiid;
							seriesList.push(seriesModel);
						}
					}
				}
			}
		});
		console.log(seriesList);
		return seriesList;
	}

	crawlFault(){
		let dictionaryList: Array<GreeDictionaryModel> = [];
		/**爬取故障现象 */
		$("#gzxxid option").each(function () {
			let value: string = $(this).text();
			if (value != "") {
				let dictionary: GreeDictionaryModel = new GreeDictionaryModel();
				dictionary.name = value
				dictionaryList.push(dictionary);
			}
		});
		let dictionaryPostCmd: GreeDictionaryPostCmd = new GreeDictionaryPostCmd(ReqCode.GREE_ORDER_FAULT_PHENOMENON, dictionaryList);
		dictionaryPostCmd.setAfterRespDo((data) => {
			if (data.respCode == RespCode.SUCCESS) {
				alert("故障现象增加成功");
			}
		})
		Scheduler.exe(dictionaryPostCmd);
	}

	processMsg(request: EventMsgModel): any {
		if (request.action == MsgActionCode.CONTENT_RELOAD) {
			location.reload();
		} else if (request.action == MsgActionCode.CLEAR_CACHE) {
			localStorage.removeItem(Constants.FACTORY_GREE_FITTING);
		}
	}
}

let greeAddressCrawler = new GreeAddressCrawler();

chrome.runtime.onMessage.addListener(
	function (request: EventMsgModel, sender, sendResponse) {
		if (request.target == 'content') {
			let result = greeAddressCrawler.processMsg(request);
			if (result) {
				sendResponse(result);
			}
		}
	});

$(document).ready(() => {
	let eventMsg = new EventMsgModel('content', 'bg');
	eventMsg.action = MsgActionCode.CRAWLER_STATUS;
	eventMsg.data = greeAddressCrawler.getCrawlerCode();
	chrome.runtime.sendMessage(eventMsg, function (response) {
		localStorage.setItem("sessionToken", response.sessionToken);
		if (response.running) {
			greeAddressCrawler.crawl();
		}
	});

});
