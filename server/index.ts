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
type socketDataType = {
    id: string,
    name: string,
    selfIntroduce:string,
    position: {
      lat: number,
      lng: number
    }
    
  }
const PORT = 5000;
const socketData_array: socketDataType[] = [];
io.on("connection", (socket) => {
    console.log("クライアントと接続");
    const socket_id = socket.id;
    socket.emit('newClient',socketData_array);
    socketData_array.push({name:'noName',position:{lat:0,lng:0},id:socket_id,selfIntroduce:'よろしくお願いします！'});
    socket.emit("init",socket_id);
    socket.on("init_res",(init_res_data:socketDataType)=>{
        console.log("successfully send id");
    });


    // socket.on("reqIntervalData",(id:string)=>{
    //     console.log(id);
    //     socket.to(id).emit("resIntervalData",socketData_array);
    //     console.log("res")
    // })

    

    

    socket.on("changeData",(newData:socketDataType)=>{
        if(newData.id!==''){
            searchId(newData);
            console.log("change");
            socket.emit("send_AllClientData",socketData_array);
        }else{
            socket.emit("init",socket_id);
            console.log("false");
        }
    });
    socket.on("disconnect",()=>{
        console.log(socketData_array);
        for(let i=0;i<socketData_array.length;i++){
            if(socketData_array[i].id===socket_id){
                socketData_array.splice(i,1);
                console.log(socketData_array);
            }
        }
        console.log(socket_id);
    });

});

server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});


function searchId(insertData:socketDataType){
    for(let i = 0;i<socketData_array.length;i++){
        if(socketData_array[i].id===insertData.id){
            socketData_array[i].name=insertData.name;
            socketData_array[i].position.lat=insertData.position.lat;
            socketData_array[i].position.lng=insertData.position.lng;
            socketData_array[i].selfIntroduce=insertData.selfIntroduce;

            console.log(socketData_array[i]);

        }
    }
}