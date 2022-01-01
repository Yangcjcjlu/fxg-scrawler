import {BaseModel} from "../index";

export class ScUserModel extends BaseModel{
    
    scId:number;//服务网点id
    mobile:string;//手机号码
    name:string;//姓名
    salt:string;//密码盐
    password:string;//密码
    status:number;//
}