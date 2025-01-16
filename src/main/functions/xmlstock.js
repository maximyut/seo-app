import * as convert from "xml-js";
import axios from "axios";
import { BrowserWindow, ipcMain } from "electron";
import store, { sendInfo } from "../store";

const getGoogleXML = async (phrase) => {
	const userID = store.get("user.XML_userID");
	const API_KEY = store.get("user.XML_API_KEY");
	const query = phrase;
	const region = store.get("config.location") || 213;
	const groupBy = 100;
	const searchLink = `https://xmlstock.com/google/json/?user=${userID}&key=${API_KEY}&query=${query}&groupby=${groupBy}&lr=${region}`;

	try {
		const response = await axios.get(searchLink);
		const result = response.data.results;

		return result;
	} catch (error) {
		sendInfo(`getGoogleXML error: ${error}, ${searchLink}`);
		console.log("getGoogleXML error:", error);
		return error;
	}
};

const getGooglePositions = async (phrase, domains) => {
	const response = await getGoogleXML(phrase);

	const newObj = domains.reduce((acc, domain) => {
		acc[`${domain} [Google]`] = "";
		return acc;
	}, {});
	const positions = [];

	for (const id in response) {
		for (const domain of domains) {
			const url = response[id].url;
			if (url.includes(domain)) {
				positions.push({
					[`${domain} [Google]`]: id,
					[`${domain} Релевантный URL [Google]`]: url,
				});
			}
		}
	}

	return { response, positions };
};

const getYandexXML = async (phrase) => {
	const userID = store.get("user.XML_userID");
	const API_KEY = store.get("user.XML_API_KEY");
	const query = phrase;
	const region = store.get("config.location") || 213;
	const groupBy = "attr%3Dd.mode%3Ddeep.groups-on-page%3D100.docs-in-group%3D1";
	const searchLink = `https://xmlstock.com/yandex/xml/?user=${userID}&key=${API_KEY}&query=${query}&groupby=${groupBy}&lr=${region}`;
	try {
		const response = await axios.get(searchLink);
		const result1 = JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }));
		return result1.yandexsearch.response.results.grouping.group;
	} catch (error) {
		// mainWindow.webContents.send("getInfo", searchLink, "getYandexXML error:", error);
		sendInfo(`getYandexXML error: ${error}, ${searchLink}`);
		console.log("getYandexXML error:", error);
	}
};

const getYandexPositions = async (phrase, domains) => {
	const response = await getYandexXML(phrase);

	let i = 1;
	const positions = [];
	for (const responseEl of response) {
		for (const domain of domains) {
			const url = responseEl.doc.url._text;

			if (url.includes(domain)) {
				positions.push({
					[`${domain} [Yandex]`]: i,
					[`${domain} Релевантный URL [Yandex]`]: url,
				});
			}
		}
		i += 1;
	}

	return { response, positions };
};

const getPositions = async (keys, domains) => {
	console.log(keys, domains);
	const newCatalog = [];
	let i = 1;
	const mainWindow = BrowserWindow.fromId(1);

	sendInfo(`Старт получения позиций`);
	store.set("loadingPositions", true);
	let prevVal;

	let parsing = true;

	ipcMain.on("stopSearchXML", async () => {
		parsing = false;
	});

	for (const keyText of keys) {
		sendInfo(`Позиция ${i} из ${keys.length}`);

		const { positions: yandexPositions } = await getYandexPositions(keyText, domains);
		const { positions: googlePositions } = await getGooglePositions(keyText, domains);

		const mergedObject = [...yandexPositions, ...googlePositions]
			.sort((a, b) => {
				const firstKeyA = Object.keys(a)[0];
				const firstKeyB = Object.keys(b)[0];
				return firstKeyA.localeCompare(firstKeyB);
			})
			.reduce((acc, obj) => {
				return { ...acc, ...obj };
			}, {});

		const newObj = {
			id: i,
			Фраза: keyText,
			...mergedObject,
		};

		const number = (i / keys.length) * 100;
		const progress = Math.floor(number * 10) / 10;

		if (progress !== prevVal) {
			prevVal = progress;
			mainWindow.webContents.send("getProgress", { current: i, total: keys.length });
		}

		i += 1;
		newCatalog.push(newObj);
		if (!parsing) {
			break;
		}
	}
	store.set("loadingPositions", false);

	sendInfo(`Конец получения позиций`);

	return newCatalog;
};

export default getPositions;
