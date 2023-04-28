import { GoogleMap, LoadScript,Marker, useLoadScript } from "@react-google-maps/api";
const containerStyle = {
  width: "800px",
  height: "400px",
};

const center = {
  lat: 35.69575,
  lng: 139.77521,
};
const MyComponent = () => {
//   if(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY){
//   const {isLoaded} = useLoadScript({
//     googleMapsApiKey:process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
//   });
// }


  return (
    <div id="map"></div>
  );
};

export default MyComponent;