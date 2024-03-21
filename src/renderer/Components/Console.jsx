import { useState } from "react";

export default function ConsoleBlock() {
	const [data, setData] = useState([]);
	window.electron.getInfo((event, info) => {
		const obj = {
			date: new Date(),
			milliDate: Date.now(),
			text: info,
		};
		setData([...data, obj]);
	});

	return (
		<>
			{data.map(({ date, milliDate, text }) => {
				const textClass = text.includes("Error") ? "text error" : "text";
				return (
					<div className="console-string" key={milliDate + text}>
						<div className="date">{date.toLocaleString()}:</div>
						<div className={textClass}>{text}</div>
					</div>
				);
			})}
		</>
	);
}
