const  express = require("express");
const app = express();

import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
    },
});

const PORT = 5000;

io.on("connection", (socket) => {
    console.log("クライアントと接続");

})

server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})
