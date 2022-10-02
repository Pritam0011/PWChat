const socket = io();
let cname;
var did = "";

let textarea = document.querySelector("#messageInp");
let msga = document.querySelector(".container");
let subBtn = document.querySelector(".bow");
var audio = new Audio("/ring.mp3");
var audio2 = new Audio("/join.mp3");
var audio3 = new Audio("/left2.wav");

const scrollTB = () => {
	msga.scrollTop = msga.scrollHeight;
};

do {
	cname = prompt("Enter your name:");
} while (!cname);
cname = cname.charAt(0).toUpperCase() + cname.slice(1);
funfdid();
// console.log(did);

let nuj = { cn: cname, did: did };
socket.emit("new-user-joined", nuj);
const appendNew = (message) => {
	const messageEle = document.createElement("div");
	messageEle.innerHTML = `<div><b>${message}</b></div>`;
	messageEle.classList.add("join-chat");
	msga.append(messageEle);
};
socket.on("user-joined", (data) => {
	audio2.play();
	appendNew(`${data} joined the chat...`);
});
socket.on("left", (data) => {
	audio3.play();
	appendNew(`${data} left the chat...`);
});

subBtn.addEventListener("click", (e) => {
	e.preventDefault();
	let tv = textarea.value;
	if (tv != "") {
		sendMessage(tv);
	}
});

function sendMessage(mess) {
	let msg = {
		user: cname,
		message: mess.trim(),
	};
	//   append message
	appendMsg(msg, "outgoing");
	textarea.value = "";
	scrollTB();

	//   send to socket
	socket.emit("message", msg);
}

function appendMsg(msg, typee) {
	let mainDiv = document.createElement("div");
	let type = typee;
	mainDiv.classList.add(type, "message");

	let html = ` <b>${msg.user}</b><br />&nbsp;${msg.message}</div> `;
	mainDiv.innerHTML = html;
	msga.appendChild(mainDiv);
}

// receive messages
/* Listening for a message from the server. */
socket.on("message", (msg) => {
	appendMsg(msg, "incoming");
	audio.play();
	scrollTB();
});

//did
function funfdid() {
	"use strict";

	var module = {
		options: [],
		header: [
			navigator.platform,
			navigator.userAgent,
			navigator.appVersion,
			navigator.vendor,
			window.opera,
		],
		dataos: [
			{ name: "Windows Phone", value: "Windows Phone", version: "OS" },
			{ name: "Windows", value: "Win", version: "NT" },
			{ name: "iPhone", value: "iPhone", version: "OS" },
			{ name: "iPad", value: "iPad", version: "OS" },
			{ name: "Kindle", value: "Silk", version: "Silk" },
			{ name: "Android", value: "Android", version: "Android" },
			{ name: "PlayBook", value: "PlayBook", version: "OS" },
			{ name: "BlackBerry", value: "BlackBerry", version: "/" },
			{ name: "Macintosh", value: "Mac", version: "OS X" },
			{ name: "Linux", value: "Linux", version: "rv" },
			{ name: "Palm", value: "Palm", version: "PalmOS" },
		],
		databrowser: [
			{ name: "Chrome", value: "Chrome", version: "Chrome" },
			{ name: "Firefox", value: "Firefox", version: "Firefox" },
			{ name: "Safari", value: "Safari", version: "Version" },
			{ name: "Internet Explorer", value: "MSIE", version: "MSIE" },
			{ name: "Opera", value: "Opera", version: "Opera" },
			{ name: "BlackBerry", value: "CLDC", version: "CLDC" },
			{ name: "Mozilla", value: "Mozilla", version: "Mozilla" },
		],
		init: function () {
			var agent = this.header.join(" "),
				os = this.matchItem(agent, this.dataos),
				browser = this.matchItem(agent, this.databrowser);

			return { os: os, browser: browser };
		},
		matchItem: function (string, data) {
			var i = 0,
				j = 0,
				html = "",
				regex,
				regexv,
				match,
				matches,
				version;

			for (i = 0; i < data.length; i += 1) {
				regex = new RegExp(data[i].value, "i");
				match = regex.test(string);
				if (match) {
					regexv = new RegExp(data[i].version + "[- /:;]([\\d._]+)", "i");
					matches = string.match(regexv);
					version = "";
					if (matches) {
						if (matches[1]) {
							matches = matches[1];
						}
					}
					if (matches) {
						matches = matches.split(/[._]+/);
						for (j = 0; j < matches.length; j += 1) {
							if (j === 0) {
								version += matches[j] + ".";
							} else {
								version += matches[j];
							}
						}
					} else {
						version = "0";
					}
					return {
						name: data[i].name,
						version: parseFloat(version),
					};
				}
			}
			return { name: "unknown", version: 0 };
		},
	};

	var e = module.init(),
		debug = "";

	debug += "os.name = " + e.os.name + "\n";
	debug += "os.version = " + e.os.version + "\n";
	debug += "browser.name = " + e.browser.name + "\n";
	debug += "browser.version = " + e.browser.version + "\n";

	debug += "\n";
	debug += "navigator.userAgent = " + navigator.userAgent + "\n";
	debug += "navigator.appVersion = " + navigator.appVersion + "\n";
	debug += "navigator.platform = " + navigator.platform + "\n";
	debug += "navigator.vendor = " + navigator.vendor + "\n";

	did = debug;
	// console.log(debug);
}
