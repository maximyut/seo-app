import {
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
import { useEffect, useState } from "react";
import isValidDomain from "is-valid-domain";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import AddNew from "../UI/AddNew";

export default function FormDomains({ pages, setError, error, styles }) {
	const [checkedAll, setCheckedAll] = useState(false);
	const [domains, setDomains] = useState(window.electron.store.get("domains.all") || []);
	const [checkedDomains, setCheckedDomains] = useState(window.electron.store.get("domains.checked") || []);

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		setCheckedDomains(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value,
		);
		window.electron.store.set("domains.checked", typeof value === "string" ? value.split(",") : value);
	};

	const handleCheckedAll = (event) => {
		if (event.target.checked) {
			setCheckedDomains(domains);
			window.electron.store.set("domains.checked", domains);
		} else {
			setCheckedDomains([]);
			window.electron.store.set("domains.checked", []);
		}
		setCheckedAll(event.target.checked);
	};

	const handleAddDomain = (newDomain) => {
		setDomains([...domains, newDomain]);
		window.electron.store.set("domains.all", [...domains, newDomain]);
	};

	useEffect(() => {
		setDomains(window.electron.store.get("domains.all"));
	}, [pages]);

	const compareArrays = (arr1, arr2) => arr1.length === arr2.length && arr1.every((v, i) => v === arr2[i]);

	useEffect(() => {
		if (compareArrays(checkedDomains, domains)) {
			setCheckedAll(true);
		} else {
			setCheckedAll(false);
		}

		setError(checkedDomains.length < 1);
	}, [checkedDomains, domains, setError]);

	return (
		<Stack sx={styles} spacing={2}>
			<AddNew handleAddNew={handleAddDomain} addText="Добавить домен" addLabel="Новый домен" />
			<FormControlLabel
				control={<Checkbox checked={checkedAll} onChange={handleCheckedAll} name="checkedAll" />}
				label={checkedAll ? "Отменить выбор всех доменов" : "Выбрать все домены"}
			/>
			<FormControl sx={{ maxWidth: "100%" }}>
				<InputLabel id="demo-multiple-name-label">Домены</InputLabel>
				<Select
					labelId="demo-multiple-name-label"
					id="demo-multiple-name"
					multiple
					value={checkedDomains}
					onChange={handleChange}
					input={<OutlinedInput label="Домены" />}
				>
					{domains.map((domain) => (
						<MenuItem key={domain} value={domain}>
							{domain}
						</MenuItem>
					))}
				</Select>
				<FormHelperText error={error}>Выберите хотя бы один домен</FormHelperText>
			</FormControl>
		</Stack>
	);
}
