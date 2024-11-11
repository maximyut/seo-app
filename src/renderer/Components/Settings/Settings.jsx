import { Button, Stack } from "@mui/material";
import SearchSettings from "./SearchSettings";
import ConfigForm from "./ConfigForm";

export default function Settings({ pages, setPages }) {

	const handleCreatePage2 = async () => {
		const newPages = await window.electron.createPage2();
		setPages(newPages);
	};

	const handleCreatePage3 = async () => {
		const newPages = await window.electron.createPage3();
		setPages(newPages);
	};

	const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

	return (
		<Stack direction="row" spacing={2} justifyContent="space-between" padding={2}>
			<ConfigForm />
			{pages && Object.keys(pages).length > 0 ? (
				<>
					<Stack direction="column" spacing={2} minWidth={200}>
						<Button variant="contained" onClick={handleCreatePage2}>
							Создать страницу 2
						</Button>

						<Button variant="contained" onClick={handleCreatePage3} disabled={!hasKey(pages, "Страница 2")}>
							Создать страницу 3
						</Button>
					</Stack>
					<SearchSettings pages={pages} setPages={setPages} />
				</>
			) : null}
		</Stack>
	);
}
