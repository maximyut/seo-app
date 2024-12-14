import MuiAppBar from "@mui/material/AppBar";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import SettingsIcon from "@mui/icons-material/Settings";

import { styled } from "@mui/material/styles";

import { auth } from "../../firebase/firebase";
import AccountMenu from "./AccountMenu";
import LoadingBackdrop from "./LoadingBackdrop";

const drawerWidth = 500;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
			props: ({ open }) => open,
			style: {
				width: `calc(100% - ${drawerWidth}px)`,
				transition: theme.transitions.create(["margin", "width"], {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				marginRight: drawerWidth,
			},
		},
	],
}));

const MenuAppBar = ({ handleDrawerOpen, open }) => {
	const [user, loading, error] = useAuthState(auth);
	const location = useLocation();
	const navigate = useNavigate();

	const pageTitle = useMemo(() => {
		switch (location.pathname) {
			case "/":
				return "Авторизация";
			case "/profile":
				return "Профиль";
			case "/help":
				return "Помощь";
			default:
				return "Главная";
		}
	}, [location.pathname]);

	useEffect(() => {
		if (location.pathname === "/" && user) {
			navigate("/main");
		}

		if (location.pathname !== "/" && !user) {
			navigate("/");
		}
	}, [user, loading, navigate, location]);

	return (
		<>
			<AppBar position="static" open={open}>
				<Toolbar>
					{/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton> */}
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						{pageTitle}
					</Typography>

					{user ? (
						<>
							<AccountMenu user={user} />
							<IconButton
								color="inherit"
								aria-label="open drawer"
								edge="end"
								onClick={handleDrawerOpen}
								sx={[open && { display: "none" }]}
								size="large"
							>
								<SettingsIcon fontSize="large" color="" />
							</IconButton>
						</>
					) : (
						<Button color="inherit">Авторизация</Button>
					)}
				</Toolbar>
			</AppBar>
			<LoadingBackdrop loading={loading} />
		</>
	);
};

export default MenuAppBar;
