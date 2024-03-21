/* eslint-disable no-restricted-syntax */
const cheerio = require("cheerio");
const PCR = require("puppeteer-chromium-resolver");
const { ipcMain, BrowserWindow } = require("electron");

const { getCatalogFromExcel, createPage2, createPage3 } = require("./excelFunc");
const { default: store } = require("../store");

const countRepeats = (phrase, catalog) => {
	let i = 0;
	let repeatedLinks = "";
	for (const currentItem of catalog) {
		if (currentItem["Фраза"] === phrase) {
			repeatedLinks += `${currentItem["URL [KS]"]}\n `;
			i += 1;
		}
	}
	return [repeatedLinks, i];
};

const getRepeats = async (item, catalog) => {
	// const foundPhrases = await getData(foundPhrasesPath);
	// let foundPhrases = store.get("foundPhrases");

	const phrase = item["Фраза"];
	const [repeatedLinks, repeats] = countRepeats(phrase, catalog);
	item["Количество конкурентов по ключу"] = repeats;
	item["Повторяющиеся ссылки"] = repeatedLinks;

	// await createJSON([...foundPhrases, phrase], foundPhrasesPath);
	// store.set("foundPhrases", [...foundPhrases, phrase]);
	return item;
};

const getDomainInfo = (link) => {
	let newLink = link?.split("://")[1];
	newLink = newLink.endsWith("/") ? newLink.slice(0, -1) : newLink;
	return {
		Домен: newLink?.split("/")[0],
		Вложенность: newLink.split("/").length,
	};
};

const getPageInfo = async (item, page, mainWindow, config) => {
	let newItem = {};
	const info = {};
	const visitedLinks = await store.get("visitedLinks");

	const link = item["URL [KS]"];

	if (link in visitedLinks) {
		newItem = { ...item, ...visitedLinks[link] };
		console.info("Ссылка уже обработана");
	} else {
		let html;

		try {
			await page.goto(link, { waitUntil: "load", timeout: 60000 }); // Navigate to the provided URL
			html = await page.content(); // Get the page content

			// html = (await axios.get(link)).data;
		} catch (error) {
			mainWindow.webContents.send("getInfo", `Страница ${link} недоступна, ${error}`);
			return item;
		}

		const $ = cheerio.load(html);

		const contentContainer = $("html");
		if (config.h1) {
			info.H1 = contentContainer.find("h1").text() || "";
		}
		if (config.title) {
			info.title = contentContainer.find("title").text() || "";
		}

		if (config.title) {
			info.description = contentContainer.find('meta[name="description"]').attr("content") || "";
		}
		if (config.breadcrumbs) {
			const breadcrumbsClasses = [".breadcrumbs", ".breadcrumb", "#breadcrumbs", "#breadcrumb"];

			let breadcrumbs;

			for (const breadcrumbsClass of breadcrumbsClasses) {
				const el = contentContainer.find($(`${breadcrumbsClass}:has(a)`));
				if (item.length > 0) {
					breadcrumbs = el.text().trim();
					break;
				}
			}
			info["Хлебные крошки"] = breadcrumbs;
		}

		newItem = { ...item, ...info };
		visitedLinks[link] = info;

		store.set("visitedLinks", visitedLinks);
	}

	return newItem;
};

// eslint-disable-next-line prettier/prettier
const parseItem = async (item, initialCatalog, page, mainWindow, config) => {
	let newItem = {};

	try {
		newItem = await getRepeats(item, initialCatalog);
		newItem = await getPageInfo(newItem, page, mainWindow, config);
		newItem = { ...newItem, ...getDomainInfo(item["URL [KS]"]) };
	} catch (error) {
		mainWindow.webContents.send("getInfo", `Ошибка записи: ${error}`);
	}

	return newItem;
};

const parse = async (filePath, mainWindow, config) => {
	mainWindow.webContents.send("getInfo", `parse`);
	const newCatalog = [];
	let initialCatalog,
		i = 1;

	if (!store.has("initialCatalog")) {
		try {
			initialCatalog = await getCatalogFromExcel(filePath);

			store.set("initialCatalog", initialCatalog);
		} catch (error) {
			mainWindow.webContents.send("getInfo", ` Нет каталога, ${error.message}, ${filePath}`);
			console.error(` Нет каталога, ${error}, ${filePath}`);
			throw error;
		}
	} else {
		initialCatalog = store.get("initialCatalog");
		console.info(` Каталог существует, ${initialCatalog}, ${filePath}`);
	}

	if (!store.has("visitedLinks")) {
		store.set("visitedLinks", {});
	}

	const options = {};
	const stats = await PCR(options);
	let browser, page;
	try {
		browser = await stats.puppeteer.launch({
			headless: true,
			args: ["--no-sandbox"],
			executablePath: stats.executablePath,
			timeout: 0,
		});

		console.info("Браузер запущен");
	} catch (error) {
		console.error(`Ошибка запуска браузера: ${error}`);
		mainWindow.webContents.send("getInfo", `Ошибка запуска браузера: ${error.message}`);
	}

	try {
		[page] = await browser.pages();
		await page.setUserAgent("Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0");

		console.info("Страница открыта");
	} catch (error) {
		console.error(`Ошибка открытия страницы: ${error}`);
		mainWindow.webContents.send("getInfo", `Ошибка открытия страницы: ${error.message}`);
	}

	let stopParsing,
		pausedElement = 0;

	ipcMain.on("stopParsing", async () => {
		stopParsing = true;
		pausedElement = store.delete("pausedElement");
	});

	ipcMain.on("pauseParsing", async () => {
		stopParsing = true;
		store.set("pausedElement", i);
	});

	if (store.has("pausedElement")) {
		pausedElement = store.get("pausedElement");
	}

	for (const item of initialCatalog) {
		// mainWindow.webContents.send("getInfo", `Элемент ${i} из ${initialCatalog.length}`)
		if (i >= pausedElement) {
			console.info(`Элемент ${i} из ${initialCatalog.length}`);
			mainWindow.webContents.send("getInfo", `Элемент ${i} из ${initialCatalog.length}`);
			try {
				newCatalog.push({ id: i, ...(await parseItem(item, initialCatalog, page, mainWindow, config)) });
			} catch (error) {
				mainWindow.webContents.send("getInfo", `Элемент ${i} из ${initialCatalog.length} \n Ошибка: ${error}`);
				return newCatalog;
			}
			if (i % Math.floor(initialCatalog.length / 1000) === 0) {
				mainWindow.webContents.send("getProgress", { current: i, total: initialCatalog.length });
			}
			if (stopParsing) {
				break;
			}
		}

		i += 1;
	}

	if (i === initialCatalog.length) {
		store.delete("pausedElement");
	}

	await browser.close(); // Close the browser
	return newCatalog;
};

const startParsing = async (filePath) => {
	console.info(`Старт парсинга`);
	const mainWindow = BrowserWindow.fromId(1);

	mainWindow.webContents.send("getInfo", `Старт парсинга`);
	const config = store.get("config");

	const pages = [];
	let catalog2, catalog3;
	try {
		const mainCatalog = await parse(filePath, mainWindow, config);
		pages.push(mainCatalog);

		if (config.page2) {
			catalog2 = createPage2(mainCatalog);
			pages.push(catalog2);
		}
		if (config.page3) {
			catalog3 = createPage3(catalog2);
			pages.push(catalog3);
		}
		mainWindow.webContents.send("getCatalog", pages);
		store.set("pages", pages);
	} catch (error) {
		mainWindow.webContents.send("getInfo", `ошибка парсинга: ${error}`);
	}

	mainWindow.webContents.send("getInfo", `Конец парсинга`);
	console.info(`Конец парсинга`);
	return pages;
};

ipcMain.handle("createPage2", async () => {
	const mainCatalog = await store.get("pages.0");
	const page2 = createPage2(mainCatalog);
	const newPages = [mainCatalog, page2];
	store.set("pages", newPages);
	return newPages;
});

ipcMain.handle("createPage3", async () => {
	const pages = await store.get("pages");
	let newPages = [];
	if (pages.length > 1) {
		const page3 = createPage3(pages[1]);
		newPages = [pages[0], pages[1], page3];
		store.set("pages", newPages);
	} else {
		const mainCatalog = store.get("pages")[0];
		const page2 = createPage2(mainCatalog);
		const page3 = createPage3(page2);
		newPages = [mainCatalog, page2, page3];
		store.set("pages", newPages);
	}
	return newPages;
});

module.exports = {
	startParsing,
};
