import { Box, Button, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import ProgressBar from "../UI/ProgressBar";
import LocationAutocomplete from "./LocationAutocomplete";
import FormDomains from "./FormDomains";
import FormKeys from "./FormKeys";
import FormExtraKeys from "./FormExtraKeys";

export default function SearchSettings({ pages }) {
	const [loadingPositions, setLoadingPositions] = useState(window.electron?.store?.get("loadingPositions"));
	const [current, setCurrent] = useState(0);
	const [total, setTotal] = useState();
	const [error, setError] = useState(false);

	const handleCreatePositionsPage = async () => {
		setLoadingPositions(true);
		setCurrent(0);
		const newPages = await window.electron.createPositionsPage();
		setLoadingPositions(false);
	};

	const percentage = useMemo(() => {
		// Вычисление дорогостоящей функции
		const result = Number(Number((current / total) * 100).toFixed(1));

		if (result && !Number.isNaN(result)) {
			return result;
		}
		return 0.0;
	}, [current, total]);

	if (!window.electron.store.get("pages.Страница 3")) {
		return <Box>Чтобы получить поисковые запросы, создайте страницу 3</Box>;
	}

	if (!window.electron.store.get("user.XML_API_KEY")) {
		return <Box>Чтобы получить поисковые запросы, добавьте ключ</Box>;
	}

	if (loadingPositions) {
		window.electron.getProgress((event, data) => {
			setCurrent(data.current);

			if (!total) {
				setTotal(data.total);
			}
		});

		return (
			<Stack>
				<div>Получение списка позиций...</div>
				<ProgressBar current={percentage} />
				<Button
					variant="contained"
					onClick={() => {
						window.electron.stopSearchXML();
					}}
				>
					Окончить получение позиций
				</Button>
			</Stack>
		);
	}

	const columnStyles = {
		maxWidth: "225px",
		flex: 1,
	};
	return (
		<Stack spacing={2}>
			<Button variant="contained" onClick={handleCreatePositionsPage} disabled={error}>
				Создать страницу позиций
			</Button>

			<LocationAutocomplete />

			<Stack direction="row" spacing={2}>
				<FormDomains styles={columnStyles} error={error} setError={setError} pages={pages} />
				<FormKeys styles={columnStyles} />
			</Stack>
			<FormExtraKeys />
		</Stack>
	);
}
