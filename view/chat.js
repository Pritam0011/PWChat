const socket = io();
let cname;

let textarea = document.querySelector("#messageInp");
let msga = document.querySelector(".container");
let subBtn = document.querySelector(".bow");
var audio = new Audio("/ring.mp3");

const scrollTB = () => {
  msga.scrollTop = msga.scrollHeight;
};

do {
  cname = prompt("Enter your name:");
} while (!cname);
cname = cname.charAt(0).toUpperCase() + cname.slice(1);

socket.emit("new-user-joined", cname);
const appendNew = (message) => {
  const messageEle = document.createElement("div");
  messageEle.innerHTML = `<div><b>${message}</b></div>`;
  messageEle.classList.add("join-chat");
  msga.append(messageEle);
};
socket.on("user-joined", (data) => {
  appendNew(`${data} joined the chat...`);
});
socket.on("left", (data) => {
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
