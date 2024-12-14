import { Button, ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import DomainDialog from "./UI/DomainDialog";

export default function Main({ setAlertData, setLoading }) {
	const [domain, setDomain] = useState("");
	const [openDomainDialog, setOpenDomainDialog] = useState(false);

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

		// setFileDir(response.filePath);
	};

	const createKeysSoPage = async () => {
		setLoading(true);
		await window.electron.createKeysSoPage(domain);
		setLoading(false);
	};

	const handleOpenDomainDialog = () => {
		setOpenDomainDialog(true);
	};

	useEffect(() => {
		if (domain) {
			createKeysSoPage(domain);
		}
	}, [domain]);

	return (
		<>
			<ButtonGroup variant="contained" fullWidth>
				<Button variant="contained" onClick={handleOpenDomainDialog}>
					Получить данные из keys.so
				</Button>

				<Button variant="contained" onClick={handleOpenNewFile}>
					Выбрать новый файл
				</Button>

				<Button variant="contained" onClick={handleOpenOldFile}>
					Выбрать готовый файл
				</Button>
			</ButtonGroup>
			<DomainDialog open={openDomainDialog} setOpen={setOpenDomainDialog} setDomain={setDomain} />
		</>
	);
}
