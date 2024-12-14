import { Divider, Stack } from "@mui/material";
import SearchSettings from "./SearchSettings";
import ConfigForm from "./ConfigForm";

export default function Settings({ pages, setPages }) {
	return (
		<Stack direction="column" spacing={2} justifyContent="space-between" padding={2}>
			<ConfigForm />
			{pages && Object.keys(pages).length > 2 ? (
				<>
					<Divider />
					<SearchSettings pages={pages} setPages={setPages} />
				</>
			) : null}
		</Stack>
	);
}
