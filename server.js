const express = require("express");
const { Socket } = require("socket.io");
const app = express();
/* Creating a server using the express app. */
const http = require("http").createServer(app);

/* Setting the port to 4000 if the environment variable PORT is not set. */
const port = process.env.PORT || 4000;

http.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

/* Telling express to use the view folder as the static folder. */
app.use(express.static(__dirname + "/view"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//socket.io
const users = {};

/* Creating a new instance of socket.io by passing the http object. */
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected Successfully...");

  socket.on("new-user-joined", (cname) => {
    console.log("New User ", cname);
    users[socket.id] = cname;
    socket.broadcast.emit("user-joined", cname);
  });

  socket.on("disconnect", (message) => {
    console.log(users[socket.id], " left");
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});
