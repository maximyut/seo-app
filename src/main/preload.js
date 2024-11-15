import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
	getInfo: (callback) => ipcRenderer.once("getInfo", callback),
	getCatalog: (callback) => ipcRenderer.once("getCatalog", callback),
	getProgress: (callback) => ipcRenderer.once("getProgress", callback),

	openOldFile: () => ipcRenderer.invoke("openOldFile"),
	startParsing: () => ipcRenderer.invoke("startParsing"),
	stopParsing: () => ipcRenderer.send("stopParsing"),
	pauseParsing: () => ipcRenderer.send("pauseParsing"),
	continueParsing: () => ipcRenderer.send("continueParsing"),
	sendMail: (mail) => ipcRenderer.sendSync("sendMail", mail),

	createPage2: () => ipcRenderer.invoke("createPage2"),
	createPage3: () => ipcRenderer.invoke("createPage3"),
	getSearchXML: () => ipcRenderer.invoke("getSearchXML"),
	stopSearchXML: () => ipcRenderer.send("stopSearchXML"),

	createExcel: () => ipcRenderer.invoke("create-excel"),
	consoleDidChanged: (callback) => ipcRenderer.once("consoleDidChanged", callback),
	store: {
		get(key) {
			return ipcRenderer.sendSync("electron-store-get", key);
		},
		getAll() {
			return ipcRenderer.sendSync("electron-store-get");
		},
		set(property, val) {
			ipcRenderer.send("electron-store-set", property, val);
		},
		delete(key) {
			ipcRenderer.send("electron-store-delete", key);
		},
		clear() {
			ipcRenderer.send("electron-store-clear");
		},
		// consoleDidChanged(callback) {
		// 	return ipcRenderer.once("consoleDidChanged", callback);
		// },
		resetCatalog() {
			ipcRenderer.send("electron-store-resetCatalog");
		},
		// Other method you want to add like has(), reset(), etc.
	},
});
