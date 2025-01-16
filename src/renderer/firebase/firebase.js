import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const firebaseConfig = window.electron.store.get("firebaseConfig");

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/auth.user
		const { uid } = user;
		const profileRef = doc(db, "users", uid);

		const docSnap = await getDoc(profileRef);

		if (docSnap.exists()) {
			window.electron.store.set("user", docSnap.data().API);
		}
	} else {
		// User is signed out
		// ...
	}
});

export { auth, app, db };
