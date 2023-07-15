import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GetServerSideProps } from "next";
import { type } from "os";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const containerStyle = {
  width: "800px",
  height: "400px",
};

const socket = io("http://localhost:5000");

type prop = {
  lat: number;
  lng: number;
};

type socketDataType = {
  id: String;
  name: String;
  position: {
    lat: number;
    lng: number;
  };
};

const MyComponent = ({ lat, lng }: prop) => {
  let zoom;

  const [name, setName] = useState("");
  const [socketData, setSocketData] = useState<socketDataType>({
    id: "",
    name: "noName",
    position: { lat: 0, lng: 0 },
  });
  console.log("hoge", socketData);

  //位置情報の初期化
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setSocketData({
        ...socketData,
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      }),
        () => console.log("error");
    });

    socket.on("init", (initId: String) => {
      const storeData: socketDataType = {
        id: initId,
        name: socketData.name,
        position: {
          lat: socketData.position.lat,
          lng: socketData.position.lng,
        },
      };

      console.log("storeData");
      console.log(storeData);
      setSocketData(storeData);
      socket.emitWithAck("init_res", storeData);
    });
  }, [socketData]);

  useEffect(() => {
    socket.emitWithAck("changeData", socketData);
  }, [socketData]);

  const handleName = () => {
    if (name !== "") {
      setSocketData({ ...socketData, name: name });
      setName("");
      console.log("move");
    }
  };

  const getPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setSocketData({
        id: socketData.id,
        name: socketData.name,
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      }),
        () => console.log("error");
    });
    console.log("getPosition");
    console.log(socketData);
  };

  const sendPosition = () => {
    socket.emitWithAck("send_position", socketData);
    console.log(socketData);
    console.log("送信");
  };

  // const startSendPosition = () => {
  //   console.log("start");
  //   setInterval(sendPosition, 5000);
  // }

  if (process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY !== undefined) {
    const API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    return (
      <div>
        <div id="name">{socketData.name}</div>
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={() => handleName()}>送信</button>
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={socketData.position}
            zoom={20}
          ></GoogleMap>
        </LoadScript>
        <button onClick={getPosition}>位置情報取得</button>
        <br />
        {/* <button onClick={startSendPosition}>位置情報送信を開始</button> */}
      </div>
    );
  }
};

export default MyComponent;

// export const getServerSideProps: GetServerSideProps = async () => {
//   let myPosition: prop = {
//     lat: 0,
//     lng: 0
//   };
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       myPosition.lat = position.coords.latitude;
//       myPosition.lng = position.coords.longitude;
//     }, () => console.log("error"));

//   return {
//     props: myPosition,
//   };
// };
