import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const SourceComponent = ({ text, lat, lng }) =>
  <div>
    <i className="fa fa-bullseye fa-lg mt-4"></i><br />Inicio <span className="text-muted"></span>
  </div>;
  
const DestinationComponent = ({ text, lat, lng }) =>
  <div>
    <i className="fa fa-close fa-lg mt-4"></i><br />Destino <span className="text-muted"></span>
  </div>;

const CurrentPositionComponent = ({ text, lat, lng }) =>
  <div>
    <i className="fa fa-automobile fa-lg mt-4"></i><br />Chofer <span className="text-muted"></span>
  </div>;
  
class tripMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trip : [],
      id : props.match.params.id,
      center: {
        lat: -34.592674,
        lng: -58.446200
      },
      zoom: 11
    }
  }
  
  componentDidMount() {
    fetch('https://correapp-api.herokuapp.com/trips/' + this.state.id)
      .then(response => response.json())
      .then(data =>{
        this.setState({ trip: [data] });
      });
  }
  
  render() {
    const trip_marker = this.state.trip.map((t) => {
      return(
        <GoogleMapReact key="map"
          bootstrapURLKeys={{ key: "AIzaSyAY7UZsBUTxxPT0whr4tZgTz4v5PiwdffY" }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
        >
          <SourceComponent lat={t.source? t.source.lat : null} lng={t.source? t.source.long : null}/>
          <DestinationComponent lat={t.destination? t.destination.lat : null} lng={t.destination? t.destination.long : null} />
          <CurrentPositionComponent lat={t.currentposition? t.currentposition.lat : null} lng={t.currentposition? t.currentposition.long : null} />
        
        </GoogleMapReact>
      )
    });
    
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        {trip_marker}
      </div>
    );
  }
}

export default tripMap;