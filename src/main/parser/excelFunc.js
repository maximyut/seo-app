/* eslint-disable no-restricted-syntax */

// const XLSX = require("xlsx");
// const fs = require("fs");
import * as XLSX from "xlsx";

/* load 'fs' for readFile and writeFile support */
import * as fs from "fs";
import * as _ from "lodash";

export const createPage3 = (catalog) => {
	const keyValues = catalog.map((el) => {
		return el["Вложенность"];
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
					const valFiltered = catalog.filter(
						(catObj) => catObj["Вложенность"] === val && catObj["Домен"] === obj["Домен"],
					);

					newObj[`${val} [количество]`] = valFiltered.length;
					newObj[`${val} [ключи]`] = valFiltered.map((valObj) => valObj["Фраза"]).join(", ");
				});

				return newObj;
			});
			return _.take(newGroup);
		})
		.flat();

	newArr = newArr.map((obj, i) => {
		return { id: i, ...obj };
	});
	return newArr;
};

export const createPage2 = (catalog) => {
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

const createExcelAndCSV = async (pages, filePath) => {
	const workbook = XLSX.utils.book_new();

	pages.forEach((page, i) => {
		const worksheet = XLSX.utils.json_to_sheet(page);
		XLSX.utils.book_append_sheet(workbook, worksheet, `Страница ${i + 1}`);
	});

	await XLSX.writeFile(workbook, filePath);
};

export { getCatalogFromExcel, createExcelAndCSV };
