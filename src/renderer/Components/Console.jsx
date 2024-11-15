import { Box, Button, Divider, Drawer, IconButton, List, ListItem, Stack, Typography } from "@mui/material";
import { useState, memo } from "react";
import { FixedSizeList } from "react-window";
import CloseIcon from "@mui/icons-material/Close";
import AutoSizer from "react-virtualized-auto-sizer";
import SpeedDial from "@mui/material/SpeedDial";

import TerminalIcon from "@mui/icons-material/Terminal";
import Tooltip from "@mui/material/Tooltip";
import { Refresh } from "@mui/icons-material";

const ConsoleListItem = memo(({ index, style, data }) => {
	const { date, text } = data[index];
	const textClass = text.includes("Error") ? "text error" : "text";

	return (
		<ListItem style={style} sx={{ borderTop: "1px solid #ccc" }}>
			<div className="console-string">
				<div className="date"> {new Date(date).toLocaleString()}: &nbsp;</div>
				<div className={textClass}>{text}</div>
			</div>
		</ListItem>
	);
});

const ConsoleList = () => {
	const [data, setData] = useState(window.electron.store.get("consoleInfo") || []);

	const emptyText = (
		<div className="console-string">
			<Typography>Консоль пуста</Typography>
		</div>
	);

	const list = (
		<AutoSizer>
			{({ height, width }) => (
				<FixedSizeList
					height={height}
					itemCount={data.length}
					itemSize={50}
					width={width}
					overscanCount={10}
					itemData={data}
				>
					{ConsoleListItem}
				</FixedSizeList>
			)}
		</AutoSizer>
	);

	const content = data.length === 0 ? emptyText : list;
	return (
		<Stack direction="row" height="100%" alignItems="flex-start" justifyContent="space-between">
			{content}
			<IconButton
				size="large"
				edge="start"
				color="inherit"
				aria-label="menu"
				sx={{ mr: 2 }}
				onClick={() => setData(window.electron.store.get("consoleInfo"))}
			>
				<Refresh />
			</IconButton>
		</Stack>
	);
};

const ConsoleBlock = memo(() => {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const toggleDrawer = (newOpen) => () => {
		setDrawerOpen(newOpen);
	};

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

			<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
				<Stack direction="column" sx={{ width: "35vw", height: "100%", padding: 3, overflow: "hidden" }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography sx={{ position: "sticky", top: 0 }} variant="h5">
							Консоль
						</Typography>
						<CloseIcon fontSize="large" onClick={toggleDrawer(false)} sx={{ cursor: "pointer" }} />
					</Stack>
					<ConsoleList />
				</Stack>
			</Drawer>
		</>
	);
});

export default ConsoleBlock;
