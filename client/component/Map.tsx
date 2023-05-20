import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { SocketType } from "dgram";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { setInterval } from "timers";
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
  },
  selfIntroduce:string
}

const MyComponent = () => {
  const [name, setName] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [socketData, setSocketData] = useState<socketDataType>({ id: '',name: "noName", position: {lat:0,lng:0},selfIntroduce:"よろしくお願いします！"});
  const [ClientDatas,setClientDatas] = useState<socketDataType[]>([]);
  console.log("hoge");
  
  //位置情報の初期化
  useEffect(() => {
    console.log("firstEffect");
    navigator.geolocation.getCurrentPosition((getPositionData) => {
      setSocketData((prevData:socketDataType)=>({
        ...prevData,position:{lat:getPositionData.coords.latitude,lng:getPositionData.coords.longitude}
      })
      )
      ,
      () => console.log("error");
    });
    socket.on("send_AllClientData",(allClientDatas:socketDataType[])=>{
      setClientDatas(allClientDatas);
      console.log("allClientDatas");
      
    });
    
    
    // socket.on("resIntervalData",(res)=>{
    //   setClientDatas(()=>res);
    //   console.log("resinter");
    // });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
    

    socket.once("init", (initId: string) => {
      console.log("init");
      setSocketData((prevData:socketDataType)=>({...prevData,id:initId}));
      socket.emitWithAck("init_res");
    });

    



  useEffect(() => {
    socket.emitWithAck("changeData", socketData);
  }, [socketData]);

  const handleSelfDatas = () => {
    if (name !== '') {
      setSocketData((prev:socketDataType)=>({ ...prev, name: name }));

      setName("");
      console.log("move");
    }
    if(selfIntro!==''){
      setSocketData((prev:socketDataType)=>({ ...prev, selfIntroduce:selfIntro}));
      
      setSelfIntro("");
      console.log("self move");
    }
    
  }

  const getPosition = () => {

    navigator.geolocation.getCurrentPosition((position) => {
    setSocketData((prev:socketDataType)=>({...prev,position:{lat:position.coords.latitude,lng:position.coords.longitude}})),
        () => console.log("error");
    });
    console.log("getPosition");
    console.log(socketData);
  }

  const sendPosition = () => {
    let constantKey = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setSocketData((prev:socketDataType)=>({...prev,position:{lat:position.coords.latitude,lng:position.coords.longitude}})),
            () => console.log("error");
        });
        console.log("sendPosition");
    }, 10000);
    
    
  }

  const reget = () =>{
    console.log("newarraydata");
    console.log(ClientDatas);
    setClientDatas((prev)=>prev);
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
        <div id="introcude">
          {socketData.selfIntroduce}
        </div>
        <input type="text" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
        <br/>
        <input type="text" placeholder="自己紹介" value={selfIntro} onChange={(e) => 
          setSelfIntro(e.target.value)
        } />
        <button onClick={() => handleSelfDatas()}>送信</button>
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={socketData.position}
            zoom={20}
          >
          <Marker position={socketData.position}></Marker>
          </GoogleMap>
        </LoadScript>
        <button onClick={getPosition}>位置情報取得</button>
        <br />
        <button onClick={sendPosition}>位置情報送信を開始</button>
        <br />
        <button onClick={reget}>更新</button>

        <div className="flex">
          {ClientDatas.filter((data)=>data.position.lat!==0&&data.position.lng!==0).
          map((clientData,key)=>{
            return (
            <div className="rounded bg-slate-400" key={key}>
              <h1 >{clientData.name}</h1>
              <h2>{clientData.selfIntroduce}</h2>
            </div>
            
            );
          })}
        </div>
  
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

