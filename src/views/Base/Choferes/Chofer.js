import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Row, Table, FormGroup, Label, Input } from 'reactstrap';


class Chofer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driver: [],
      driver_trips: [],
      comment: "",
      id: props.match.params.id
    }
    this.handleChange = this.handleChange.bind(this);
    this.blockDriver = this.blockDriver.bind(this);
    this.rejectDriver = this.rejectDriver.bind(this);
    this.approveDriver = this.approveDriver.bind(this);
  }
  
  componentDidMount() {
    fetch('https://correapp-api.herokuapp.com/drivers/' + this.state.id)
      .then(response => response.json())
      .then(data =>{
        this.setState({ driver: [data], comment: data.comment });
      });
    fetch('https://correapp-api.herokuapp.com/trips?driver_id=' + this.state.id)
      .then(response => response.json())
      .then(data => {
        if(typeof data.errorCode == 'undefined') {
          this.setState({driver_trips: data});
        }
      });
  }
  
  handleChange(event) {
    this.setState({comment: event.target.value});
  }
  
  blockDriver() {
    fetch('https://correapp-api.herokuapp.com/drivers/' + this.state.id,
      {
        method: "put",
        body:JSON.stringify({status: 'Bloqueado', comment: this.state.comment}),
        headers: {"content-type" : "application/json"}
      }
    )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.reload();
    });
  }
  
  approveDriver() {
    fetch('https://correapp-api.herokuapp.com/drivers/' + this.state.id,
        {
          method: "put",
          body:JSON.stringify({status: 'Aprobado', comment: this.state.comment}),
          headers: {"content-type" : "application/json"}
        }
    )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.reload();
    });
  }
  
  rejectDriver() {
    fetch('https://correapp-api.herokuapp.com/drivers/' + this.props.match.params.id,
      {
        method: "put",
        body:JSON.stringify({status: 'Rechazado', comment: this.state.comment}),
        headers: {"content-type" : "application/json"}
      }
    )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.reload();
    });
  }
  
  render() {
    const driver_trips = this.state.driver_trips.map((trip) => {
      return(
        <tr key={trip.id}>
          <td>{trip.id}</td>
          <td>{trip.status}</td>
          <td>{trip.client_id}</td>
          <td>$ {trip.price}</td>
          <td>{trip.start_time}</td>
          <td>
            <Link to={"/viajes/"+trip.id}>
              <button className="btn btn-link p-0">Ver Mapa</button>
            </Link>
          </td>
        </tr>
      )
    });
    const driver = this.state.driver.map((d) => {
      return (
        <tbody key="driver">
          <tr key="Nombre">
            <td>Nombre</td>
            <td>{d.name}</td>
          </tr>
          <tr key="Apellido">
            <td>Apellido</td>
            <td>{d.lastname}</td>
          </tr>
          <tr key="Nombre de usuario">
            <td>Nombre de usuario</td>
            <td>{d.name}</td>
          </tr>
          <tr key="Email">
            <td>Email</td>
            <td>{d.email}</td>
          </tr>
          <tr key="DNI">
            <td>DNI</td>
            <td>{d.dni}</td>
          </tr>
          <tr key="Telefono">
            <td>Telefono</td>
            <td>{d.telephone}</td>
          </tr>
          <tr key="Celular">
            <td>Celular</td>
            <td>{d.celphone}</td>
          </tr>
          <tr key="Direccion">
            <td>Direccion</td>
            <td>{d.address}</td>
          </tr>
        </tbody>
      )
    });
    const car = this.state.driver.map((c) => {
      return (
        <tbody key="car">
          <tr key="Marca">
            <td>Marca</td>
            <td>{c.brand}</td>
          </tr>
          <tr key="Modelo">
            <td>Modelo</td>
            <td>{c.model}</td>
          </tr>
          <tr key="Color">
            <td>Color</td>
            <td>{c.carcolour}</td>
          </tr>
          <tr key="Numero de seguro">
            <td>Número de seguro</td>
            <td>{c.insurancepolicynumber}</td>
          </tr>
          <tr key="Numero de registro de conducir">
            <td>Numero de registro de conducir</td>
            <td>{c.licensenumber}</td>
          </tr>
        </tbody>
      )
    });
    const profile_pic = this.state.driver.map((d) => {
      return(
        <div key="profile_pic">
          <img width={400} height={200} mode='fit' src={d.photo_url} />
        </div>
      )
    });
    const license = this.state.driver.map((d) => {
      return (
        <img key="license" width={400} height={400} mode='fit' src={d.license_photo_url} />
      )
    });
    const car_plate = this.state.driver.map((d) => {
      return (
        <img key="car_plate" width={400} height={400} mode='fit' src={d.car_plate_photo_url} />
      )
    });
    const status_and_rating = this.state.driver.map((d) => {
      return (
        <tbody key="status_and_rating">
          <tr key="Name">
            <td><h3>{d.name}</h3></td>
            <td></td>
            <td><h3>{d.lastname}</h3></td>
          </tr>
          <tr key="Status">
            <td><b>Status</b></td>
            <td></td>
            <td>{d.status}</td>
          </tr>
          <tr key="Rating">
            <td><b>Rating</b></td>
            <td></td>
            <td>{d.rating}</td>
          </tr>
        </tbody>
      )
    });
    const buttons = this.state.driver.map((d) => {
      return (
        <table key ="buttons">
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Button block color="dark" onClick={this.blockDriver}>Bloquear</Button>
          </Col>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Button block color="success" onClick={this.approveDriver}>Aprobar</Button>
          </Col>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Button block color="danger" onClick={this.rejectDriver}>Rechazar</Button>
          </Col>
        </table>
      )
    });
    const comment = this.state.driver.map((d) => {
      return (
      <FormGroup row key="comment">
      <Col md="3">
      <Label htmlFor="textarea-input"><h5>Comentario</h5></Label>
      </Col>
      <Col xs="3" md="9">
      <Input type="textarea" name="textarea-input" id="textarea-input" rows="9"
        placeholder="Escriba el análisis del bloqueo/aprobación/rechazo" value={this.state.comment} onChange={this.handleChange} />
      </Col>
      </FormGroup>
    )
    });
    return (
      <div className="animated fadeIn">
      <h2>Ficha del Chofer</h2>
        <Row>
          <Col lg={4}>
            {profile_pic}
          </Col>
          <Col lg={2}>
            <Table>
              {status_and_rating}
            </Table>
          </Col>
          <Col lg={2}>
            {buttons}
          </Col>
          <Col lg={4}>
            {comment}
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong>Datos personales</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                      {driver}
                  </Table>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong>Datos del auto</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                      {car}
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong>Licencia</strong>
              </CardHeader>
              <CardBody>
                {license}
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong>Patente</strong>
              </CardHeader>
              <CardBody>
                {car_plate}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <CardHeader>
          <strong>Viajes del chofer</strong>
        </CardHeader>
        <CardBody>
          <Table responsive>
            <thead>
            <tr>
              <th>Id</th>
              <th>Status</th>
              <th>Client id</th>
              <th>Price</th>
              <th>StartTime</th>
              <th>Mapa</th>
            </tr>
            </thead>
            <tbody>
              {driver_trips}
            </tbody>
          </Table>
        </CardBody>
      </div>
    )
  }
}

export default Chofer;
