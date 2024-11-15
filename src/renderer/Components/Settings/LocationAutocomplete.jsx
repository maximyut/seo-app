import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SearchRegions from "./yandex_search_regions.json";

const getLocationById = (id) => {
	return SearchRegions.find((location) => location.id === id);
};

export default function LocationAutocomplete() {
	const [value, setValue] = useState(
		getLocationById(window.electron.store.get("config.location")) || getLocationById(213),
	);
	const [inputValue, setInputValue] = useState("");

	const options = SearchRegions.map((option) => {
		const firstLetter = option.location[0].toUpperCase();
		return {
			firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
			...option,
		};
	});

	return (
		<Autocomplete
			isOptionEqualToValue={(option, value) => option.id === value.id}
			options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
			groupBy={(option) => option.firstLetter}
			getOptionLabel={(option) => option.location}
			getOptionKey={(option) => option.id}
			renderInput={(params) => <TextField {...params} label="Локация" />}
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
				window.electron.store.set("config.location", newValue?.id);
			}}
			inputValue={inputValue}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
		/>
	);
}
