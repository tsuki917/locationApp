import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { SocketType } from "dgram";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const containerStyle = {
  width: "800px",
  height: "400px",
};


const socket = io("http://localhost:5000");



type prop = {
  lat: number,
  lng: number
}

type socketDataType = {
  id: string,
  name: string,
  position: {
    lat: number,
    lng: number
  }
}

const MyComponent = () => {
  const [name, setName] = useState("");
  const [socketData, setSocketData] = useState<socketDataType>({ id: '',name: "noName", position: {lat:0,lng:0}});
  const [id,setId] = useState<string>('');
  console.log("hoge");
  
  //位置情報の初期化
  useEffect(() => {
    console.log("firstEffect")
    navigator.geolocation.getCurrentPosition((getPositionData) => {
      setSocketData((prevData:socketDataType)=>({
        ...prevData,position:{lat:getPositionData.coords.latitude,lng:getPositionData.coords.longitude}
      })

      
       
      
      )
      ,
      () => console.log("error");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
    socket.on("init", (initId: string) => {
      console.log("init");
      setId(initId);
      setSocketData((prevData:socketDataType)=>({...prevData,id:initId}));
      socket.emitWithAck("init_res");
    });


  useEffect(() => {
    console.log("change");
    console.log(socketData)
    socket.emitWithAck("changeData", socketData);
  }, [socketData]);

  const handleName = () => {
    if (name !== '') {
      setSocketData({ ...socketData, name: name })
      setName("");
      console.log("move");
    }
  }

  const getPosition = () => {

    navigator.geolocation.getCurrentPosition((position) => {
    setSocketData({id:socketData.id,name:socketData.name,position:{lat:position.coords.latitude,lng:position.coords.longitude}}),
        () => console.log("error");
    });
    console.log("getPosition");
    console.log(socketData);
  }

  const sendPosition = () => {
    socket.emitWithAck("send_position", socketData);
    console.log(socketData);
    console.log("送信");
  }



  // const startSendPosition = () => {
  //   console.log("start");
  //   setInterval(sendPosition, 5000);
  // }

  if(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!==undefined){
    const API_KEY:string=process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
    console.log("local");
    return (
      <div>
        <div id="name">
          {socketData.name}
        </div>
        <input type="text" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => handleName()}>送信</button>
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={socketData.position}
            zoom={20}
          >
          </GoogleMap>
        </LoadScript>
        <button onClick={getPosition}>位置情報取得</button>
        <br />
        <button onClick={()=>console.log(socketData)}>位置情報送信を開始</button>
  
      </div>
    );
  }else{
    return (
      <div>
        <h1>ERROR:Can not get API KEY</h1>
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

