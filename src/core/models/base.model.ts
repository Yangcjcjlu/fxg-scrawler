'use strict';

export abstract class BaseModel{
    id: number;
    syncKey: number;
    dataStatus: number;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: number;
    modifiedBy: number;
}
