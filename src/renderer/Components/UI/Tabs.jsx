/* eslint-disable react/prop-types */

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import BasicTable from "./BasicTable";
import BeginParsing from "../BeginParsing";

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const CreatingInitialCatalog = ({ catalog }) => {
	const handleCreateInitialPage = async () => {
		window.electron.store.set("pages.Исходный каталог", catalog);
	};

	return (
		<Button variant="contained" onClick={handleCreateInitialPage} disabled={!catalog.length}>
			Создать Исходный каталог
		</Button>
	);
};

function CustomTabPanel({ value, index, catalogName, pages, setLoading, ...other }) {
	const [rowSelectionModel, setRowSelectionModel] = useState([]);

	const chosenRows = (catalog) => {
		return catalog.filter((row) => rowSelectionModel.includes(row.id));
	};

	const handleCreatePage2 = async () => {
		try {
			setLoading(true);
			const newPages = await window.electron.createPage2();
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const handleCreatePage3 = async () => {
		try {
			setLoading(true);
			const newPages = await window.electron.createPage3();
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const renderButton = () => {
		switch (catalogName) {
			case "KeysSo":
				return <CreatingInitialCatalog catalog={chosenRows(pages[catalogName], rowSelectionModel)} />;
			case "Исходный каталог":
				return <BeginParsing />;
			case "Основной каталог":
				return (
					<Button variant="contained" onClick={handleCreatePage2}>
						Создать страницу 2
					</Button>
				);
			case "Страница 2":
				return (
					<Button variant="contained" onClick={handleCreatePage3}>
						Создать страницу 3
					</Button>
				);
			default:
				return null;
		}
	};

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
			style={{}}
			direction="column"
		>
			{value === index && (
				<Stack alignItems="start" spacing={2} sx={{ p: 2 }}>
					{renderButton()}
					<BasicTable
						catalog={pages[catalogName]}
						pageName={catalogName}
						rowSelectionModel={rowSelectionModel}
						setRowSelectionModel={setRowSelectionModel}
					/>
				</Stack>
			)}
		</div>
	);
}

CustomTabPanel.propTypes = {
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};
export default function BasicTabs({ pages, setLoading }) {
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%", height: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					{Object.keys(pages).map((catalogName, i) => (
						<Tab label={catalogName} {...a11yProps(i)} key={catalogName} />
					))}
				</Tabs>
			</Box>
			{Object.keys(pages).map((catalogName, i) => (
				<CustomTabPanel
					value={value}
					index={i}
					key={catalogName}
					pages={pages}
					catalogName={catalogName}
					setLoading={setLoading}
				/>
			))}
		</Box>
	);
}
