import { MemoryRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";

import { Container } from "@mui/material";

import AuthPage from "./pages/AuthPage";
import MenuAppBar from "./Components/UI/MenuAppBar";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
	return (
		<MemoryRouter>
			<MenuAppBar />
			<Container maxWidth={false} sx={{ padding: 2 }}>
				<Routes>
					<Route path="/" element={<AuthPage />} />
					<Route path="/main" element={<MainPage />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Routes>
			</Container>
		</MemoryRouter>
	);
}
