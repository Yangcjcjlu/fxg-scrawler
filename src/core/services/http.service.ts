import { CmdSignModel } from '../models/index';
import * as $ from 'jquery';

export class HttpService {
	static sendData(cmdSign: CmdSignModel): Promise<any> {
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "post",
				url: 'http://localhost:8081/crawler/api',
				// url: 'https://api.jdg360.cn/crawler/api',

				data: JSON.stringify(cmdSign),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function (data) {
					resolve(data);
				},
				error: function (data) {
					reject(data);
				}
			});

		})
	}

}
