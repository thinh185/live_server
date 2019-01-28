const io = require("socket.io-client"),
ioClient = io.connect("http://localhost:3333");
ioClient.emit('testconnect', {data: "data"})

ioClient.on("testconnect", (msg) => {
  console.log(msg)
});