//* Express Server
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const server = app.listen(8080, () =>
  console.log("listening on http://localhost:8080")
);

//* Sockets
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

//* File System Module
const fs = require("fs");
path = "./sample.log";

fs.watchFile(path, (curr, prev) => {
  fs.open(path, "r", function (error, fd) {
    fs.read(fd, { position: prev.size }, (err, data, buffer) => {
      io.emit("logs", { logs: buffer.toString() });
    });
  });
});

io.on("connection", (socket) => {
  console.log("Connected");
});

app.get("/log", (req, res) => {
  fs.stat(path, (err, stats) => {
    fs.open(path, "r", function (error, fd) {
      var buffer = new Buffer.alloc(stats.size);
      fs.read(fd, (err, data, buffer) => {
        var string = buffer.toString("utf8", 0, stats.size);
        var logs = string.split("\n").slice(-10);
        res.send(logs);
      });
    });
  });
});
