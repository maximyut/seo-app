/* eslint-disable react/prop-types */
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BasicTable from "./BasicTable";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
			style={{}}
		>
			{value === index && <Box  sx={{ p: 2 }}>{children}</Box>}
		</div>
	);
}

CustomTabPanel.propTypes = {
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function BasicTabs({ pages }) {
	const [value, setValue] = React.useState(0);

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
				<CustomTabPanel value={value} index={i} key={catalogName}>
					<BasicTable catalog={pages[catalogName]} pageName={catalogName} />
				</CustomTabPanel>
			))}
		</Box>
	);
}
