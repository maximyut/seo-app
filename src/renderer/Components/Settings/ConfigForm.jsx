/* eslint-disable react/prop-types */

import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import { useCallback, useEffect, useState } from "react";

export default function ConfigForm() {
	const [config, setConfig] = useState(window.electron.store.get("config"));

	const handleConfigChange = useCallback(
		(newConfig) => {
			setConfig({
				...config,
				...newConfig,
			});
		},
		[config, setConfig],
	);
	const handleChange = (event) => {
		handleConfigChange({
			[event.target.name]: event.target.checked,
		});
	};

	useEffect(() => {
		if (config.page3 && !config.page2) {
			handleConfigChange({
				page2: true,
			});
		}
		window.electron.store.set("config", config);
	}, [config, handleConfigChange]);

	return (
		<Box sx={{ display: "flex" }}>
			<FormControl component="fieldset" variant="standard">
				<FormLabel component="legend">Выберите нужные вам параметры</FormLabel>
				<FormGroup>
					{Object.keys(config).map((key) => {
						if (typeof config[key] === "boolean") {
							let label,
								disabled,
								helperText = "*";
							if (key === "breadcrumbs") {
								label = "Хлебные крошки";
							} else {
								label = key;
							}

							switch (key) {
								case "h1":
									helperText += "Сбор тега H1.";
									break;
								case "title":
									helperText += "Сбор заголовка страницы.";
									break;
								case "description":
									helperText += "Сбор описания страницы.";
									break;
								case "breadcrumbs":
									helperText += `Сбор навигации ("хлебных крошек") со страницы при возможности. `;
									break;
								default:
									label = key;
									helperText = "";
							}

							return (
								<div key={key}>
									<FormControlLabel
										control={
											<Checkbox
												checked={config[key]}
												onChange={handleChange}
												name={key}
												disabled={disabled}
											/>
										}
										label={label}
									/>
									<FormHelperText sx={{ mr: 0 }} variant="outlined">
										{helperText}
									</FormHelperText>
								</div>
							);
						}
						return null;
					})}
				</FormGroup>
			</FormControl>
		</Box>
	);
}
