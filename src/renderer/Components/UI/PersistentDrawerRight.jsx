import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";

import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuAppBar from "./MenuAppBar";

import Settings from "../Settings/Settings";

const drawerWidth = 500;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginRight: -drawerWidth,
	/**
	 * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
	 * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
	 * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
	 * proper interaction with the underlying content.
	 */
	position: "relative",
	width: "100%",

	variants: [
		{
			props: ({ open }) => open,
			style: {
				// transition: theme.transitions.create("margin", {
				// 	easing: theme.transitions.easing.easeOut,
				// 	duration: theme.transitions.duration.enteringScreen,
				// }),
				transition: theme.transitions.create("width", {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				marginRight: 0,
				width: `calc(100vw - ${drawerWidth}px)`,
			},
		},
	],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: "flex-start",
}));

export default function PersistentDrawerRight({ children, pages, setPages }) {
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<>
			<MenuAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
			<Main open={open}>
				{/* <DrawerHeader /> */}
				{children}
			</Main>

			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
					},
				}}
				variant="persistent"
				anchor="right"
				open={open}
			>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
					<Typography variant="h6"> Настройки</Typography>
				</DrawerHeader>
				<Divider />
				<Settings setPages={setPages} pages={pages} />
			</Drawer>
		</>
	);
}
