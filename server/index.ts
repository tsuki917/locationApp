const express = require("express");
const app = express();

import { collection, addDoc ,setDoc,doc,getDocs,deleteDoc} from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: "locationapp-962e8.firebaseapp.com",
    projectId: "locationapp-962e8",
    storageBucket: "locationapp-962e8.appspot.com",
    messagingSenderId: "828032903544",
    appId: "1:828032903544:web:7b9dd99a018840a474c08d",
    measurementId: "G-4Y438XPSP0"
};
// Initialize Firebase
const appFire = initializeApp(firebaseConfig);
const db = getFirestore(appFire);





import http from "http";

// import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";



const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
      }
});
type socketDataType = {
    id: string,
    roomId:string,
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
    const socket_id = socket.id;
    let roomId_stg:string;
    // socket.emit('newClient',socketData_array);
    // socketData_array.push();
    
    
    
    socket.emit("init",socket_id);
    socket.on("init_res",(socketData:socketDataType)=>{
        if(socketData.roomId!==undefined){
            socket.join(socketData.roomId);
            roomId_stg = socketData.roomId;
            socket.emit("newClient",getRoomCollection(socketData));
            // setRoomCollection(socketData.roomId,socket_id,socketData);
            console.log(socketData.roomId+"に入室しました");
        }else{
            console.log("roomIdがundefined");
        }
    });
    socket.on("joinRoom",(roomId)=>{
        socket.join(roomId);
    });


    // socket.on("reqIntervalData",(id:string)=>{
    //     console.log(id);
    //     socket.to(id).emit("resIntervalData",socketData_array);
    //     console.log("res")
    // })

    

    

    socket.on("changeData",(newData:socketDataType)=>{
        if(newData.id!==''){
            setRoomCollection(newData);
            socket.to(newData.roomId).emit("send_AllClientData");
            
            
        }else{
            socket.emit("init",socket_id);
            console.log("false");
        }




        // if(newData.id!==''){
        //     searchId(newData);
        //     console.log("change");
        //     socket.to(newData.roomId).emit("send_AllClientData",socketData_array);
        // }else{
        //     socket.emit("init",socket_id);
        //     console.log("false");
        // }
    });
    socket.on("disconnect",(data)=>{
        // for(let i=0;i<socketData_array.length;i++){
        //     if(socketData_array[i].id===socket_id){
        //         socketData_array.splice(i,1);
        //         console.log(socketData_array);
        //     }
        // }
        deleteClientData(socket_id,roomId_stg)
    });

});

server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});


// function searchId(insertData:socketDataType){
//     for(let i = 0;i<socketData_array.length;i++){
//         if(socketData_array[i].id===insertData.id){
//             socketData_array[i].name=insertData.name;
//             socketData_array[i].position.lat=insertData.position.lat;
//             socketData_array[i].position.lng=insertData.position.lng;
//             socketData_array[i].selfIntroduce=insertData.selfIntroduce;
//             socketData_array[i].roomId = insertData.roomId;
//             console.log(socketData_array[i]);

//         }
//     }
// }
const data1 = {
    name:'noName',
    position:{lat:0,lng:0},
    id:"mongo",
    roomId:"room1",
    selfIntroduce:'よろしくお願いします！'
}
const data2 = {
    name:'noName',
    position:{lat:0,lng:0},
    id:"firebase",
    roomId:"room1",
    selfIntroduce:'よろしくお願いします！'
}
const data3 = {
    name:'noName',
    position:{lat:0,lng:0},
    id:"SQlite",
    roomId:"room1",
    selfIntroduce:'よろしくお願いします！'
}

// setRoomCollection(data3);
const allClients = getRoomCollection(data1).then((data1)=>console.log(data1));
console.log(allClients);
// deleteClientData(data1);

/*
ClientsRooms
    roomId
        [roomId]
            [socketId]
                [Data]



*/

//クライアントデータを追加する
async function setRoomCollection(socketData:socketDataType){
    console.log("docTest");
    const room = doc(db,"ClientsRooms","roomId",socketData.roomId,socketData.id);
    
    try {
        await setDoc(room,socketData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}
//roomIdの部屋の全てのデータを取得する
async function getRoomCollection(data:socketDataType){
    const allClientsData : socketDataType[] = [];
    const q =collection(db,"ClientsRooms","roomId",data.roomId);
    const querySnap = await getDocs(q);
    
    querySnap.forEach(ele =>{
        const domData :socketDataType={
            name:'',
            position:{lat:0,lng:0},
            id:"",
            roomId:"",
            selfIntroduce:''
        }

        
        const gotData = ele.data();
        domData.id = gotData.id;
        domData.name  = gotData.name;
        domData.position  = gotData.position;
        domData.roomId = gotData.roomId;
        domData.selfIntroduce = gotData.selfIntroduce;
            
        allClientsData.push(domData);   

        
    });
    return allClientsData;
    
}

//dbから特定のクライアントデータを削除する
async function deleteClientData(socket_id:string,roomId:string){
    
    await deleteDoc(doc(db,"ClientsRooms","roomId",roomId,socket_id));


}