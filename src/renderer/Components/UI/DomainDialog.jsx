/* eslint-disable camelcase */
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import isValidDomain from "is-valid-domain";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

const regions = [
	{ code: "msk", name: "Москва", search: "Яндекс" },
	{ code: "gru", name: "Москва", search: "Google" },
	{ code: "zen", name: "Дзен", search: "" },
	{ code: "gkv", name: "Киев", search: "Google" },
	{ code: "rnd", name: "Ростов-на-Дону", search: "Яндекс" },
	{ code: "ekb", name: "Екатеринбург", search: "Яндекс" },
	{ code: "ufa", name: "Уфа", search: "Яндекс" },
	{ code: "sar", name: "Саратов", search: "Яндекс" },
	{ code: "krr", name: "Краснодар", search: "Яндекс" },
	{ code: "prm", name: "Пермь", search: "Яндекс" },
	{ code: "sam", name: "Самара", search: "Яндекс" },
	{ code: "kry", name: "Красноярск", search: "Яндекс" },
	{ code: "oms", name: "Омск", search: "Яндекс" },
	{ code: "kzn", name: "Казань", search: "Яндекс" },
	{ code: "che", name: "Челябинск", search: "Яндекс" },
	{ code: "nsk", name: "Новосибирск", search: "Яндекс" },
	{ code: "nnv", name: "Н. Новгород", search: "Яндекс" },
	{ code: "vlg", name: "Волгоград", search: "Яндекс" },
	{ code: "vrn", name: "Воронеж", search: "Яндекс" },
	{ code: "spb", name: "Санкт-Петербург", search: "Яндекс" },
	{ code: "mns", name: "Минск", search: "Яндекс" },
	{ code: "tmn", name: "Тюмень", search: "Яндекс" },
	{ code: "gmns", name: "Минск", search: "Google" },
	{ code: "tom", name: "Томск", search: "Яндекс" },
	{ code: "gny", name: "New York", search: "Google" },
];

const Regions = () => {
	const options = regions.sort((a, b) => {
		if (a.search === b.search) {
			return a.name.localeCompare(b.name);
		}
		return a.search.localeCompare(b.search);
	});

	return (
		<FormControl sx={{ flex: 1 }}>
			<InputLabel htmlFor="grouped-select">Регион</InputLabel>
			<Select
				name="region"
				defaultValue={window.electron.store.get("config.keysSo.region")}
				id="grouped-select"
				label="Регион"
			>
				{options.map((option) => (
					<MenuItem key={option.code} value={option.code}>
						{option.name} - {option.search}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

const DomainInput = ({ error, setError }) => {
	const [state, setState] = useState("");
	const handleChange = (e) => {
		const { value } = e.target;
		setState(value);
		setError(!isValidDomain(value) && value.length > 0);
	};
	return (
		<TextField
			sx={{ flex: 1 }}
			autoFocus
			required
			margin="dense"
			id="name"
			name="domain"
			label="Домен"
			type="domain"
			fullWidth
			variant="standard"
			error={error}
			value={state}
			onChange={handleChange}
		/>
	);
};

const Config = ({ error, setError }) => {
	return (
		<Stack spacing={2} direction="column" mt={2}>
			<Stack spacing={1} direction="row">
				<DomainInput sx={{ flex: 1 }} error={error} setError={setError} />
				<Regions />
			</Stack>
			<Stack spacing={1} direction="row">
				<TextField sx={{ flex: 1 }} name="page" label="Номер страницы" defaultValue={1} />
				<TextField sx={{ flex: 1 }} name="per_page" label="Количество записей на странице" defaultValue={25} />
			</Stack>
		</Stack>
	);
};

export default function DomainDialog({ open, setOpen, setDomain }) {
	const [error, setError] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				component: "form",
				onSubmit: async (event) => {
					event.preventDefault();
					const formData = new FormData(event.currentTarget);
					const formJson = Object.fromEntries(formData.entries());
					const { domain, page, per_page, region } = formJson;
					console.log(domain, page, per_page, region);

					await window.electron.store.set("config.keysSo", {
						region,
						page: Number(page),
						per_page: Number(per_page),

					});
					setDomain(domain);

					handleClose();
				},
			}}
		>
			<DialogTitle>Получить данные по домену</DialogTitle>
			<DialogContent>
				<DialogContentText>Введите домен по которому нужно получить информацию</DialogContentText>

				<Config error={error} setError={setError} />
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Отмена</Button>
				<Button disabled={error} type="submit">
					Начать
				</Button>
			</DialogActions>
		</Dialog>
	);
}
