import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "800px",
  height: "400px",
};

const center = {
  lat: 35.69575,
  lng: 139.77521,
};

const MyComponent = () => {
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