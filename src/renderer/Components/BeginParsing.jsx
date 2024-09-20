import { Button, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ProgressBar from "./UI/ProgressBar";

// eslint-disable-next-line react/prop-types
export default function BeginParsing({ continueParsing }) {
	const [fileDir, setFileDir] = useState("");
	const [current, setCurrent] = useState(0);
	const [total, setTotal] = useState();
	const [parsing, setParsing] = useState(false);

	const openFile = async () => {
		const dirPath = await window.electron.startParsing();
		setParsing(true);
		setFileDir(dirPath);
	};
	if (parsing) {
		window.electron.getProgress((event, data) => {
			setCurrent(data.current);

			if (!total) {
				setTotal(data.total);
			}
		});
	}

	useEffect(() => {
		if (continueParsing) {
			setParsing(true);
		}
	}, [continueParsing]);

	const percentage = useMemo(() => {
		// Вычисление дорогостоящей функции
		const result = Number(Number((current / total) * 100).toFixed(1));

		if (result && !Number.isNaN(result)) {
			return result;
		}
		return 0.0;
	}, [current, total]);
	const pauseParsing = () => {
		window.electron.pauseParsing();
		setParsing(false);
	};
	const stopParsing = () => {
		window.electron.stopParsing();
		setParsing(false);
	};

	return (
		<Stack spacing={4}>
			<Stack spacing={2}>
				<Stack direction="row" spacing={2} alignItems="center">
					{parsing ? (
						<>
							<Button variant="contained" onClick={pauseParsing}>
								Приостановить парсинг
							</Button>
							<Button variant="contained" onClick={stopParsing}>
								Окончить парсинг
							</Button>
						</>
					) : (
						<Button variant="contained" onClick={openFile}>
							Выбрать файл и начать парсинг
						</Button>
					)}
				</Stack>
				<div>
					Путь до файла: <strong>{fileDir}</strong>
				</div>
			</Stack>
			<div>
				Статус парсинга: <strong>{parsing ? "В процессе" : "Не запущен"}</strong>
			</div>
			<ProgressBar current={percentage} />
		</Stack>
	);
}
