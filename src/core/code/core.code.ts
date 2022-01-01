export class ThdSourceCode {
    public static GREE: number = 1;
}

export class Constants {
    public static FACTORY_GREE: string = "GREE";
    public static FACTORY_GREE_INSTALL: string = "FACTORY_GREE_INSTALL";
    public static FACTORY_GREE_INSTALL_DETAIL: string = "FACTORY_GREE_INSTALL_DETAIL";
    public static FACTORY_GREE_FITTING: string = "FACTORY_GREE_FITTING";
    public static FACTORY_GREE_ADDRESS: string = "FACTORY_GREE_ADDRESS";
    public static FACTORY_GREE_FITTING_MODEL: string = "FACTORY_GREE_FITTING_MODEL";
    public static FACTORY_GREE_INSTALL_SETTLEMENTS: string = "GREE_INSTALL_SETTLEMENTS";
    public static FACTORY_GREE_INSTALL_SETTLEMENT: string = "GREE_INSTALL_SETTLEMENT";
    public static FACTORY_GREE_SETTLEMENT: string = "GREE_SETTLEMENT";
    public static FACTORY_GREE_DETAIL: string = "GREE_DETAIL";
    public static FACTORY_GREE_FEEDBACK: string = "FACTORY_GREE_FEEDBACK";
    public static GREE_DETAIL_ARRAY: string = "GREE_DETAIL_ARRAY";
    public static GREE_DETAIL_INSTALL_ARRAY: string = "GREE_DETAIL_INSTALL_ARRAY";
    public static WC_WO_LIST_CRAWL: string = "WC_WO_LIST_CRAWL";
    public static WC_WO_LIST: string = "WC_WO_LIST";
    public static WC_WO_MAX_ID: string = "WC_WO_MAX_ID";
    public static WC_WO_ID_LIST: string = "WC_WO_ID_LIST";
    public static FACTORY_GREE_SETTLEMENTS: string = "FACTORY_GREE_SETTLEMENTS";
    public static FACTORY_GREE_SEND: string = "FACTORY_GREE_SEND";
    public static FACTORY_GREE_INSTALL_SEND: string = "FACTORY_GREE_INSTALL_SEND";

    public static FACTORY_MIDEA:string = "MEIDI";
    public static FACTORY_BOJUN:string = "BOJUN";
    public static FACTORY_MIDEA_INSTALL_ORDER:string = "FACTORY_MEIDI_INSTALL_ORDER";
    public static FACTORY_MIDEA_MAINTAIN_ORDER:string = "FACTORY_MEIDI_MAINTAIN_ORDER";

    
    
}

export class MsgActionCode{
    public static START_CRAWLER: string = "START_CRAWLER";
    public static STOP_CRAWLER: string = "STOP_CRAWLER";
    public static INIT_CRAWLER: string = "INIT_CRAWLER";
    public static CRAWLER_INFO: string = "CRAWLER_INFO";
    public static CRAWLER_STATUS: string = "CRAWLER_STATUS";
    public static CONTENT_RELOAD: string = "CONTENT_RELOAD";
    public static CLEAR_CACHE: string = "CLEAR_CACHE";
    public static SET_SESSION: string = "SET_SESSION";
    public static CLOSE_TAB: string = "CLOSE_TAB";
    public static CREATE_TAB: string = "CREATE_TAB";
    public static GET_TAB: string = "GET_TAB";

}
export class MainTypeCode {
    public static HAS_CRAWLER: number = 1;
    public static CAN_UPATE: number = 2;

}
/***配件存储 */
export class Fittings {
    public static FITTING_MODEL: string = "MODEL";
    public static FITTINGS: string = "FITTING";

}

export class BizType {
    public static REPAIR: number = 2;
    public static INSTALL: number = 1;
}