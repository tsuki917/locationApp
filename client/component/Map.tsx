import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { setInterval } from "timers";
const containerStyle = {
  width: "300px",
  height: "200px",
};

const socket = io("http://localhost:5000");

type prop = {
  lat: number;
  lng: number;
};

type socketDataType = {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  selfIntroduce: string;
};

const MyComponent = () => {
  const [name, setName] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [socketData, setSocketData] = useState<socketDataType>({
    id: "",
    name: "noName",
    position: { lat: 0, lng: 0 },
    selfIntroduce: "よろしくお願いします！",
  });
  const [ClientDatas, setClientDatas] = useState<socketDataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  console.log("hoge");

  //位置情報の初期化
  useEffect(() => {
    console.log("firstEffect");
    navigator.geolocation.getCurrentPosition((getPositionData) => {
      setSocketData((prevData: socketDataType) => ({
        ...prevData,
        position: {
          lat: getPositionData.coords.latitude,
          lng: getPositionData.coords.longitude,
        },
      })),
        () => console.log("error");
    });
    socket.on("send_AllClientData", (allClientDatas: socketDataType[]) => {
      setClientDatas(allClientDatas);
      console.log("allClientDatas");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  socket.once("init", (initId: string) => {
    console.log("init");
    setSocketData((prevData: socketDataType) => ({ ...prevData, id: initId }));
    socket.emitWithAck("init_res");
  });

  useEffect(() => {
    socket.emitWithAck("changeData", socketData);
  }, [socketData]);

  const handleSelfDatas = () => {
    if (name !== "") {
      setSocketData((prev: socketDataType) => ({ ...prev, name: name }));

      setName("");
      console.log("move");
    }
    if (selfIntro !== "") {
      setSocketData((prev: socketDataType) => ({
        ...prev,
        selfIntroduce: selfIntro,
      }));

      setSelfIntro("");
      console.log("self move");
    }
  };

  const getPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setSocketData((prev: socketDataType) => ({
        ...prev,
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      })),
        () => console.log("error");
    });
    console.log("getPosition");
    console.log(socketData);
  };

  const sendPosition = () => {
    let constantKey = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setSocketData((prev: socketDataType) => ({
          ...prev,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })),
          () => console.log("error");
      });
      console.log("sendPosition");
    }, 10000);
  };

  // const startSendPosition = () => {
  //   console.log("start");
  //   setInterval(sendPosition, 5000);
  // }

  if (process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY !== undefined) {
    const API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    console.log("local");
    return (
      <div className="border w-[375px]  ">
        <div className="border-2 border-black shadow-sm  rounded-xl m-2 p-2 w-[360px] text-left ">
          <div className=" m-1 ml-2 text-left text-xl underline">
            My Profile
          </div>
          <div id="name" className="   ml-2 inline-block">
            <h2 className="font-bold">名前</h2>
            <p className="font-bold ml-5">{socketData.name}</p>
          </div>
          <br />
          <div id="introcude" className=" inline-block">
            <h2 className="font-bold">自己紹介</h2>
            <p className="ml-3">{socketData.selfIntroduce}</p>
          </div>
          <div id="edit-intro">
            
            {
              !isEdit&&(
                <button
              className="inline-block  bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2 m-auto"
              onClick={() => setIsEdit(true)}
            >
              編集
            </button>
              )
            }
            {isEdit && (
            <div id="editting">
              <input
                type="text"
                placeholder="名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ml-3 mb-1 border"
              />
              <br />
              <textarea
                placeholder="自己紹介"
                value={selfIntro}
                onChange={(e) => setSelfIntro(e.target.value)}
                className=" w-4/5 ml-3 mb-1 border"
              />
              <br />
              <button
                onClick={() => {handleSelfDatas();setIsEdit(()=>false)}}
                className="bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2  ml-2"
              >
                送信
              </button>
            </div>
          )}
          </div>
          
        </div>

        <div className="ml-[37.5px] mr-[37.5px]">
          <h2 className="font-bold text-3xl m-2">Map</h2>
          <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={socketData.position}
              zoom={19}
            >
              <Marker position={socketData.position}></Marker>
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="text-center">
          <button
            onClick={getPosition}
            className="inline-block  bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2 m-auto"
          >
            位置情報取得
          </button>
          <button
            onClick={sendPosition}
            className=" inline-block bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2  ml-2"
          >
            位置情報送信を開始
          </button>
        </div>

        <div className="">
          {ClientDatas.filter(
            (data) => data.position.lat !== 0 && data.position.lng !== 0
          ).map((clientData, key) => {
            return (
              <div className="border-2 inline-block" key={key}>
                <h1 className="row-auto col-auto">{clientData.name}</h1>
                <h2>{clientData.selfIntroduce}</h2>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
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
