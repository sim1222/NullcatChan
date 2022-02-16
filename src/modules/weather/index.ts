import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import config from '@/config';
import fetch from 'node-fetch';

export default class extends Module {
	public readonly name = 'weather';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text.includes('天気') || msg.text.includes('てんき')) {


			let reqDate: number = 0;
			if (msg.text.includes(`今日`) || msg.text.includes(`きょう`)) {
				reqDate = 0;
			} else if (msg.text.includes(`明日`) || msg.text.includes(`あした`)) {
				reqDate = 1;
			} else if (msg.text.includes(`明後日`) || msg.text.includes(`あさって`)) {
				reqDate = 2;
			} else {
				reqDate = 0;
			}

			let weatherlocation: number = 130010;
			if (config.weatherlocation) {
				weatherlocation = config.weatherlocation;
			}


			const weatherAPI = await fetch(`https://weather.tsukumijima.net/api/forecast/city/${weatherlocation}`);
			const weatherJson = await weatherAPI.json();

			const date = weatherJson.forecasts[reqDate].dateLabel;
			const title = weatherJson.title;
			const weather = weatherJson.forecasts[reqDate].detail.weather;
			const tempHigh = weatherJson.forecasts[reqDate].temperature.max.celsius;
			const tempLow = weatherJson.forecasts[reqDate].temperature.min.celsius;

			msg.reply(date + 'の' + title + 'は\n' + weather + `\n` + '最高気温' + tempHigh + '℃、最低気温' + tempLow + `℃です！`, {
				immediate: true
			});

			return true;
		} else {
			return false;
		}
	}
}
