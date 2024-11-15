import {
	Backdrop,
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	FormHelperText,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { useState } from "react";
import AlertMessage from "./UI/AlertMessage";
import { load } from "cheerio";

const EmailIput = ({ user }) => {
	const [value, setValue] = useState(user?.email);

	console.log("render email");
	return (
		<TextField
			sx={{ flex: 1 }}
			id="outlined-basic"
			label="Email"
			variant="outlined"
			name="email"
			defaultValue={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
};

const SubjectInput = () => {
	const [value, setValue] = useState("");

	return (
		<TextField
			sx={{ flex: 1 }}
			id="outlined-basic"
			label="Тема"
			variant="outlined"
			name="subject"
			defaultValue={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
};

const MessageInput = () => {
	const [value, setValue] = useState("");

	return (
		<TextField
			multiline
			name="message"
			id="outlined-basic"
			label="Сообщение"
			variant="outlined"
			minRows={5}
			fullWidth
			defaultValue={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
};

export default function FeedBackForm() {
	const [user, loadingUser, error] = useAuthState(auth);
	const [alertData, setAlertData] = useState({ open: false, message: "", type: "error" });
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		setLoading(true);

		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const log = formData.get("log") === "on" ? window.electron.store.getAll() : null;

		const mail = {
			email: formData.get("email"),
			subject: formData.get("subject"),
			message: formData.get("message"),
			log,
		};

		const response = await window.electron.sendMail(mail);
		if (response.response) {
			setAlertData((data) => {
				return { ...data, open: true, message: "Письмо успешно отправлено", type: "success" };
			});
		} else {
			setAlertData((data) => {
				return { ...data, open: true, message: "Письмо не отправлено", type: "error" };
			});
		}

		setLoading(false);
	};
	console.log(loading);
	if (loading || loadingUser) {
		return (
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		);
	}
	console.log("render");
	return (
		<Stack spacing={1}>
			<Typography variant="h5"> Обратная связь </Typography>
			<FormHelperText id="my-helper-text">При возникновении ошибок вы можете написать нам.</FormHelperText>

			<form onSubmit={handleSubmit}>
				<Stack spacing={2} direction="column" sx={{ maxWidth: 600 }}>
					<Stack direction="row" spacing={2}>
						<EmailIput user={user} />
						<SubjectInput />
					</Stack>
					<MessageInput />
					<FormControlLabel control={<Checkbox name="log" />} label="Отправить лог разработчику" />
					<Button type="submit" variant="contained" disabled={loading}>
						Отправить
					</Button>
				</Stack>
			</form>
			<AlertMessage handleClose={() => setAlertData((data) => ({ ...data, open: false }))} data={alertData} />
		</Stack>
	);
}
