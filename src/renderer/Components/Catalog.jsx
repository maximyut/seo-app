import { useState, memo } from "react";
import { Button, ButtonGroup, Stack } from "@mui/material";

import BeginParsing from "./BeginParsing";
import BasicTabs from "./UI/Tabs";
import AlertMessage from "./UI/AlertMessage";

const Catalog = memo(({ setPages, pages }) => {
	const [continueParsing, setContinueParsing] = useState(false);
	const [alertData, setAlertData] = useState({});

	window.electron.getCatalog((event, data) => {
		setPages(data);
	});

	const handleSaveCatalog = async () => {
		const [save, cancel, error] = await window.electron.createExcel();
		if (save) {
			setAlertData((data) => {
				return { ...data, open: true, message: "Каталог успешно сохранен", type: "success" };
			});
		} else if (cancel) {
			setAlertData((data) => {
				return { ...data, open: true, message: "Каталог не был сохранен", type: "info" };
			});
		} else if (error) {
			setAlertData((data) => {
				return { ...data, open: true, message: "Ошибка! Каталог не сохранен!", type: "error" };
			});
		}
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

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setAlertData((data) => {
			return { ...data, open: false };
		});
	};

	if (pages && Object.keys(pages).length > 0) {
		return (
			<>
				<AlertMessage handleClose={handleClose} data={alertData} />
				<Stack direction="column" spacing={4} height="100%">
					<Stack spacing={2}>
						<ButtonGroup>
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
						</ButtonGroup>
						<BasicTabs pages={pages} />
					</Stack>
				</Stack>
			</>
		);
	}

	return <BeginParsing continueParsing={continueParsing} />;
});

export default Catalog;
