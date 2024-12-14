import { Button, Checkbox, FormControlLabel, FormHelperText, Stack, TextField, Typography } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { auth } from "../firebase/firebase";
import AlertMessage from "./UI/AlertMessage";
import LoadingBackdrop from "./UI/LoadingBackdrop";

const EmailInput = ({ user }) => {
	const [value, setValue] = useState(user?.email);

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

	const handleSubmit = async (event) => {
		setLoading(true);

		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const log = formData.get("log") === "on" ? window.electron.store.getStore() : null;

		const mail = {
			email: formData.get("email"),
			subject: formData.get("subject"),
			message: formData.get("message"),
			log,
		};

		try {
			await window.electron.sendMail(mail);
			setAlertData((data) => {
				return { ...data, open: true, message: "Письмо успешно отправлено", type: "success" };
			});
		} catch (e) {
			setAlertData((data) => {
				return { ...data, open: true, message: `Письмо не отправлено. ${e.message}`, type: "error" };
			});
		} finally {
			setLoading(false);
		}
	};

	if (loading || loadingUser) {
		return <LoadingBackdrop loading={loading} />;
	}

	return (
		<Stack spacing={1}>
			<Typography variant="h5"> Обратная связь </Typography>
			<FormHelperText id="my-helper-text">При возникновении ошибок вы можете написать нам.</FormHelperText>

			<form onSubmit={handleSubmit}>
				<Stack spacing={2} direction="column" sx={{ maxWidth: 600 }}>
					<Stack direction="row" spacing={2}>
						<EmailInput user={user} />
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
