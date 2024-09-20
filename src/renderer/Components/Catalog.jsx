import { useState, memo } from "react";
import { Button, Stack } from "@mui/material";

import BeginParsing from "./BeginParsing";
import BasicTabs from "./UI/Tabs";

const Catalog = memo(({ setPages, pages }) => {
	const [continueParsing, setContinueParsing] = useState(false);

	window.electron.getCatalog((event, data) => {
		setPages(data);
	});

	const handleSaveCatalog = () => {
		window.electron.createExcel();
	};

	const handleClearCatalog = () => {
		window.electron.store.resetCatalog();
		setPages(undefined);
	};

	const handleContinueParsing = () => {
		window.electron.continueParsing();
		setPages(undefined);
		setContinueParsing(true);
	};

	if (pages && Object.keys(pages).length > 0) {
		return (
			<Stack direction="column" spacing={4} height="100%">
				<Stack spacing={2}>
					<Stack direction="row" spacing={2}>
						<Button variant="contained" size="small" onClick={handleSaveCatalog}>
							Сохранить каталог
						</Button>
						{window.electron.store.get("pausedElement") ? (
							<Button variant="contained" size="small" onClick={handleContinueParsing}>
								Возобновить парсинг
							</Button>
						) : null}

						<Button variant="contained" size="small" onClick={handleClearCatalog}>
							Очистить каталог
						</Button>
					</Stack>
					<BasicTabs pages={pages} />
				</Stack>
			</Stack>
		);
	}

	return <BeginParsing continueParsing={continueParsing} />;
});

export default Catalog;
