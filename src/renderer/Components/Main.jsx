import { Button, ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import DomainDialog from "./UI/DomainDialog";

export default function Main({ setAlertData, setLoading }) {
	const handleOpenNewFile = async () => {
		await window.electron.openNewFile();
	};
	const handleOpenOldFile = async () => {
		try {
			const response = await window.electron.openOldFile();
			if (!response);
		} catch (error) {
			console.error(error.name);
			setAlertData((data) => {
				return { ...data, open: true, message: error.message, type: "error" };
			});
		}
	};

	return (
		<ButtonGroup variant="contained" fullWidth>
			<DomainDialog setLoading={setLoading} />

			<Button variant="contained" onClick={handleOpenNewFile}>
				Выбрать новый файл
			</Button>

			<Button variant="contained" onClick={handleOpenOldFile}>
				Выбрать готовый файл
			</Button>
		</ButtonGroup>
	);
}
