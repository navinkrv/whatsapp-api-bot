const express = require("express");
const qrcode = require("qrcode-terminal");

const { Client } = require("whatsapp-web.js");

const app = express();
const client = new Client();
let qrCode;
client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
	// console.log(qr);
	qrCode = qr;
});

client.on("ready", () => {
	console.log("Client is ready!");
});

client.initialize();

// API

app.get("/login", (req, res) => {
	if (qrCode) {
		res.send(qrCode);
	} else {
		res.send("please wait");
	}
	// console.log(qrCode);
});

app.get("/send/:num/:text", (req, res) => {
	// Number where you want to send the message.
	const number = req.params.num;

	// Your message.
	const text = req.params.text;

	// Getting chatId from the number.
	// we have to delete "+" from the beginning and add "@c.us" at the end of the number.
	const chatId = number + "@c.us";

	// Sending message.
	if (client.info === undefined) {
		res.send("the system is not ready yet");
	} else {
		if (chatId && text) {
			client.sendMessage(chatId, text);
			res.json({
				msg: "sent",
				data: chatId + " " + text
			});
		}
	}
});

app.listen(5000, () => {
	console.log("server running at port 5000");
});
