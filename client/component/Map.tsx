
import React, { Component } from 'react';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';

class GoogleMap extends Component {
  state = {
    lat: null,
    lng: null
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      console.log(position.coords);
    },
    (err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <Map
        google = { this.props.google }
        zoom = { 14 }
        center = {{ lat: this.state.lat, lng: this.state.lng }}
        initialCenter = {{ lat: this.state.lat, lng: this.state.lng }}
      >
        <Marker
          title = { "現在地" }
          position = {{ lat: this.state.lat, lng: this.state.lng }}
        />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("<Google MapのAPIキーをここにコピペ>")
})(GoogleMap);