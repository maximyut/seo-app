/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const cheerio = require("cheerio");
const PCR = require("puppeteer-chromium-resolver");
const { ipcMain, BrowserWindow } = require("electron");
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
	const phrase = item["Фраза"];
	const [repeatedLinks, repeats] = countRepeats(phrase, catalog);
	item["Количество конкурентов по ключу"] = repeats;
	item["Повторяющиеся ссылки"] = repeatedLinks;

	return item;
};

const getDomainInfo = (link) => {
	let newLink = link.startsWith("http") ? link?.split("://")[1] : link;
	newLink = newLink.endsWith("/") ? newLink.slice(0, -1) : newLink;
	return {
		Домен: newLink?.split("/")[0],
		Вложенность: newLink.split("/").length,
	};
};

const getPageInfo = async (item, page, config) => {
	let newItem = {};
	let info = {};
	const visitedLinks = await store.get("visitedLinks");

	const link = item["URL [KS]"].includes("https") ? item["URL [KS]"] : `https://${item["URL [KS]"]}`;
	info = { ...getDomainInfo(link) };

	if (!link) {
		throw new Error("Ссылка отсутствует");
	}
	if (link in visitedLinks) {
		newItem = { ...item, ...visitedLinks[link] };

		sendInfo(`Ссылка уже обработана`);
		console.info("Ссылка уже обработана");
	} else {
		let html;

		try {
			await page.goto(link, { waitUntil: "load", timeout: 30000 }); // Navigate to the provided URL
			html = await page.content(); // Get the page content

			// html = (await axios.get(link)).data;
		} catch (error) {
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

const parseItem = async (item, initialCatalog, page, config) => {
	await new Promise((resolve) => setTimeout(resolve, 1));

	let newItem = {};

	newItem = getRepeats(item, initialCatalog);
	try {
		newItem = await getPageInfo(newItem, page, config);
	} catch (error) {
		sendInfo(`Ошибка получения информации со страницы: ${error}`);
		console.error(`Ошибка получения информации со страницы: ${error}`);
	}
	return newItem;
};

const parse = async (initialCatalog, mainWindow, config) => {
	const newCatalog = [];
	let i = 1;

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

		sendInfo(`Ошибка запуска браузера: ${error.message}`);
	}

	try {
		[page] = await browser.pages();
		await page.setUserAgent("Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0");

		console.info("Страница открыта");
	} catch (error) {
		console.error(`Ошибка открытия страницы: ${error}`);

		sendInfo(`Ошибка открытия страницы: ${error.message}`);
	}

	let parsing = store.get("parsing"),
		pausedElement = 0;

	ipcMain.once("stopCreatingMainPage", async () => {
		parsing = false;
		pausedElement = store.delete("pausedElement");
	});

	for (const item of initialCatalog) {
		if (i >= pausedElement) {
			console.info(`Элемент ${i} из ${initialCatalog.length}`);

			sendInfo(`Элемент ${i} из ${initialCatalog.length}`);

			try {
				newCatalog.push({ id: i, ...(await parseItem(item, initialCatalog, page, config)) });
			} catch (error) {
				console.error(`Элемент ${i} из ${initialCatalog.length} \n Ошибка: ${error}`);

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

const getMainPage = async (initialCatalog) => {
	console.info(`Старт парсинга`);
	store.set("parsing", true);

	const mainWindow = BrowserWindow.fromId(1);

	sendInfo(`Старт парсинга`);
	const config = store.get("config");

	try {
		const mainCatalog = await parse(initialCatalog, mainWindow, config);
		return mainCatalog;
	} catch (error) {
		console.error(`Ошибка парсинга: ${error}`);

		sendInfo(`Ошибка парсинга: ${error}`);
		return error;
	} finally {
		sendInfo(`Конец парсинга`);
		console.info(`Конец парсинга`);
		store.set("parsing", false);
	}
};

module.exports = {
	getMainPage,
};
