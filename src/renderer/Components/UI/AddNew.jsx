import { Button, TextField } from "@mui/material";
import { useState } from "react";

export default function AddNew({ handleAddNew, addText, addLabel }) {
	const [newText, setNewText] = useState("");

	const inputError = newText && newText.length < 1;

	return (
		<>
			<TextField
				error={Boolean(inputError)}
				helperText={inputError ? "Некорректный текст" : null}
				variant="standard"
				label={addLabel}
				value={newText}
				size="small"
				onChange={(event) => {
					setNewText(event.target.value);
				}}
			/>
			<Button
				onClick={() => {
					handleAddNew(newText);
					setNewText("");
				}}
				variant="contained"
				disabled={newText.length < 1}
			>
				{addText}
			</Button>
		</>
	);
}
