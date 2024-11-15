import { Button, Divider, Stack } from "@mui/material";
import SearchSettings from "./SearchSettings";
import ConfigForm from "./ConfigForm";

export default function Settings({ pages, setPages }) {
	const handleCreatePage2 = async () => {
		try {
			const newPages = await window.electron.createPage2();
			setPages(newPages);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCreatePage3 = async () => {
		try {
			const newPages = await window.electron.createPage3();
			setPages(newPages);
		} catch (error) {
			console.error(error);
		}
	};

	const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

	return (
		<Stack direction="column" spacing={2} justifyContent="space-between" padding={2}>
			<ConfigForm />
			{pages && Object.keys(pages).length > 0 ? (
				<Stack direction="row" justifyContent="space-between" spacing={2} minWidth={200}>
					<Button variant="contained" onClick={handleCreatePage2}>
						Создать страницу 2
					</Button>

					<Button variant="contained" onClick={handleCreatePage3} disabled={!hasKey(pages, "Страница 2")}>
						Создать страницу 3
					</Button>
				</Stack>
			) : null}
			{pages && Object.keys(pages).length > 2 ? (
				<>
					<Divider />
					<SearchSettings pages={pages} setPages={setPages} />
				</>
			) : null}
		</Stack>
	);
}
