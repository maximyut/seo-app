import { doc, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TelegramIcon from "@mui/icons-material/Telegram";
import { db, auth } from "../firebase/firebase";

export default function ProfilePage() {
	const [user, loadingUser, errorUser] = useAuthState(auth);
	const profileRef = doc(db, "users", user.uid);
	const premiumRef = doc(db, "users", user.uid, "private", "premium");
	const [profileData, loadingProfile, errorProfile] = useDocument(profileRef);
	const [premiumData, loadingPremium, errorPremium] = useDocument(premiumRef);
	const userInfo = window.electron.store.get("user");

	const handleSave = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data = {};
		formData.forEach((value, key) => {
			data[key] = value;
		});

		console.log(data);
		window.electron.store.set("user", data);
		await setDoc(profileRef, { API: data }, { merge: true });
	};

	if (loadingProfile || loadingPremium) {
		return <div>Загрузка данных...</div>;
	}

	if (errorUser || errorProfile || errorPremium) {
		return <div>{errorUser?.message ?? errorProfile?.message ?? errorPremium?.message}</div>;
	}

	if (!premiumData?.data()?.isPremium) {
		return (
			<Stack direction="column" spacing={2}>
				<div>Ваша подписка неактивна</div>
				<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
					<span>Для приобретения подписки напишите в телеграмм </span>
					<a href="https://t.me/+375293115584" aria-label="Telegram">
						<TelegramIcon />
					</a>
				</div>
			</Stack>
		);
	}

	return (
		<Stack direction="column" spacing={4}>
			<form onSubmit={handleSave}>
				<Stack direction="column" spacing={2}>
					{Object.keys(userInfo).map((key) => (
						<TextField key={key} variant="standard" label={key} name={key} defaultValue={userInfo[key]} />
					))}
					<Button variant="contained" type="submit">
						Сохранить настройки
					</Button>
				</Stack>
			</form>

			{premiumData?.data()?.isPremium ? (
				<div>Ваша подписка закончится {premiumData.data().end.toDate().toLocaleString()}</div>
			) : (
				<div>Ваша подписка неактивна</div>
			)}
		</Stack>
	);
}
