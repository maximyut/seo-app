import { BrowserWindow } from "electron";
import ElectronStore from "electron-store";

const pagesNames = ["Исходный каталог", "Основной каталог", "Страница 2", "Страница 3", "Позиции", "KeysSo"];

const schema = {
	config: {
		type: "object",
		default: {},
		properties: {
			h1: {
				type: "boolean",
				default: false,
			},
			title: {
				type: "boolean",
				default: false,
			},
			description: {
				type: "boolean",
				default: false,
			},

			breadcrumbs: {
				type: "boolean",
				default: false,
			},

			keysSo: {
				type: "object",
				default: {},
				properties: {
					region: {
						type: "string",
						default: "msk",
					},
					page: {
						type: "number",
						default: 1,
					},
					per_page: {
						type: "number",
						default: 25,
					},
				},
			},
		},
		required: ["h1", "title", "description"],
	},

	extraKeys: {
		type: "object",
		default: {},
		properties: {
			all: {
				type: "array",
				default: [],
			},
			checked: {
				type: "array",
				default: [],
			},
		},
	},

	keys: {
		type: "object",
		default: {},
		properties: {
			all: {
				type: "array",
				default: [],
			},
			checked: {
				type: "array",
				default: [],
			},
		},
	},

	domains: {
		type: "object",
		default: {},
		properties: {
			all: {
				type: "array",
				default: [],
			},
			checked: {
				type: "array",
				default: [],
			},
		},
	},

	pausedElement: {
		type: "number",
		default: 0,
	},
	filePath: {
		type: "string",
		default: "",
	},
	pages: {
		type: "object",
		default: {},
	},
};

const defaults = {
	firebaseConfig: {
		apiKey: "AIzaSyABn7j1o1GNlBa1dbaque-HVN9OHj7etUU",
		authDomain: "seo-app-ae769.firebaseapp.com",
		projectId: "seo-app-ae769",
		storageBucket: "seo-app-ae769.appspot.com",
		messagingSenderId: "815738103955",
		appId: "1:815738103955:web:39d3c7ccc3cfbbfffe0566",
	},

	user: {
		XML_userID: "",
		XML_API_KEY: "",
		KEYSSO_TOKEN: "",
	},
	filePath: "",
	domains: {
		all: [],
		checked: [],
	},
	loadingPositions: false,
	pausedElement: 0,
	pages: {},
	consoleInfo: [],
	visitedLinks: {},
};

const store = new ElectronStore({ defaults, schema });
store.set("loadingPositions", false);
store.set("parsing", false);

const sendInfo = async (text) => {
	const info = {
		date: Date.now(),
		text,
	};

	const consoleInfo = await store.get("consoleInfo");
	store.set("consoleInfo", [info, ...consoleInfo]);
};

store.onDidChange("pages", (newPages, oldPages) => {
	BrowserWindow.fromId(1).webContents.send("getCatalog", newPages);
});

export { sendInfo, pagesNames };

export default store;
