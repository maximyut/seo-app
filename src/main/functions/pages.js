import store from "../store";
import { getPage2, getPage3 } from "./excelFunc";
import { getKeysSoPhrases } from "./keysSo";
import { getMainPage } from "./parse";
import getPositions from "./xmlstock";

const getDomains = (catalog3) => {
	const domains = catalog3.map((item) => item["Домен"]);
	store.set("domains", { all: domains, checked: [] });
};

const createKeysSoPage = async (domain) => {
	try {
		const oldPage = store.get("pages.KeysSo") || [];
		const page = await getKeysSoPhrases(domain);
		const newArr = [...oldPage, ...page].map((item, i) => {
			return {
				...item,
				id: i + 1,
			};
		});
		store.set("pages.KeysSo", newArr);
		return page;
	} catch (error) {
		console.error(`Ошибка создания KeysSo страницы: ${error}`);
		throw error;
	}
};
const createMainPage = async (initialCatalog) => {
	try {
		const page = await getMainPage(initialCatalog);
		store.set("pages.Основной каталог", page);
	} catch (error) {
		console.error(`Ошибка создания Основной страницы: ${error}`);
		throw error;
	}
};

const createPage2 = (catalog) => {
	try {
		const page = getPage2(catalog);
		console.log(page);
		store.set("pages.Страница 2", page);
	} catch (error) {
		console.error(`Ошибка создания страницы 2: ${error}`);
		throw error;
	}
};

const createPage3 = (catalog2) => {
	try {
		const page = getPage3(catalog2);
		getDomains(page);

		store.set("pages.Страница 3", page);
	} catch (error) {
		console.error(`Ошибка создания страницы 3: ${error}`);
		throw error;
	}
};

const createPositionsPage = async () => {
	try {
		const page2 = await store.get("pages.Страница 2");
		const currentKeys = [...page2.map((item) => item["Фраза"]), ...store.get("keys.checked")];

		const extraKeys = ["", ...store.get("extraKeys.checked")];
		const positionsKeys = currentKeys
			.map((key) => {
				const arr = [];
				extraKeys.forEach((el) => arr.push(`${key} ${el}`));
				return arr;
			})
			.flat();

		const oldPositions = store.get("pages.Позиции");
		const positions = await getPositions(positionsKeys, store.get("domains.checked"));
		const newPositions = [...oldPositions, ...positions];
		store.set("pages.Позиции", newPositions);
	} catch (error) {
		console.error(`Ошибка создания страницы позиций: ${error}`);
		throw error;
	}
};

export { createMainPage, createPositionsPage, createKeysSoPage, createPage2, createPage3, getDomains };
