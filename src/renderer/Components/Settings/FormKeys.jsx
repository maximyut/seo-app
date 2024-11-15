import { Button, Checkbox, FormControl, FormControlLabel, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import AddNew from "../UI/AddNew";

export default function FormKeys({ styles }) {
	const [checkedAll, setCheckedAll] = useState(false);
	const [keys, setKeys] = useState(window.electron.store.get("keys.all") || []);
	const [checkedKeys, setCheckedKeys] = useState(window.electron.store.get("keys.checked") || []);

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		setCheckedKeys(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value,
		);
		window.electron.store.set("keys.checked", typeof value === "string" ? value.split(",") : value);
	};

	const handleCheckedAll = (event) => {
		if (event.target.checked) {
			setCheckedKeys(keys);
			window.electron.store.set("keys.checked", keys);
		} else {
			setCheckedKeys([]);
			window.electron.store.set("keys.checked", []);
		}
		setCheckedAll(event.target.checked);
	};

	const handleAddKey = (newKey) => {
		setKeys([...keys, newKey]);
		window.electron.store.set("keys.all", [...keys, newKey]);
	};

	const compareArrays = (arr1, arr2) => arr1.length === arr2.length && arr1.every((v, i) => v === arr2[i]);

	useEffect(() => {
		if (compareArrays(checkedKeys, keys)) {
			setCheckedAll(true);
		} else {
			setCheckedAll(false);
		}
	}, [checkedKeys, keys]);

	return (
		<Stack sx={styles} spacing={2}>
			<AddNew handleAddNew={handleAddKey} addLabel="Новый ключ" addText="Добавить ключ" />
			<FormControlLabel
				control={<Checkbox checked={checkedAll} onChange={handleCheckedAll} name="checkedAll" />}
				label={checkedAll ? "Отменить выбор всех ключей" : "Выбрать все ключи"}
			/>
			<FormControl sx={{ maxWidth: "100%" }}>
				<InputLabel id="demo-multiple-name-label">Ключи</InputLabel>
				<Select
					labelId="demo-multiple-name-label"
					id="demo-multiple-name"
					multiple
					value={checkedKeys}
					onChange={handleChange}
					input={<OutlinedInput label="Ключи" />}
				>
					{keys.map((domain) => (
						<MenuItem key={domain} value={domain}>
							{domain}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Stack>
	);
}
