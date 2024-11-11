import ElectronStore from "electron-store";

const schema = {
	config: {
		type: "object",
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
			domains: {
				type: "array",
				items: {
					type: "string",
					format: "url",
				},
			},
		},
		required: ["h1", "title", "description"],
	},

	pausedElement: {
		type: "number",
		default: 0,
	},
	filePath: {
		type: "string",
		default: "",
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
	config: {
		h1: false,
		title: false,
		description: false,
		breadcrumbs: false,
	},
	filePath: "",
	loadingPositions: false,
	pausedElement: 0,
	pages: {},
	initialCatalog: [],
	domains: [],
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

export { sendInfo };

export default store;
