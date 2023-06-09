const express = require("express");
const app = express();

import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});
type positionData = {
    id:String,
    name: String,
    position: {
        lat: number,
        lng: number
    }
}
const PORT = 5000;
const socketData_array: positionData[] = [];
io.on("connection", (socket) => {
    console.log("クライアントと接続");
    const socket_id = socket.id;
    
    socket.emit("init",socket_id);
    socket.on("init_res",(init_res_data)=>{
        socketData_array.push(init_res_data);
    });

    socket.on("send_position", (data) => {
        console.log(data);
        // let targetIndex = -1;
        // console.log("send_position");
        // socketData_array.forEach((element,index) => {
        //         if(element.id===data.id){
        //             targetIndex=index;
        //         }
        // });
        // if(targetIndex!==-1){
        //     socketData_array[targetIndex]=data;
        //     console.log(socketData_array[targetIndex]);
        // }

    });

    socket.on("changeData",(newData)=>{
        console.log("newData");
        console.log(newData);
    });

})

server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})
