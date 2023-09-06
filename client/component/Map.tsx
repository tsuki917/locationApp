import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { uuid } from "uuidv4";
import image_pin from "../public/user.png";

type socketDataType = {
  id: string;
  name: string;
  roomId: string;

  position: {
    lat: number;
    lng: number;
  };
  selfIntroduce: string;
};

const socket: Socket = io("http://localhost:5000");
const MyComponent = () => {
  const containerStyle = {
    width: "100%",
    height: 400,
  };
  const testRouter = useRouter();
  const test = testRouter.asPath;
  const uuidPath = test.split("uuid=")[1];
  console.log(uuidPath);

  const [roomId, setRoomId] = useState<string>(uuidPath);

  const [name, setName] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [socketData, setSocketData] = useState<socketDataType>({
    id: "",
    name: "noName",
    roomId: uuidPath,
    position: { lat: 0, lng: 0 },
    selfIntroduce: "よろしくお願いします！",
  });
  const [ClientDatas, setClientDatas] = useState<socketDataType[]>([]);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [targetPerson, setTargetPerson] = useState<socketDataType>();
  const intervalRef = useRef<number>();

  //get socket id from server
  socket.once("init", (initId: string) => {
    console.log("init");

    setSocketData((prevData: socketDataType) => ({ ...prevData, id: initId }));
    setSocketData((prevData: socketDataType) => ({
      ...prevData,
      roomId: uuidPath,
    }));
    socket.emit("init_res", socketData);
  });

  //initialize postion and set event to get AllclientData from server
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
      console.log(
        "Is ClientDatas an array? pre set" + Array.isArray(allClientDatas)
      );

      setClientDatas(allClientDatas);
      console.log(
        "Is ClientDatas an array? after set" + Array.isArray(allClientDatas)
      );
      // setClientDatas(Array.from(allClientDatas));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //when user's data has changed ,this sends user's data to server
  useEffect(() => {
    if (uuid !== undefined && socketData.roomId !== roomId)
      setRoomId(() => uuidPath);

    socket.emitWithAck("changeData", socketData);
  }, [socketData]);
  useEffect(() => {
    setSocketData((prev: socketDataType) => ({ ...prev, roomId: uuidPath }));
    socket.emitWithAck("joinRoom", roomId);
  }, [roomId]);

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
    console.log(ClientDatas);
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
    setSocketData((prev: socketDataType) => ({
      ...prev,
      roomId: uuidPath,
    }));
  };

  const sendPosition = () => {
    console.log("start");
    setSending(true);
    intervalRef.current = window.setInterval(() => {
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
    }, 8000);
    console.log(intervalRef.current);
  };

  const stopSendPosition = () => {
    console.log("stop");
    console.log(intervalRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setSending(false);
  };

  const reqestAllClientData = () => {
    console.log("req allClientData");
    socket.emit("requestAllClientData");
  };

  const getTargetPerson = (key: number) => {
    setTargetPerson(ClientDatas[key]);
  };

  if (process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY !== undefined) {
    const API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    return (
      <div className="border  w-4/5 mx-auto ">
        <div className="">
          <div className="  text-left text-3xl font-bold underline">
            My Profile
          </div>
          <div className="border-2 border-black shadow-sm  rounded-xl   text-left  ">
            <div id="name" className="   ml-2 inline-block">
              <h2 className="font-bold">名前</h2>
              <p className="font-bold ml-5">{socketData.name}</p>
            </div>
            <br />
            <div id="introcude" className=" ml-2 inline-block">
              <h2 className="font-bold">自己紹介</h2>
              <p className="ml-3">{socketData.selfIntroduce}</p>
            </div>
            <div id="edit-intro">
              {isEdit ? (
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
                    className="bg-gradient-to-br from-red-400 to-red-600 hover:bg-gradient-to-tl text-white rounded px-3 py-2 my-2  ml-2"
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
              ) : (
                <button
                  className="inline-block  bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 my-2 m-auto"
                  onClick={() => setIsEdit(true)}
                >
                  編集
                </button>
              )}
            </div>
          </div>
        </div>

        <div className=" mt-3 ">
          <h2 className="font-bold text-3xl m-2 underline">Map</h2>
          <div className="flex justify-around">
            <LoadScript googleMapsApiKey={API_KEY}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={socketData.position}
                zoom={20}
              >
                {window.google && window.google.maps && (
                  <Marker
                    position={socketData.position}
                    icon={{
                      url: "/user.png",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                  ></Marker>
                )}

                {targetPerson && (
                  <Marker position={targetPerson.position}></Marker>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
          <div className="border flex justify-end">
            <button
              type="button"
              className="inline-block bg-gradient-to-br from-green-300 to-teal-700 hover:bg-gradient-to-tl text-white rounded px-4 py-2 mb-2  mt-4 ml-2"
              onClick={getPosition}
            >
              更新
            </button>

            {!sending ? (
              <button
                onClick={sendPosition}
                className=" inline-block bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 mb-2 mt-4 ml-2"
              >
                位置情報送信を開始
              </button>
            ) : (
              <button
                onClick={stopSendPosition}
                className=" inline-block bg-gradient-to-br from-red-400 to-red-600 hover:bg-gradient-to-tl text-white rounded px-4 py-2 mb-2 mt-4 ml-2"
              >
                位置情報送信を停止
              </button>
            )}
          </div>
        </div>

        <div className="  mt-3">
          <div className="text-left">
            <h2 className="font-bold text-3xl underline">ProfileList</h2>
          </div>
          <div className="flex justify-center ">
            {ClientDatas.map((clientData, key) => {
              if (clientData.id !== socketData.id) {
                return (
                  <div className="border-2 w-2/3 m-3 p-3 rounded-xl" key={key}>
                    <h1 className="row-auto col-auto text-xl">
                      {clientData.name}
                    </h1>
                    <h2>{clientData.selfIntroduce}</h2>
                    <div className="text-center">
                      <button
                        onClick={() => {
                          getTargetPerson(key);
                        }}
                        className=" inline-block bg-gradient-to-br from-blue-300 to-blue-800 hover:bg-gradient-to-tl text-white rounded px-4 py-2 mb-2 mt-4 ml-2"
                      >
                        位置情報取得
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="text-right m-2">
            <button
              className="inline-block bg-gradient-to-br from-green-300 to-teal-700 hover:bg-gradient-to-tl text-white rounded px-4 py-2 mb-2 mt-4 ml-2"
              onClick={getPosition}
            >
              更新
            </button>
          </div>
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
