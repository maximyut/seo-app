/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";

export default function AccountMenu({ user }) {
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<>
			<Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
				{user.email}
				<IconButton
					onClick={handleClick}
					size="small"
					sx={{ ml: 2, gap: 2 }}
					aria-controls={open ? "account-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
				>
					<Avatar sx={{ width: 32, height: 32 }}>{user.email[0].toUpperCase()}</Avatar>
				</IconButton>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem onClick={() => navigate("/profile")} sx={{ gap: 1 }}>
					<Avatar sx={{ width: 32, height: 32 }} /> Профиль
				</MenuItem>
				<Divider />

				<MenuItem onClick={() => navigate("/main")}>
					<ListItemIcon>
						<HomeOutlinedIcon fontSize="small" />
					</ListItemIcon>
					Приложение
				</MenuItem>
				<MenuItem onClick={() => navigate("/help")}>
					<ListItemIcon>
						<HelpIcon fontSize="small" />
					</ListItemIcon>
					Помощь
				</MenuItem>
				<MenuItem onClick={() => auth.signOut()}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Выйти
				</MenuItem>
			</Menu>
		</>
	);
}
