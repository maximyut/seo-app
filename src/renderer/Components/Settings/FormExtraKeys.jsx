import { Checkbox, FormControl, FormControlLabel, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import AddNew from "../UI/AddNew";

export default function FormExtraKeys({ styles }) {
	const [checkedAll, setCheckedAll] = useState(false);
	const [extraKeys, setExtaKeys] = useState(window.electron.store.get("extraKeys.all") || []);
	const [checkedExtraKeys, setCheckedExtraKeys] = useState(
		window.electron.store.get("extraKeys.checked") || [],
	);

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;

		setCheckedExtraKeys(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value,
		);
		window.electron.store.set("extraKeys.checked", typeof value === "string" ? value.split(",") : value);
	};

	const handleCheckedAll = (event) => {
		if (event.target.checked) {
			setCheckedExtraKeys(extraKeys);
			window.electron.store.set("extraKeys.checked", extraKeys);
		} else {
			setCheckedExtraKeys([]);
			window.electron.store.set("extraKeys.checked", []);
		}
		setCheckedAll(event.target.checked);
	};

	const handleAddExtraKey = (newExtraKey) => {
		setExtaKeys([...extraKeys, newExtraKey]);
		window.electron.store.set("extraKeys.all", [...extraKeys, newExtraKey]);
	};

	const handleDeleteExtraKey = (extraKey) => {
		setExtaKeys(extraKeys.filter((key) => key !== extraKey));
		window.electron.store.set(
			"extraKeys.all",
			extraKeys.filter((key) => key !== extraKey),
		);
	};

	const compareArrays = (arr1, arr2) => arr1.length === arr2.length && arr1.every((v, i) => v === arr2[i]);

	useEffect(() => {
		if (compareArrays(checkedExtraKeys, extraKeys)) {
			setCheckedAll(true);
		} else {
			setCheckedAll(false);
		}
	}, [checkedExtraKeys, extraKeys]);

	return (
		<Stack sx={styles} spacing={2}>
			<AddNew
				handleAddNew={handleAddExtraKey}
				addText="Добавить дополнение"
				addLabel="Новое дополнение к ключу"
			/>
			<FormControlLabel
				control={<Checkbox checked={checkedAll} onChange={handleCheckedAll} name="checkedAll" />}
				label={checkedAll ? "Отменить выбор всех дополнений" : "Выбрать все дополнения"}
			/>
			<FormControl sx={{ maxWidth: "100%" }}>
				<InputLabel id="demo-multiple-name-label">Дополнение к ключам</InputLabel>
				<Select
					labelId="demo-multiple-name-label"
					id="demo-multiple-name"
					multiple
					value={checkedExtraKeys}
					onChange={handleChange}
					input={<OutlinedInput label="Дополнение к ключам" />}
				>
					{extraKeys.map((extraKey) => (
						<MenuItem key={extraKey} sx={{ flex: 1 }} value={extraKey}>
							{extraKey}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Stack>
	);
}
