import { Box, Button, Divider, Drawer, List, ListItem, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

import SpeedDial from "@mui/material/SpeedDial";

import TerminalIcon from "@mui/icons-material/Terminal";
import Tooltip from "@mui/material/Tooltip";

export default function ConsoleBlock() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [data, setData] = useState(window.electron.store.get("consoleInfo") || []);

	window.electron.getInfo((event, info) => {
		const obj = {
			date: new Date().toLocaleString(),
			milliDate: Date.now(),
			text: info,
		};
		setData([obj, ...data]);
		window.electron.store.set("consoleInfo", data);
	});
	const toggleDrawer = (newOpen) => () => {
		setDrawerOpen(newOpen);
	};

	if (data.length > 0) {
		return (
			<>
				<Tooltip title="Открыть консоль">
					<SpeedDial
						ariaLabel="SpeedDial basic example"
						sx={{ position: "fixed", bottom: 16, left: 16 }}
						icon={<TerminalIcon />}
						onClick={toggleDrawer(true)}
					/>
				</Tooltip>

				<Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
					<Box sx={{ height: "50vh", padding: 3 }}>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography sx={{ position: "sticky", top: 0 }} variant="h5">
								Консоль
							</Typography>
							<CloseIcon fontSize="large" onClick={toggleDrawer(false)} sx={{ cursor: "pointer" }} />
						</Stack>

						<List>
							{data.map(({ date, milliDate, text }) => {
								const textClass = text.includes("Error") ? "text error" : "text";
								return (
									<ListItem key={`${milliDate}`} sx={{ borderTop: "1px solid #ccc" }}>
										<div className="console-string">
											<div className="date">{date}: &nbsp;</div>
											<div className={textClass}>{text}</div>
										</div>
									</ListItem>
								);
							})}
						</List>
					</Box>
				</Drawer>
			</>
		);
	}
}
