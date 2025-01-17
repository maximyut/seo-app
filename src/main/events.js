import { dialog, ipcMain } from "electron";
import path from "node:path";
import os from "os";
import sendMail from "./functions/mailer";
import { createExcelAndCSV, getCatalogFromExcel, getOldCatalogFromExcel } from "./functions/excelFunc";
import store from "./store";

import {
	createKeysSoPage,
	createMainPage,
	createPage2,
	createPage3,
	createPositionsPage,
	getDomains,
} from "./functions/pages";

ipcMain.handle("sendMail", async (event, args) => {
	const response = await sendMail(args);
	return response;
});

// catalog

const openFile = async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ["openFile"],
		filters: [
			{
				name: "Таблица",
				extensions: ["xlsx", "xls", "xlsb" /* ... other formats ... */],
			},
		],
	});

	if (canceled) return null;

	store.set("filePath", filePaths[0]);
	return filePaths[0];
};
ipcMain.handle("openNewFile", async () => {
	const filePath = await openFile();
	if (!filePath) return;
	const initialCatalog = await getCatalogFromExcel(filePath);
	store.set("pages.Исходный каталог", initialCatalog);
	store.set("filePath", filePath);
	return filePath;
});
ipcMain.handle("openOldFile", async () => {
	const filePath = await openFile();
	if (!filePath) return;
	const pages = await getOldCatalogFromExcel(filePath);

	store.set("pages", pages);
	if (pages["Страница 3"]) getDomains(pages["Страница 3"]);
	return filePath;
});

ipcMain.handle("createKeysSoPage", async (event, domain) => {
	await createKeysSoPage(domain);
});

ipcMain.handle("createMainPage", async (event) => {
	await createMainPage(await store.get("pages.Исходный каталог"));
});

ipcMain.handle("createPage2", async () => {
	const mainCatalog = await store.get("pages.Основной каталог");
	createPage2(mainCatalog);
	return store.get("pages");
});

ipcMain.handle("createPage3", async () => {
	createPage3(store.get("pages.Страница 2"));
	return store.get("pages");
});

ipcMain.handle("create-excel", async () => {
	const storedFilePath = store.get("filePath");
	const dirname = path.dirname(storedFilePath);
	const basename = path.basename(storedFilePath);
	// eslint-disable-next-line no-nested-ternary
	const { homedir } = os.userInfo();

	const defaultPath = storedFilePath
		? `${dirname}/Обновленная ${basename}`
		: process.platform === "win32"
			? `${homedir}\\downloads`
			: `${homedir}/downloads`;

	const options = {
		title: "Сохранить",
		buttonLabel: "Сохранить как",
		defaultPath,
		filters: [{ name: "Excel", extensions: ["xlsx"] }],
	};
	const { canceled, filePath } = await dialog.showSaveDialog(options);
	console.log(`${dirname}/Обновленная `);
	if (!canceled) {
		const res = await createExcelAndCSV(store.get("pages"), filePath);
		return res;
	}
});

ipcMain.handle("createPositionsPage", async (event) => {
	await createPositionsPage();
});

// electron-store

ipcMain.on("electron-store-get", (event, key) => (event.returnValue = store.get(key)));
ipcMain.on("electron-store-getStore", (event) => (event.returnValue = store.store));

ipcMain.on("electron-store-set", async (event, key, val) => {
	store.set(key, val);
});

ipcMain.on("electron-store-delete", async (event, key) => {
	store.delete(key);
});

ipcMain.on("electron-store-clear", async () => {
	store.clear();
});

ipcMain.on("electron-store-resetCatalog", async () => {
	store.reset("filePath", "pages", "domains", "visitedLinks", "consoleInfo");
});
