import { useState, memo } from "react";
import { Button, Stack } from "@mui/material";

import BeginParsing from "./BeginParsing";
import BasicTabs from "./Tabs";

const Catalog = memo(() => {
	const [pages, setPages] = useState(window.electron?.store?.get("pages"));
	const [continueParsing, setContinueParsing] = useState(false);

	window.electron.getCatalog((event, data) => {
		setPages(data);
	});

	const handleCreatePage2 = async () => {
		const newPages = await window.electron.createPage2();
		setPages(newPages);
	};

	const handleCreatePage3 = async () => {
		const newPages = await window.electron.createPage3();
		setPages(newPages);
	};

	const handleSaveCatalog = () => {
		window.electron.createExcel();
	};

	const handleClearCatalog = () => {
		window.electron.store.clear();
		setPages(undefined);
	};

	const handleContinueParsing = () => {
		window.electron.continueParsing();
		setPages(undefined);
		setContinueParsing(true);
	};

	if (pages && pages.length > 0) {
		return (
			<Stack direction="column" spacing={2} height="100%">
				<Stack direction="row" spacing={2}>
					<Button variant="contained" onClick={handleCreatePage2}>
						Создать страницу 2
					</Button>
					<Button variant="contained" onClick={handleCreatePage3}>
						Создать страницу 3
					</Button>
				</Stack>
				<Stack direction="row" spacing={2}>
					<Button variant="contained" onClick={handleSaveCatalog}>
						Сохранить каталог
					</Button>
					{window.electron.store.get("pausedElement") ? (
						<Button variant="contained" onClick={handleContinueParsing}>
							Возобновить парсинг
						</Button>
					) : null}

					<Button variant="contained" onClick={handleClearCatalog}>
						Очистить каталог
					</Button>
				</Stack>
				<BasicTabs pages={pages} />
			</Stack>
		);
	}

	return <BeginParsing continueParsing={continueParsing} />;
});

export default Catalog;
