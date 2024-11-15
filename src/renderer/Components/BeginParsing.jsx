import { Button, Stack, ButtonGroup } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ProgressBar from "./UI/ProgressBar";
import AlertMessage from "./UI/AlertMessage";

const localizeTime = (time) => {
	const { minutes, seconds } = time;

	const minutesText = {
		минут: [0, 5, 6, 7, 8, 9],
		минуты: [2, 3, 4],
		минута: [1],
	};

	const secondsText = {
		секунд: [0, 5, 6, 7, 8, 9],
		секунды: [2, 3, 4],
		секунда: [1],
	};

	const getLastNumber = (number) => {
		const numberStr = number.toString();
		return Number(numberStr[numberStr.length - 1]);
	};

	const minutesTextKey = Object.keys(minutesText).find((key) => minutesText[key].includes(getLastNumber(minutes)));
	const secondsTextKey = Object.keys(secondsText).find((key) => secondsText[key].includes(getLastNumber(seconds)));

	if (!minutes && !seconds) {
		return `Невозможно определить время`;
	}
	return `${minutes} ${minutesTextKey} и ${seconds} ${secondsTextKey}`;
};

export default function BeginParsing({ continueParsing }) {
	const [fileDir, setFileDir] = useState("");
	const [current, setCurrent] = useState(0);
	const [total, setTotal] = useState(0);
	const [alertData, setAlertData] = useState({});

	const [startTime, setStartTime] = useState(0);
	// const [currentTime, setCurrentTime] = useState(0);
	const [waitingTime, setWaitingTime] = useState({
		minutes: 0,
		seconds: 0,
	});

	const [parsing, setParsing] = useState(false);

	const handleOpenNewFile = async () => {
		const filePath = await window.electron.startParsing();
		if (!filePath) return;
		setParsing(true);
		setStartTime(Date.now());
		setFileDir(filePath);
	};

	const handleOpenOldFile = async () => {
		const response = await window.electron.openOldFile();
		if (!response) {
			return;
		}
		if (!response?.filePath && response?.error) {
			setAlertData((data) => {
				return { ...data, open: true, message: response.error.message, type: "error" };
			});
		}

		setFileDir(response.filePath);
	};

	window.electron.getProgress((event, data) => {
		setCurrent(data.current);

		if (!total) {
			setTotal(data.total);
		}
	});

	useEffect(() => {
		if (continueParsing) {
			setParsing(true);
		}
	}, [continueParsing]);

	useEffect(() => {
		const left = total - current;
		const currentTime = Date.now() - startTime;

		const averageSpeed = ((currentTime / current) * left) / 1000;

		const minutes = Math.floor(averageSpeed / 60);
		const seconds = Math.floor(averageSpeed % 60);
		if (minutes && seconds) {
			setWaitingTime({
				minutes,
				seconds,
			});
		}
	}, [current, total, startTime, setWaitingTime]);

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

	const timeText = useMemo(() => {
		return localizeTime(waitingTime);
	}, [waitingTime]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setAlertData((data) => {
			return { ...data, open: false };
		});
	};

	return (
		<Stack spacing={4}>
			<Stack spacing={2}>
				<Stack direction="row" spacing={2} alignItems="center">
					{parsing ? (
						<>
							{/* <Button variant="contained" onClick={pauseParsing}>
								Приостановить парсинг
							</Button> */}
							<Button variant="contained" onClick={stopParsing}>
								Окончить парсинг
							</Button>
						</>
					) : (
						<>
							<AlertMessage handleClose={handleClose} data={alertData} />
							<ButtonGroup variant="contained" spacing={2}>
								<Button variant="contained" onClick={handleOpenNewFile}>
									Выбрать файл и начать парсинг
								</Button>
								<Button variant="contained" onClick={handleOpenOldFile}>
									Выбрать готовый файл
								</Button>
							</ButtonGroup>
						</>
					)}
				</Stack>
				<div>
					Путь до файла: <strong>{fileDir}</strong>
				</div>
			</Stack>
			<div>
				<div>
					Статус парсинга: <strong>{parsing ? "В процессе" : "Не запущен"}</strong>
				</div>
				<div>
					Примерное время ожидания:
					<strong> {timeText}</strong>
				</div>
			</div>
			<ProgressBar current={percentage} />
		</Stack>
	);
}
