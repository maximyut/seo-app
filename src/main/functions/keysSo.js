/* eslint-disable camelcase */
import axios from "axios";
import store from "../store";

const getKeysSoPhrases = async (domain = "wildberries.ru") => {
	const TOKEN = store.get("user.KEYSSO_TOKEN");
	const region = store.get("config.keysSo.region");
	const page = store.get("config.keysSo.page");
	const per_page = store.get("config.keysSo.per_page");

	const requestLink = `https://api.keys.so/report/simple/organic/keywords?&auth-token=${TOKEN}&base${region}=&domain=${domain}&sort=pos%7Casc&page=${page}&per_page=${per_page}`;

	const response = await axios.get(requestLink);

	const result = response.data.data.map((item, i) => {
		return {
			id: i,
			Фраза: item.word,
			"URL [KS]": domain + item.url,
			"Частота [KS]": item.ws,
			"Частота! [KS]": item.wsk,
			"Позиция [KS]": item.pos,
		};
	});

	return result;
};

const keysSoYandexDomain = async (phrase) => {
	const region = "msk";
	const page = 1;
	const per_page = 25;

	const requestLink = `https://api.keys.so/report/simple/organic/keywords?&auth-token=${TOKEN}&base${region}=&domain=${domain}&sort=pos%7Casc&page=${page}&per_page=${per_page}`;

	const response = await axios.get(requestLink);

	const result = response.data;
	return result;
};

export { getKeysSoPhrases, keysSoYandexDomain };
