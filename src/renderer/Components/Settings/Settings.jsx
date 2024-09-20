import { Button, Stack } from "@mui/material";
import SearchSettings from "./SearchSettings";
import ConfigForm from "./ConfigForm";

export default function Settings({ setPages }) {
	const pages = window.electron?.store?.get("pages");
	const handleCreatePage2 = async () => {
		const newPages = await window.electron.createPage2();
		setPages(newPages);
	};

	const handleCreatePage3 = async () => {
		const newPages = await window.electron.createPage3();
		setPages(newPages);
	};

	return (
		<Stack direction="row" spacing={2}>
			<ConfigForm />
			{pages && Object.keys(pages).length > 0 ? (
				<>
					<Stack direction="column" spacing={2}>
						<Button variant="contained" onClick={handleCreatePage2}>
							Создать страницу 2
						</Button>
						<Button variant="contained" onClick={handleCreatePage3}>
							Создать страницу 3
						</Button>
					</Stack>
					<SearchSettings setPages={setPages} />
				</>
			) : null}
		</Stack>
	);
}
