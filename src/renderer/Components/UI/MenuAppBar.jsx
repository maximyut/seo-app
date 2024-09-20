import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import AccountMenu from "./AccountMenu";

const MenuAppBar = () => {
	const [user, loading, error] = useAuthState(auth);
	const location = useLocation();
	const navigate = useNavigate();

	const pageTitle = useMemo(() => {
		switch (location.pathname) {
			case "/auth":
				return "Авторизация";
			case "/profile":
				return "Профиль";
			default:
				return "Главная";
		}
	}, [location.pathname]);

	useEffect(() => {
		if (user) {
			navigate("/main");
		} else {
			navigate("/");
		}
	}, [user, loading]);

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						{/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton> */}
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							{pageTitle}
						</Typography>

						{user ? <AccountMenu user={user} /> : <Button color="inherit">Login</Button>}
					</Toolbar>
				</AppBar>
			</Box>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
};

export default MenuAppBar;
