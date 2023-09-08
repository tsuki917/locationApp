import express from "express";
const app = express();

import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you
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
  measurementId: "G-4Y438XPSP0",
};
// Initialize Firebase
const appFire = initializeApp(firebaseConfig);
const db = getFirestore(appFire);

import http from "http";

// import http from "http";
const server = http.createServer(app);
import { Server, Socket } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://location-app-566a-client.vercel.app",
    ],
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
});
type socketDataType = {
  id: string;
  roomId: string;
  name: string;
  selfIntroduce: string;
  position: {
    lat: number;
    lng: number;
  };
};
type socketidTOroomIdType = {
  path: string;
  socketId: string;
  roomId: string;
};
const PORT = 5000;
const socketidTOroomId: socketidTOroomIdType[] = [];
io.on("connection", (socket: Socket) => {
  const socket_id = socket.id;
  // socket.emit('newClient',socketData_array);
  // socketData_array.push();

  socket.emit("init", socket_id);
  socket.on("init_res", (socketData: socketDataType) => {
    if (socketData.roomId !== undefined) {
      console.log("socketData.roomId !== undefined");
      socket.join(socketData.roomId);
      console.log(socket_id + "が" + socketData.roomId + "に入室しました");
      socketidTOroomId.push({
        path: socket_id + socketData.roomId,
        socketId: socket_id,
        roomId: socketData.roomId,
      });
      const getData: Promise<socketDataType[]> = getRoomCollection(socketData);
      getData.then((getdata: socketDataType[]) => {
        const getArrayData: socketDataType[] = getdata;
        console.log(Array.isArray(getArrayData), "getArrayData");

        io.to(socketData.roomId).emit("send_AllClientData", getArrayData);
      });
    } else {
      console.log("roomIdがundefined");
    }
  });
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("request_allClientDatas", (socketData: socketDataType) => {
    const getData: Promise<socketDataType[]> = getRoomCollection(socketData);
    getData.then((getdata: socketDataType[]) => {
      const getArrayData: socketDataType[] = getdata;
      console.log(Array.isArray(getArrayData), "getArrayData");
      io.to(socketData.roomId).emit("send_AllClientData", getArrayData);
    });
  });

  socket.on("changeData", (newData: socketDataType) => {
    if (newData.id !== "") {
      setRoomCollection(newData);
      const getData: Promise<socketDataType[]> = getRoomCollection(newData);
      getData.then((getdata: socketDataType[]) => {
        const getArrayData: socketDataType[] = getdata;
        io.to(newData.roomId).emit("send_AllClientData", getArrayData);
      });
    } else {
      socket.emit("init", socket_id);
      console.log("false");
    }
  });
  socket.on("disconnect", () => {
    console.log(socketidTOroomId);
    socketidTOroomId.forEach((data) => {
      if (data.socketId === socket.id) {
        const roomId_stg = data.roomId;
        deleteClientData(socket_id, roomId_stg);
        console.log(socket_id + "が" + roomId_stg + "より退出しました");
      }
    });
  });
});
server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

const data1 = {
  name: "noName",
  position: { lat: 0, lng: 0 },
  id: "mongo",
  roomId: "room1",
  selfIntroduce: "よろしくお願いします！",
};
const data2 = {
  name: "noName",
  position: { lat: 0, lng: 0 },
  id: "firebase",
  roomId: "room1",
  selfIntroduce: "よろしくお願いします！",
};
const data3 = {
  name: "noName",
  position: { lat: 0, lng: 0 },
  id: "SQlite",
  roomId: "room1",
  selfIntroduce: "よろしくお願いします！",
};

/*
ClientsRooms
    roomId
        [roomId]
            [socketId]
                [Data]



*/

//クライアントデータを追加する
async function setRoomCollection(socketData: socketDataType) {
  const room = doc(
    db,
    "ClientsRooms",
    "roomId",
    socketData.roomId,
    socketData.id
  );

  try {
    await setDoc(room, socketData);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
//roomIdの部屋の全てのデータを取得する
async function getRoomCollection(
  data: socketDataType
): Promise<socketDataType[]> {
  const allClientsData: Array<socketDataType> = new Array();
  console.log("test:" + typeof allClientsData);
  const q = collection(db, "ClientsRooms", "roomId", data.roomId);
  const querySnap = await getDocs(q);

  await querySnap.forEach((ele) => {
    const domData: socketDataType = {
      name: "",
      position: { lat: 0, lng: 0 },
      id: "",
      roomId: "",
      selfIntroduce: "",
    };

    const gotData = ele.data();
    domData.id = gotData.id;
    domData.name = gotData.name;
    domData.position.lat = gotData.position.lat;
    domData.position.lng = gotData.position.lng;
    domData.roomId = gotData.roomId;
    domData.selfIntroduce = gotData.selfIntroduce;
    allClientsData.push(domData);
  });
  console.log(
    "Is ClientDatas an array? server" + Array.isArray(allClientsData)
  );
  return allClientsData;
}

//dbから特定のクライアントデータを削除する
async function deleteClientData(socket_id: string, roomId: string) {
  await deleteDoc(doc(db, "ClientsRooms", "roomId", roomId, socket_id));
}
