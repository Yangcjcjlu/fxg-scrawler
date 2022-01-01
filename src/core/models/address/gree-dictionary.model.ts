import {BaseModel} from "./../index";

export class GreeDictionaryModel extends BaseModel{
    
    catCode:string;//类目代号
    name:string;//分类名称
    value:string;//字段值
    parentId:number;//父字段id
    desc:string;//描述
}