import Main from "../Components/Main";
import ConsoleBlock from "../Components/Console";
import { useState } from "react";
import Catalog from "../Components/Catalog";

export default function MainPage({ pages, setPages }) {
	return (
		<>
			<Catalog setPages={setPages} pages={pages} />
			<ConsoleBlock />
		</>
	);
}
