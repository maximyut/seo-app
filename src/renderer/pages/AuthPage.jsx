import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../firebase/firebase";

export default function AuthPage() {
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({ email: "", password: "" });

	const handleCreateAccount = async () => {
		try {
			setLoading(true);
			const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
			await setDoc(doc(db, "users", userCredential.user.uid), {
				XML: {
					userID: "",
					API_KEY: "",
				},
			});
			await setDoc(doc(db, "users", userCredential.user.uid, "private", "premium"), {
				isPremium: false,
			});
		} catch (error) {
			if (error.code === "auth/weak-password") {
				setErrorMessage(
					"Этот пароль слишком слаб.Пожалуйста, попробуйте более безопасный пароль по крайней мере с 6 символами.",
				);
			} else if (error.code === "auth/invalid-email") {
				setErrorMessage(
					"Этот Email не действителен. Пожалуйста, попробуйте действительный адрес электронной почты.",
				);
			} else if (error.code === "auth/operation-not-allowed") {
				setErrorMessage(
					"Вход пароля не был включен. Если вы Dev, обязательно включите его в вашу консоли Firebase.",
				);
			} else if (error.code === "auth/email-already-in-use") {
				setErrorMessage("Этот Email уже используется.");
			} else {
				setErrorMessage(error.message);
			}
			console.log(error);
		}
		setLoading(false);
	};

	const handleSignIn = async () => {
		try {
			setLoading(true);
			const user = await signInWithEmailAndPassword(auth, data.email, data.password);
			const docRef = doc(db, "users", user.user.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				window.electron.store.set("XML", docSnap.data().XML);
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			switch (error.code) {
				case "auth/missing-password":
					setErrorMessage("Введите пароль.");
					break;
				case "auth/invalid-email":
					setErrorMessage("Email некорректный.");
					break;
				default:
					setErrorMessage(error.message);
					break;
			}
		}
		setLoading(false);
	};

	if (loading) {
		return <CircularProgress color="inherit" />;
	}

	return (
		<Stack>
			<TextField
				// error={inputError}
				// helperText={inputError ? "Некорректный домен" : null}
				variant="standard"
				label="Email"
				value={data.email}
				size="small"
				onChange={(event) => {
					setData({ ...data, email: event.target.value });
				}}
			/>
			<TextField
				// error={inputError}
				// helperText={inputError ? "Некорректный домен" : null}
				variant="standard"
				label="Пароль"
				value={data.password}
				size="small"
				onChange={(event) => {
					setData({ ...data, password: event.target.value });
				}}
			/>
			<Button onClick={handleSignIn}>Войти в аккаунт</Button>

			<Button onClick={handleCreateAccount}>Создать аккаунт</Button>
			{errorMessage}
		</Stack>
	);
}
