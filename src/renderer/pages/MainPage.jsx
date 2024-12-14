import { useState } from "react";

import { Stack } from "@mui/material";
import ConsoleBlock from "../Components/Console";
import Catalog from "../Components/Catalog";
import Main from "../Components/Main";

import AlertMessage from "../Components/UI/AlertMessage";
import LoadingBackdrop from "../Components/UI/LoadingBackdrop";

export default function MainPage({ pages, setPages }) {
	const [alertData, setAlertData] = useState({});
	const [loading, setLoading] = useState(false);
	const handleCloseAlert = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setAlertData((data) => {
			return { ...data, open: false };
		});
	};

	return (
		<Stack direction="column" spacing={2}>
			{pages && Object.keys(pages).length > 0 ? (
				<Catalog setPages={setPages} pages={pages} setAlertData={setAlertData} setLoading={setLoading} />
			) : (
				<Main setAlertData={setAlertData} setLoading={setLoading} />
			)}
			<ConsoleBlock />
			<AlertMessage handleClose={handleCloseAlert} data={alertData} />
			<LoadingBackdrop loading={loading} />
		</Stack>
	);
}
