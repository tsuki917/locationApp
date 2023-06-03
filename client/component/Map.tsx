import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { setInterval } from "timers";
const containerStyle = {
  width: "300px",
  height: "200px",
};

const socket = io("http://localhost:5000");



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
        <div className=" m-1 ml-4 text-left text-3xl font-bold underline">
          My Profile
        </div>
        <div className="border-2 border-black shadow-sm  rounded-xl m-3 ml-[37.5px] mr-[37.5px] p-2 w-[300px] text-left  ">
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
            {!isEdit && (
              <button
                className="inline-block  bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2 m-auto"
                onClick={() => setIsEdit(true)}
              >
                編集
              </button>
            )}
            {isEdit && (
              <div id="editting" className=" mt-7 border">
                <p className="m-2 font-bold">変更の入力</p>
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
                  onClick={() => setIsEdit(() => false)}
                  className="bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2  ml-2"
                >
                  閉じる
                </button>
                <button
                  onClick={() => {
                    handleSelfDatas();
                    setIsEdit(() => false);
                  }}
                  className="bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2  ml-2"
                >
                  送信
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="ml-[37.5px] mr-[37.5px]">
          <h2 className="font-bold text-3xl m-2 underline">Map</h2>
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

        <div className=" w-[300px] ml-[37.5px] mr-[37.5px] my-4">
          <div className="text-left">
            <h2 className="font-bold text-3xl underline">ProfileList</h2>
          </div>
          {ClientDatas.filter(
            (data) => data.position.lat !== 0 && data.position.lng !== 0
          ).map((clientData, key) => {
            return (
              <div className="border-2  m-3 p-3 rounded-xl" key={key}>
                <h1 className="row-auto col-auto text-xl">{clientData.name}</h1>
                <h2>{clientData.selfIntroduce}</h2>
                <div className="text-center">
                  <button className=" inline-block bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 mb-2 mt-4 ml-2">
                    位置情報取得
                  </button>
                </div>
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
