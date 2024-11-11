/* eslint-disable no-restricted-syntax */

import * as XLSX from "xlsx";
import * as convert from "xml-js";

/* load 'fs' for readFile and writeFile support */
import * as fs from "fs";
import * as _ from "lodash";
import axios from "axios";
import { BrowserWindow } from "electron";
import store, { sendInfo } from "../store";

const getGoogleXML = async (phrase) => {
	const userID = store.get("XML.userID");
	const API_KEY = store.get("XML.API_KEY");
	const query = phrase;
	const region = 1011969;
	const groupBy = 100;
	const searchLink = `https://xmlstock.com/google/json/?user=${userID}&key=${API_KEY}&query=${query}&groupby=${groupBy}&lr=${region}`;

	try {
		const response = await axios.get(searchLink);

		const result = response.data.results;

		return result;
	} catch (error) {
		// mainWindow.webContents.send("getInfo", searchLink, "getGoogleXML error:", error);
		sendInfo(`getGoogleXML error: ${error}, ${searchLink}`);
		console.log("getGoogleXML error:", error);
	}
};

const getGooglePositions = async (phrase, domains) => {
	const response = await getGoogleXML(phrase);

	const newObj = domains.reduce((acc, domain) => {
		acc[`${domain} [Google]`] = "";
		return acc;
	}, {});

	for (const id in response) {
		for (const domain of domains) {
			const url = response[id].url;
			if (url.includes(domain)) {
				newObj[`${domain} [Google]`] = id;
			}
		}
	}

	return { response, positions: newObj };
};

const getYandexXML = async (phrase) => {
	const userID = store.get("XML.userID");
	const API_KEY = store.get("XML.API_KEY");
	const query = phrase;
	const region = 213;
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

	const newObj = domains.reduce((acc, domain) => {
		acc[`${domain} [Yandex]`] = "";
		return acc;
	}, {});

	let i = 1;
	for (const responseEl of response) {
		for (const domain of domains) {
			if (responseEl.categ._attributes.name === domain) {
				newObj[`${domain} [Yandex]`] = i;
			}
		}
		i += 1;
	}
	return { response, positions: newObj };
};

const getPositions = async (catalog, domains) => {
	const newCatalog = [];
	// const responseArr = {};
	let i = 1;
	const mainWindow = BrowserWindow.fromId(1);
	// mainWindow.webContents.send("getInfo", `Старт получения позиций`);
	sendInfo(`Старт получения позиций`);
	store.set("loadingPositions", true);
	let prevVal;
	const { catalogLength: length } = catalog;

	for (const el of catalog) {
		// mainWindow.webContents.send("getInfo", `Позиция ${i} из ${catalog.length}`);
		sendInfo(`Позиция ${i} из ${catalog.length}`);
		const phrase = el["Фраза"];
		const { response: yandexResponse, positions: yandexPositions } = await getYandexPositions(phrase, domains);
		const { response: googleResponse, positions: googlePositions } = await getGooglePositions(phrase, domains);

		const newObj = { id: i, Фраза: el["Фраза"], ...yandexPositions, ...googlePositions };

		const number = (i / length) * 100;
		const progress = Math.floor(number * 10) / 10;

		if (progress !== prevVal) {
			prevVal = progress;
			mainWindow.webContents.send("getProgress", { current: i, total: catalog.length });
		}
		// responseArr[el["Фраза"]] = { yandexResponse, googleResponse };
		i += 1;
		newCatalog.push(newObj);
	}
	store.set("loadingPositions", false);

	// mainWindow.webContents.send("getInfo", `Конец получения позиций`);
	sendInfo(`Конец получения позиций`);

	return newCatalog;
};
const createPage3 = (catalog) => {
	const keyValues = catalog.map((el) => {
		if (el["Вложенность"]) {
			return el["Вложенность"];
		}
	});

	const uniqueArr = [...new Set(keyValues)].sort();

	let newArr = _.chain(catalog)
		.groupBy("Домен")
		.values()
		.value()
		.map((group) => {
			const groupLength = group.length;
			let allRepeats = 0;
			let allRepeatsPhrases = "";

			// eslint-disable-next-line no-restricted-syntax
			for (const obj of group) {
				allRepeats += Number(obj["Позиция [KS]"]);
				allRepeatsPhrases += `${obj["Фраза"]}, `;
			}
			const newGroup = group.map((obj) => {
				const newObj = {};
				newObj["Домен"] = obj["Домен"];
				newObj["Средняя позиция"] = allRepeats / groupLength;
				newObj["Количество повторений"] = groupLength;
				newObj["Все ключи"] = allRepeatsPhrases;

				uniqueArr.forEach((val) => {
					if (val) {
						const valFiltered = catalog.filter(
							(catObj) => catObj["Вложенность"] === val && catObj["Домен"] === obj["Домен"],
						);

						newObj[`${val} [количество]`] = valFiltered.length;
						newObj[`${val} [ключи]`] = valFiltered.map((valObj) => valObj["Фраза"]).join(", ");
					}
				});

				// eslint-disable-next-line guard-for-in
				for (const key in newObj) {
					const maxLength = 30000;

					const string = newObj[key].toString();

					if (string.length > maxLength) {
						const num = Math.ceil(string.length / maxLength);
						const p = string.length / num;

						for (let i = 0; i < num; i++) {
							newObj[`${key} | ${i + 1}`] = string.slice(i * p, (i + 1) * p);
						}
						delete newObj[key];
					}
				}

				return newObj;
			});
			return _.take(newGroup);
		})
		.flat();

	newArr = newArr.map((obj, i) => {
		return { id: i, ...obj };
	});

	const domains = newArr.map((item) => item["Домен"]);
	store.set("domains", domains);

	return newArr;
};

const createPage2 = (catalog) => {
	const newArr = _.chain(catalog)
		.groupBy("Фраза")
		.values()
		.sortBy("Позиция [KS]")
		.value()
		.map((group) => _.take(_.sortBy(group, ["Позиция [KS]"])))
		.flat();
	return newArr;
};

const getCatalogFromExcel = async (filePath) => {
	try {
		XLSX.set_fs(fs);

		const workbook = XLSX.readFile(filePath);
		const sheetNameList = workbook.SheetNames;
		const initialCatalog = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

		return initialCatalog;
	} catch (error) {
		console.error("Ошибка получения данных из файла:", error); // Log the error for debugging
		// Re-throw the original error for potential handling higher up
		throw error;
	}
};

const getOldCatalogFromExcel = async (filePath) => {
	// const
	try {
		const requiredNames = ["Основной каталог", "Страница 2", "Страница 3", "Позиции"];
		const pages = {};
		XLSX.set_fs(fs);

		const workbook = XLSX.readFile(filePath);
		const sheetNameList = workbook.SheetNames;

		sheetNameList.forEach((sheetName) => {
			if (requiredNames.includes(sheetName)) {
				pages[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
			}
		});
		if (Object.keys(pages).length === 0) {
			throw new Error("Файл не содержит необходимых листов");
		}
		return pages;
	} catch (error) {
		console.error("Ошибка получения данных из файла:", error); // Log the error for debugging
		// Re-throw the original error for potential handling higher up
		throw error;
	}
};

const createExcelAndCSV = async (pages, filePath) => {
	const workbook = XLSX.utils.book_new();

	Object.keys(pages).forEach((catalogName) => {
		const worksheet = XLSX.utils.json_to_sheet(pages[catalogName]);
		XLSX.utils.book_append_sheet(workbook, worksheet, catalogName);
	});

	try {
		await XLSX.writeFile(workbook, filePath);
		// mainWindow.webContents.send("getInfo", `Файл сохранён: ${filePath}`);
		sendInfo(`Файл сохранён: ${filePath}`);
		console.log("Файл сохранён.", filePath);
	} catch (error) {
		console.log("Файл не сохранён.", error);
		// mainWindow.webContents.send("getInfo", `Файл не сохранён: ${error}`);
		sendInfo(`Файл не сохранён: ${error}`);
		throw error;
	}
};

export { getCatalogFromExcel, getOldCatalogFromExcel, createExcelAndCSV, getPositions, createPage3, createPage2 };
