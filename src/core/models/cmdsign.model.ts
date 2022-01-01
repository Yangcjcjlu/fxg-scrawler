import { RespCode } from '../code/index';
import {BaseModel} from "./index";
// import { SopUserModel } from '../../../server/models/index';

export class CmdSignModel {
	constructor(reqSign?: CmdSignModel) {
		if (reqSign) {
			this.token = reqSign.token;
			this.cmdCode = reqSign.cmdCode;
			this.respCode = RespCode.SUCCESS;
		}
	}
	id:number;
	cmdCode: string;
	pbClass: string;
	reqCode: string;
	respCode: string;
	msg: string;
	source: any;
	cmdVersion: string;
	token: string;
	sessionToken: string;
	pageSize:number;
	pageCount: number;
	pageIndex:number;
	totalCount:number;
	returnStruct:any;
}
