import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
	getInfo: (callback) => ipcRenderer.once("getInfo", callback),
	getCatalog: (callback) => ipcRenderer.once("getCatalog", callback),
	getProgress: (callback) => ipcRenderer.once("getProgress", callback),

	createKeysSoPage: (domain) => ipcRenderer.invoke("createKeysSoPage", domain),

	openNewFile: () => ipcRenderer.invoke("openNewFile"),
	openOldFile: () => ipcRenderer.invoke("openOldFile"),

	createMainPage: () => ipcRenderer.invoke("createMainPage"),
	stopCreatingMainPage: () => ipcRenderer.send("stopCreatingMainPage"),

	createPage2: () => ipcRenderer.invoke("createPage2"),
	createPage3: () => ipcRenderer.invoke("createPage3"),

	createPositionsPage: () => ipcRenderer.invoke("createPositionsPage"),
	stopSearchXML: () => ipcRenderer.send("stopSearchXML"),

	sendMail: (mail) => ipcRenderer.invoke("sendMail", mail),

	createExcel: () => ipcRenderer.invoke("create-excel"),

	store: {
		get: (key) => ipcRenderer.sendSync("electron-store-get", key),
		getStore: () => ipcRenderer.sendSync("electron-store-getStore"),
		set: (key, val) => ipcRenderer.send("electron-store-set", key, val),
		delete: (key) => ipcRenderer.send("electron-store-delete", key),
		clear: () => ipcRenderer.send("electron-store-clear"),

		resetCatalog: () => ipcRenderer.send("electron-store-resetCatalog"),
		// Other method you want to add like has(), reset(), etc.
	},
});
