const express = require("express");
const app =express();

const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");

const io = new Server(server);

const PORT = 5000;

io.on("connection",(socket)=>{
    console.log("クライアントと接続");
    socket.on("get_position")
})
