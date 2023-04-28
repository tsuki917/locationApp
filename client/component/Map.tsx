import { GoogleMap, LoadScript } from "@react-google-maps/api";
import dynamic from "next/dynamic";
import { useEffect } from "react";
const containerStyle = {
  width: "800px",
  height: "400px",
};

const center = {
  lat: 35.69575,
  lng: 139.77521,
};

const MyComponent = () => {
  
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((position)=>console.log(position.coords.latitude),()=>console.log("error"));
  },[]);
  
  return (
    <LoadScript googleMapsApiKey="AIzaSyAheiUVYAXMXnpaIjFQCczhVUUEe39NhLc">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
      ></GoogleMap>
    </LoadScript>
  );
};

export default MyComponent;