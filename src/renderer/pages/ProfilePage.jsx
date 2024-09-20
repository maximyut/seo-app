import { doc, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import TelegramIcon from "@mui/icons-material/Telegram";

export default function ProfilePage() {

	const [user, loadingUser, errorUser] = useAuthState(auth);
	const profileRef = doc(db, "users", user.uid);
	const premiumRef = doc(db, "users", user.uid, "private", "premium");
	const [profileData, loadingProfile, errorProfile] = useDocument(profileRef);
	const [premiumData, loadingPremium, errorPremium] = useDocument(premiumRef);
	const [XML, setXML] = useState({ userID: "", API_KEY: "" });
	const handleChange = (event) => {
		setXML({
			...XML,
			[event.target.name]: event.target.value,
		});
	};
	const handleSave = async () => {
		window.electron.store.set("XML", XML);
		await setDoc(profileRef, { XML }, { merge: true });
	};
	useEffect(() => {
		if (profileData) {
			setXML(profileData.data().XML);
			window.electron.store.set("XML", profileData.data().XML);
		}
	}, [profileData]);
	if (loadingProfile || loadingPremium) {
		return <div>Loading data...</div>;
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
			<Stack direction="column" spacing={2}>
				{Object.keys(XML).map((key) => (
					<TextField
						key={key}
						variant="standard"
						label={key}
						name={key}
						value={XML[key]}
						onChange={handleChange}
					/>
				))}
				<Button variant="contained" onClick={handleSave}>
					Сохранить настройки
				</Button>
			</Stack>

			{premiumData?.data()?.isPremium ? (
				<div>Ваша подписка закончится {premiumData.data().end.toDate().toLocaleString()}</div>
			) : (
				<div>Ваша подписка неактивна</div>
			)}
		</Stack>
	);
}
