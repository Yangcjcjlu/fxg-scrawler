export class EventMsgModel{
    constructor(source:'bg'|'popup'|'content',target:'bg'|'popup'|'content') {
        this.source = source;
        this.target = target;
	}
    source: 'bg'|'popup'|'content';
    target: 'bg'|'popup'|'content';
    action: string;
    data: any;
}