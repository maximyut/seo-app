import { Stack } from "@mui/material";
import { useState } from "react";
import AccordionUsage from "./UI/AccordionUsage";
import Catalog from "./Catalog";
import Settings from "./Settings/Settings";

export default function Main() {
	const [pages, setPages] = useState(window.electron?.store?.get("pages"));

	return (
		<Stack direction="column" spacing={4}>
			<AccordionUsage title="Настройки">
				<Settings setPages={setPages} />
			</AccordionUsage>
			<Catalog setPages={setPages} pages={pages} />
		</Stack>
	);
}
