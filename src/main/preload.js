// const { contextBridge, ipcRenderer } = require('electron');
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
	getInfo: (callback) => ipcRenderer.once("getInfo", callback),
	getCatalog: (callback) => ipcRenderer.once("getCatalog", callback),
	getProgress: (callback) => ipcRenderer.once("getProgress", callback),

	startParsing: () => ipcRenderer.invoke("startParsing"),
	stopParsing: () => ipcRenderer.send("stopParsing"),
	pauseParsing: () => ipcRenderer.send("pauseParsing"),
	continueParsing: () => ipcRenderer.send("continueParsing"),

	createPage2: () => ipcRenderer.invoke("createPage2"),
	createPage3: () => ipcRenderer.invoke("createPage3"),
	getSearchXML: (checkedDomains) => ipcRenderer.invoke("getSearchXML", checkedDomains),

	createExcel: () => ipcRenderer.invoke("create-excel"),
	store: {
		get(key) {
			return ipcRenderer.sendSync("electron-store-get", key);
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

		resetCatalog() {
			ipcRenderer.send("electron-store-resetCatalog");
		},
		// Other method you want to add like has(), reset(), etc.
	},
});
