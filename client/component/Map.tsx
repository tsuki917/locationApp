import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
const containerStyle = {
  width: "800px",
  height: "400px",
};





type prop = {
  lat: number,
  lng: number
}

const MyComponent = (props: prop) => {
  const [position, setPosition] = useState<prop>({ lat: props.lat, lng: props.lng });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position)=>{
      setPosition({
        lat:position.coords.latitude,
        lng:position.coords.longitude
      }),
      ()=>console.log("error");
    });


  },[]);
  
  

  const getPosition = () => {
   
    navigator.geolocation.getCurrentPosition((position)=>{
      setPosition({
        lat:position.coords.latitude,
        lng:position.coords.longitude
      }),
      ()=>console.log("error");
    });
  }



  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyAheiUVYAXMXnpaIjFQCczhVUUEe39NhLc">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={20}
        >
          <Marker position={position}/>
        </GoogleMap>
      </LoadScript>
      <button onClick={getPosition}>位置情報取得</button>
    </div>
  );
};



export default MyComponent;



export const getServerSideProps: GetServerSideProps = async () => {
  let myPosition:prop={
    lat:0,
    lng:0
  };
  navigator.geolocation.getCurrentPosition(
    function (position) {
      myPosition.lat=position.coords.latitude;
      myPosition.lng=position.coords.longitude;
    }, () => console.log("error"));




  return {
    props: myPosition,
  };
};

//この関数に問題あり propを位置情報取得した後の値を入れてもreturnするときにはもとに戻っている。
// function getPositionFun() {
//     let pos:prop={
//       lat:35,
//       lng:136
//     };
//     navigator.geolocation.getCurrentPosition(
//      function (position) {
//       pos.lat = position.coords.latitude;
//       pos.lng = position.coords.longitude;

      
//     }, () => {
//       console.log("error");
//     });
//     console.log(pos);
//     return pos;

// }