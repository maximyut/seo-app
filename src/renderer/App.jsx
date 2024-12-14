import { MemoryRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import { useState } from "react";
import AuthPage from "./pages/AuthPage";

import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import PersistentDrawerRight from "./Components/UI/PersistentDrawerRight";
import HelpPage from "./pages/HelpPage";

export default function App() {
	const [pages, setPages] = useState(window.electron?.store?.get("pages"));
	window.electron.getCatalog((event, data) => {
		setPages(data);
	});
	return (
		<MemoryRouter>
			<PersistentDrawerRight pages={pages} setPages={setPages}>
				<Routes>
					<Route path="/" element={<AuthPage />} />
					<Route path="/main" element={<MainPage pages={pages} setPages={setPages} />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/help" element={<HelpPage />} />
				</Routes>
			</PersistentDrawerRight>
		</MemoryRouter>
	);
}
