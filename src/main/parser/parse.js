/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const cheerio = require("cheerio");
const PCR = require("puppeteer-chromium-resolver");
const { ipcMain, BrowserWindow } = require("electron");

const { getCatalogFromExcel, createPage2, createPage3, getPositions } = require("./excelFunc");
const { default: store, sendInfo } = require("../store");

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

const getRepeats = (item, catalog) => {
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
	let info = {};
	let visitedLinks = await store.get("visitedLinks");

	const link = item["URL [KS]"];
	info = { ...getDomainInfo(link) };

	if (!link) {
		throw new Error("Ссылка отсутствует");
	}
	if (link in visitedLinks) {
		newItem = { ...item, ...visitedLinks[link] };
		// mainWindow.webContents.send("getInfo", `Ссылка уже обработана`);
		sendInfo(`Ссылка уже обработана`);
		console.info("Ссылка уже обработана");
	} else {
		let html;

		try {
			await page.goto(link, { waitUntil: "load", timeout: 60000 }); // Navigate to the provided URL
			html = await page.content(); // Get the page content

			// html = (await axios.get(link)).data;
		} catch (error) {
			// mainWindow.webContents.send("getInfo", `Страница ${link} недоступна, ${error}`);
			sendInfo(`Страница ${link} недоступна, ${error}`);
			console.error(`Страница ${link} недоступна, ${error}`);
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
				const item = contentContainer.find($(`${breadcrumbsClass}:has(a)`));
				if (item.length > 0) {
					breadcrumbs = item.text().trim();
					break;
				}
			}
			info["Хлебные крошки"] = breadcrumbs;
		}

		newItem = { ...item, ...info };
		visitedLinks[link] = info;
		console.log(info);

		await store.set("visitedLinks", visitedLinks);
	}
	newItem = { ...newItem };

	return newItem;
};

// eslint-disable-next-line prettier/prettier
const parseItem = async (item, initialCatalog, page, mainWindow, config) => {
	await new Promise((resolve) => setTimeout(resolve, 250));

	let newItem = {};

	newItem = getRepeats(item, initialCatalog);
	try {
		newItem = await getPageInfo(newItem, page, mainWindow, config);
	} catch (error) {
		// mainWindow.webContents.send("getInfo", `Ошибка получения информации со страницы: ${error}`);
		sendInfo(`Ошибка получения информации со страницы: ${error}`);
		console.error(`Ошибка получения информации со страницы: ${error}`);
	}
	return newItem;
};

const parse = async (filePath, mainWindow, config) => {
	const newCatalog = [];
	let initialCatalog,
		i = 1;

	try {
		initialCatalog = await getCatalogFromExcel(filePath);

		store.set("initialCatalog", initialCatalog);
	} catch (error) {
		// mainWindow.webContents.send("getInfo", ` Нет каталога, ${error.message}, ${filePath}`);
		sendInfo(` Нет каталога, ${error.message}, ${filePath}`);
		console.error(` Нет каталога, ${error}, ${filePath}`);
		throw error;
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
		// mainWindow.webContents.send("getInfo", `Ошибка запуска браузера: ${error.message}`);
		sendInfo(`Ошибка запуска браузера: ${error.message}`);
	}

	try {
		[page] = await browser.pages();
		await page.setUserAgent("Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0");

		console.info("Страница открыта");
	} catch (error) {
		console.error(`Ошибка открытия страницы: ${error}`);
		// mainWindow.webContents.send("getInfo", `Ошибка открытия страницы: ${error.message}`);
		sendInfo(`Ошибка открытия страницы: ${error.message}`);
	}

	let parsing = store.get("parsing"),
		pausedElement = 0;

	ipcMain.on("stopParsing", async () => {
		parsing = false;
		pausedElement = store.delete("pausedElement");
	});

	for (const item of initialCatalog) {
		// mainWindow.webContents.send("getInfo", `Элемент ${i} из ${initialCatalog.length}`)
		if (i >= pausedElement) {
			console.info(`Элемент ${i} из ${initialCatalog.length}`);
			// mainWindow.webContents.send("getInfo", `Элемент ${i} из ${initialCatalog.length}`);
			sendInfo(`Элемент ${i} из ${initialCatalog.length}`);
			try {
				newCatalog.push({ id: i, ...(await parseItem(item, initialCatalog, page, mainWindow, config)) });
			} catch (error) {
				console.error(`Элемент ${i} из ${initialCatalog.length} \n Ошибка: ${error}`);
				// mainWindow.webContents.send("getInfo", `Элемент ${i} из ${initialCatalog.length} \n Ошибка: ${error}`);
				sendInfo(`Элемент ${i} из ${initialCatalog.length} \n Ошибка: ${error}`);
				continue;
			}

			if (i % Math.floor(initialCatalog.length / 100) === 0) {
				mainWindow.webContents.send("getProgress", { current: i, total: initialCatalog.length });
			}

			if (!parsing) {
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
	store.set("parsing", true);

	const mainWindow = BrowserWindow.fromId(1);

	// mainWindow.webContents.send("getInfo", `Старт парсинга`);
	sendInfo(`Старт парсинга`);
	const config = store.get("config");

	const pages = {};

	try {
		const mainCatalog = await parse(filePath, mainWindow, config);
		pages["Основной каталог"] = mainCatalog;

		mainWindow.webContents.send("getCatalog", pages);
		store.set("pages", pages);
	} catch (error) {
		console.error(`Ошибка парсинга: ${error}`);
		// mainWindow.webContents.send("getInfo", `Ошибка парсинга: ${error}`);
		sendInfo(`Ошибка парсинга: ${error}`);
	}

	// mainWindow.webContents.send("getInfo", `Конец парсинга`);
	sendInfo(`Конец парсинга`);
	console.info(`Конец парсинга`);
	store.set("parsing", false);

	return pages;
};

ipcMain.handle("createPage2", async () => {
	const mainCatalog = await store.get("pages.Основной каталог");
	store.set("pages.Страница 2", createPage2(mainCatalog));
	return store.get("pages");
});

ipcMain.handle("createPage3", async () => {
	if (store.has("pages.Страница 2")) {
		store.set("pages.Страница 3", createPage3(store.get("pages.Страница 2")));
	} else {
		const mainCatalog = store.get("pages.Основной каталог");
		const page2 = createPage2(mainCatalog);
		const page3 = createPage3(page2);
		const pages = {
			"Основной каталог": mainCatalog,
			"Страница 2": page2,
			"Страница 3": page3,
		};
		store.set("pages", pages);
	}
	return store.get("pages");
});

ipcMain.handle("getSearchXML", async (event, checkedDomains) => {
	const page2 = await store.get("pages.Страница 2");
	const domains = Object.keys(checkedDomains)
		.map((key) => {
			if (checkedDomains[key]) {
				return key;
			}
		})
		.filter((el) => el);

	const positions = await getPositions(page2, domains);
	store.set("pages.Позиции", positions);
	return store.get("pages");
});

module.exports = {
	startParsing,
	sendInfo,
};
