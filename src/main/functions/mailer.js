// electron.js
import nodemailer from "nodemailer";

async function sendMail(mail) {
	const { email, subject, message, log } = mail;

	const transporter = nodemailer.createTransport({
		host: "smtp.mail.ru",
		port: 465,
		secure: true,
		auth: {
			user: "seo.app@mail.ru",
			pass: "0xzF4dETmnLsrcG0uXTE",
		},
	});

	const mailOptions = {
		from: "seo.app@mail.ru",
		to: "seo.app@mail.ru",
		subject: `Письмо из seo.app от ${email}`,
		html: `<div><p>Пользователь: ${email}</p><p>Тема: ${subject}</p><p>Сообщение: ${message}</p><p>Лог: <br /> <pre>${JSON.stringify(log, null, 2)}</pre></p> </div>`,
	};
	console.log("send");
	const response = await transporter.sendMail(mailOptions);
	return response;
}


export default sendMail;
