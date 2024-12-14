const keys = ["key1", "key2", "key3"];
const text = ["text1", "text2", "text3"];

const newArr = keys
	.map((key) => {
		const arr = [];
		text.forEach((el) => arr.push(`${key} ${el}`));
		return arr;
	})
	.flat();

console.log(newArr);

const arr = [
	{
		id: 0,
		Фраза: "установить maps me",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 111,
		"Частота! [KS]": 7,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 1,
		Фраза: "mapsmy",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 61,
		"Частота! [KS]": 50,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 2,
		Фраза: "maps me для андроид скачать",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 340,
		"Частота! [KS]": 46,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 3,
		Фраза: "maps me на компьютере",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 70,
		"Частота! [KS]": 9,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 4,
		Фраза: "приложение maps",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 2948,
		"Частота! [KS]": 7,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 5,
		Фраза: "maps me windows",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 124,
		"Частота! [KS]": 6,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 6,
		Фраза: "mapswithme",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 63,
		"Частота! [KS]": 11,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 7,
		Фраза: "maps app",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 5440,
		"Частота! [KS]": 17,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 8,
		Фраза: "мапс ми для компьютера",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 34,
		"Частота! [KS]": 11,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 9,
		Фраза: "maps me на пк",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 24,
		"Частота! [KS]": 13,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 10,
		Фраза: "навигатор maps me",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 152,
		"Частота! [KS]": 36,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 11,
		Фраза: "maps me wallet",
		"URL [KS]": "maps.me/wallet",
		"Частота [KS]": 10,
		"Частота! [KS]": 1,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/wallet\n ",
		Домен: "maps.me",
		Вложенность: 2,
		H1: "",
		title: "MAPS.ME - The only wallet you need on your journey, detailed offline maps of the world",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 12,
		Фраза: "адреса варшавы",
		"URL [KS]": "maps.me/maps/country-polska/city-warszawa-428339515",
		"Частота [KS]": 926,
		"Частота! [KS]": 3,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/maps/country-polska/city-warszawa-428339515\n ",
		Домен: "maps.me",
		Вложенность: 4,
		H1: "Warsaw – a magnificent residence of princes and kings",
		title: "Maps of the city Warsaw, Poland - list of places, organisations addresses, websites directory: download offline Maps.me",
		description: "Maps.me: download Warsaw map, Poland map, find organizations address in global directory",
		"Хлебные крошки":
			"Home\n" +
			"                        \n" +
			"                            \n" +
			"                                \n" +
			"                            \n" +
			"                        \n" +
			"                        Maps\n" +
			"                        \n" +
			"                            \n" +
			"                                \n" +
			"                            \n" +
			"                        \n" +
			"                        Poland\n" +
			"                        \n" +
			"                            \n" +
			"                                \n" +
			"                            \n" +
			"                        \n" +
			"                        \n" +
			"                            Warsaw",
	},
	{
		id: 13,
		Фраза: "maps me для windows",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 56,
		"Частота! [KS]": 36,
		"Позиция [KS]": 1,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 14,
		Фраза: "мепс ми приложение",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 22,
		"Частота! [KS]": 14,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 15,
		Фраза: "офлайн мапс онлайн",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 15,
		"Частота! [KS]": 11,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 16,
		Фраза: "скачать map",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 36363,
		"Частота! [KS]": 22,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 17,
		Фраза: "скачать мапс ме",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 89,
		"Частота! [KS]": 17,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 18,
		Фраза: "maps me оффлайн карты",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 68,
		"Частота! [KS]": 8,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 19,
		Фраза: "google maps me",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 156,
		"Частота! [KS]": 9,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 20,
		Фраза: "приложение maps me скачать бесплатно",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 31,
		"Частота! [KS]": 7,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 21,
		Фраза: "приложение maps me что это",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 19,
		"Частота! [KS]": 16,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 22,
		Фраза: "map me",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 17265,
		"Частота! [KS]": 43,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 23,
		Фраза: "maps with me",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 796,
		"Частота! [KS]": 4,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
	{
		id: 24,
		Фраза: "meps me",
		"URL [KS]": "maps.me/",
		"Частота [KS]": 193,
		"Частота! [KS]": 28,
		"Позиция [KS]": 2,
		"Количество конкурентов по ключу": 1,
		"Повторяющиеся ссылки": "maps.me/\n ",
		Домен: "maps.me",
		Вложенность: 1,
		H1:
			"\n" +
			"                    Maps.me\n" +
			"                    — not just an app but a friend in all your adventures\n" +
			"                  ",
		title: "MAPS.ME (MapsWithMe), detailed offline maps of the world for iPhone, iPad, Android",
		description:
			"MAPS.ME (MapsWithMe) are offline maps of the whole world. Map of the USA: New York, San Francisco, Washington. France Paris. Italy: Rome, Venice, Florence, Rimini. Spain: Barcelona, Madrid. Japan, Great Britain, Turkey, Russia, India. For Android and iOS devices.",
	},
];
