import React, { Component } from 'react';
import Moment from 'moment';
import GoogleMapReact from 'google-map-react';
import { Button, Card, CardBody, CardHeader, Col, Row, Table, Form, FormGroup, Label, Input } from 'reactstrap';

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

class Viaje extends Component {
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

  formatearChofer(nombre, apellido) {
    var r = "" ;
    if (nombre !== null && typeof nombre !== "undefined") {
      r += nombre + " ";
    }
    if (apellido !== null && typeof nombre !== "undefined") {
      r += apellido;
    }
    if (r == "") {
        return "No asignado";
    }
    return r;
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

    const trip_title = this.state.trip.map((t) => {
      return(
          <Row className="row-eq-height">
          <Col className="text-left">
            <p className="mb-0">Chofer:</p>
            <h2>{this.formatearChofer(t.driver_name, t.driver_lastname)}</h2>
          </Col>
          <Col className="text-center">
            <p className="mb-0 invisible">Chofer:</p>
            <h3>{Moment(t.start_time).format('DD-MM-YYYY')}</h3>
          </Col>
          <Col className="text-right">
            <p className="mb-0">Cliente:</p>
            <h2>{t.client}</h2>
          </Col>
          </Row>
      )
    });

    const trip_card = this.state.trip.map((t) => {
        return(
          <tbody key="trip">
            <tr key="Origen">
              <td>Origen</td>
              <td><b>{t.source.name}</b></td>
            </tr>
            <tr key="Destino">
              <td>Destino</td>
              <td><b>{t.destination.name}</b></td>
            </tr>
            <tr key="Duración">
              <td>Duración</td>
              <td><b>{Math.floor(t.duration / 60) + " min."}</b></td>
            </tr>
            <tr key="Fecha">
              <td>Fecha</td>
              <td><b>{Moment(t.start_time).format('DD-MM-YYYY')}</b></td>
            </tr>
            <tr key="Precio">
              <td>Precio</td>
              <td><b>${t.price.toFixed(2)}</b></td>
            </tr>
            <tr key="Cantidad">
              <td>Cantidad de mascotas</td>
              <td><b>{t.pets.length}</b></td>
            </tr>
            {typeof t.pets[0] !== "undefined" ?
            <tr key="Mascota1">
              <td>Mascota #1</td>
              <td><b>{t.pets[0].key1 + " (" + t.pets[0].key2 + ")"}</b></td>
            </tr> : null }
            {typeof t.pets[1] !== "undefined" ?
            <tr key="Mascota2">
              <td>Mascota #2</td>
              <td><b>{t.pets[1].key1 + " (" + t.pets[1].key2 + ")"}</b></td>
            </tr> : null }
            {typeof t.pets[2] !== "undefined" ?
            <tr key="Mascota3">
              <td>Mascota #3</td>
              <td><b>{t.pets[2].key2 + " (" + t.pets[2].key2 + ")"}</b></td>
            </tr> : null }
          </tbody>
        )
    });

    const trip_rating_client = this.state.trip.map((t) => {
        if (t.user_rating == null) {
            return(
              <p>No hay información</p>
            );
        }
        return(
            <tbody key="Rating Client">
              <tr key="Rating">
                <td>Rating</td>
                <td><b>{t.user_rating.rating}</b></td>
              </tr>
              <tr key="Comentario">
                <td>Comentario</td>
                <td><b>{t.user_rating.comment}</b></td>
              </tr>
            </tbody>
        )
    });

    const trip_rating_driver = this.state.trip.map((t) => {
        if (t.driver_rating == null) {
            return(
              <p>No hay información</p>
            );
        }
        return(
            <tbody key="Rating Driver">
              <tr key="Rating">
                <td>Rating</td>
                <td><b>{t.driver_rating.rating}</b></td>
              </tr>
              <tr key="Comentario">
                <td>Comentario</td>
                <td><b>{t.driver_rating.comment}</b></td>
              </tr>
            </tbody>
        )
    });

    return (
      <div key="trip" className="animated fadeIn">
        <h2>Ficha del Viaje</h2>
        <br/>
        {trip_title}
        <br/>
        <Row>
          <Col>
          {/* Important! Always set the container height explicitly */ }
          <div style={{ height: '40vh', width: '100%' }}>
            {trip_marker}
          </div>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Datos del viaje
              </CardHeader>
              <CardBody>
                  <Table hover bordered striped responsive size="sm">
                    {trip_card}
                  </Table>
              </CardBody>
            </Card>
          </Col>
          <Col>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Rating del cliente
            </CardHeader>
            <CardBody>
                <Table hover bordered striped responsive size="sm">
                  {trip_rating_client}
                </Table>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Rating del chofer
            </CardHeader>
            <CardBody>
                <Table hover bordered striped responsive size="sm">
                  {trip_rating_driver}
                </Table>
            </CardBody>
          </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Viaje;
