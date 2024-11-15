import { Stack, Typography } from "@mui/material";
import FeedBackForm from "../Components/FeedBackForm";

export default function HelpPage() {
	return (
		<Stack spacing={2}>
			<Typography variant="h3">Помощь</Typography>

			<Stack spacing={1}>
				<Typography variant="h5"> О программе </Typography>
				<Typography variant="body1">Данная программа предназначена для парсинга сайтов</Typography>
			</Stack>
			<FeedBackForm />
		</Stack>
	);
}
