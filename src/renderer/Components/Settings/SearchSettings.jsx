import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	FormLabel,
	Stack,
	TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import isValidDomain from "is-valid-domain";
import ProgressBar from "../UI/ProgressBar";

export default function SearchSettings({ pages, setPages }) {
	const domains = window.electron.store.get("domains");
	const [XMLKey, setXMLKey] = useState(window.electron.store.get("XML.API_KEY"));
	const [checkedDomains, setCheckedDomains] = useState(domains.reduce((a, v) => ({ ...a, [v]: false }), {}));
	const [checkedAll, setCheckedAll] = useState(false);
	const [newDomain, setNewDomain] = useState("");
	const [loadingPositions, setLoadingPositions] = useState(window.electron?.store?.get("loadingPositions"));
	const [current, setCurrent] = useState(0);
	const [total, setTotal] = useState();

	const handleChange = (event) => {
		setCheckedDomains({
			...checkedDomains,
			[event.target.name]: event.target.checked,
		});
	};

	const handleCheckedAll = (event) => {
		if (event.target.checked) {
			setCheckedDomains((obj) =>
				Object.keys(obj).reduce((acc, key) => {
					acc[key] = true;
					return acc;
				}, {}),
			);
		} else {
			setCheckedDomains((obj) =>
				Object.keys(obj).reduce((acc, key) => {
					acc[key] = false;
					return acc;
				}, {}),
			);
		}
		setCheckedAll(event.target.checked);
	};

	const handleAddDomain = () => {
		setCheckedDomains({
			...checkedDomains,
			[newDomain]: false,
		});
		window.electron.store.set("domains", [...domains, newDomain]);
		setNewDomain("");
	};

	const handleGetSearchXML = async () => {
		setLoadingPositions(true);

		const newPages = await window.electron.getSearchXML(checkedDomains);
		setLoadingPositions(false);
		setPages(newPages);
	};

	const error =
		Object.keys(checkedDomains)
			.map((key) => {
				return checkedDomains[key];
			})
			.filter((v) => v).length < 1;

	const inputError = !isValidDomain(newDomain) && newDomain.length > 0;

	const percentage = useMemo(() => {
		// Вычисление дорогостоящей функции
		const result = Number(Number((current / total) * 100).toFixed(1));

		if (result && !Number.isNaN(result)) {
			return result;
		}
		return 0.0;
	}, [current, total]);

	useEffect(() => {
		setCheckedDomains(window.electron.store.get("domains").reduce((a, v) => ({ ...a, [v]: false }), {}));
	}, [pages]);

	useEffect(() => {
		Object.values(checkedDomains).every((v) => v) ? setCheckedAll(true) : setCheckedAll(false);
	}, [checkedDomains]);

	if (!window.electron.store.get("pages.Страница 3")) {
		return <Box>Чтобы получить поисковые запросы, создайте страницу 3</Box>;
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
				<div>Получение списка поисковых запросов...</div>
				<ProgressBar current={percentage} />
			</Stack>
		);
	}

	return (
		<Stack spacing={2}>
			{XMLKey ? (
				<>
					<Button variant="contained" onClick={handleGetSearchXML} disabled={error}>
						Страница с поисковыми запросами
					</Button>
					<FormControlLabel
						control={<Checkbox checked={checkedAll} onChange={handleCheckedAll} name="checkedAll" />}
						label={checkedAll ? "Отменить выбор всех доменов" : "Выбрать все домены"}
					/>
					<Stack spacing={2}>
						<FormControl required error={error} component="fieldset">
							<FormLabel component="legend">Существующие домены:</FormLabel>
							<FormGroup>
								{Object.keys(checkedDomains).map((domain) => (
									<FormControlLabel
										control={
											<Checkbox
												checked={checkedDomains[domain]}
												onChange={handleChange}
												name={domain}
											/>
										}
										key={domain}
										label={domain}
									/>
								))}
							</FormGroup>
							{error && <FormHelperText>Выберите хотя бы один домен</FormHelperText>}
						</FormControl>
						<TextField
							error={inputError}
							helperText={inputError ? "Некорректный домен" : null}
							variant="standard"
							label="Новый домен"
							value={newDomain}
							size="small"
							onChange={(event) => {
								setNewDomain(event.target.value);
							}}
						/>
						<Button
							onClick={handleAddDomain}
							variant="contained"
							disabled={inputError || newDomain.length < 1}
						>
							Добавить домен
						</Button>
					</Stack>
				</>
			) : (
				<Box>Чтобы получить поисковые запросы, добавьте ключ</Box>
			)}
		</Stack>
	);
}
