/* eslint-disable no-restricted-syntax */

import * as XLSX from "xlsx";
import * as fs from "fs";
import * as _ from "lodash";

import { pagesNames, sendInfo } from "../store";

const getPage3 = (catalog) => {
	const keyValues = catalog.map((keyText) => {
		if (keyText["Вложенность"]) {
			return keyText["Вложенность"];
		}
	});

	const uniqueArr = [...new Set(keyValues)].sort();

	const newArr = _.chain(catalog)
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
		.flat()
		.map((obj, i) => {
			return { id: i, ...obj };
		});

	return newArr;
};

const getPage2 = (catalog) => {
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
		const initialCatalog = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]).map((obj, i) => {
			return { ...obj, id: i };
		});

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
		const pages = {};
		XLSX.set_fs(fs);

		const workbook = XLSX.readFile(filePath);
		const sheetNameList = workbook.SheetNames;

		sheetNameList.forEach((sheetName) => {
			if (pagesNames.includes(sheetName)) {
				pages[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
			}
		});
		if (Object.keys(pages).length === 0) {
			throw new Error("Файл не содержит необходимых листов");
		}
		return pages;
	} catch (error) {
		console.error("Ошибка получения данных из файла:", error.message); // Log the error for debugging
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
		return true;
	} catch (error) {
		console.log("Файл не сохранён.", error);
		// mainWindow.webContents.send("getInfo", `Файл не сохранён: ${error}`);
		sendInfo(`Файл не сохранён: ${error}`);
		return error;
	}
};

export { getCatalogFromExcel, getOldCatalogFromExcel, createExcelAndCSV, getPage2, getPage3 };
