import { useState, memo } from "react";
import { Button, ButtonGroup, Stack } from "@mui/material";
import BasicTabs from "./UI/Tabs";

const Catalog = memo(({ setPages, pages, setAlertData, setLoading }) => {
	window.electron.getCatalog((event, data) => {
		setPages(data);
	});

	const handleSaveCatalog = async () => {
		try {
			const isSaved = await window.electron.createExcel();
			if (isSaved) {
				setAlertData((data) => {
					return { ...data, open: true, message: "Каталог успешно сохранен", type: "success" };
				});
			} else {
				setAlertData((data) => {
					return { ...data, open: true, message: "Каталог не был сохранен", type: "info" };
				});
			}
		} catch (error) {
			setAlertData((data) => {
				return { ...data, open: true, message: `Ошибка! Каталог не сохранен! ${error.message}`, type: "error" };
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
	};

	return (
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
				<BasicTabs pages={pages} setLoading={setLoading} />
			</Stack>
		</Stack>
	);
});

export default Catalog;
