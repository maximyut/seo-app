import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function AlertMessage({ handleClose, data }) {
	const { open, message, type } = data;
	return (
		<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
			<Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
}
