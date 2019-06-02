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
            <td><b>{d.name}</b></td>
          </tr>
          <tr key="Apellido">
            <td>Apellido</td>
            <td><b>{d.lastname}</b></td>
          </tr>
          <tr key="Nombre de usuario">
            <td>Nombre de usuario</td>
            <td><b>{d.name}</b></td>
          </tr>
          <tr key="Email">
            <td>Email</td>
            <td><b>{d.email}</b></td>
          </tr>
          <tr key="DNI">
            <td>DNI</td>
            <td><b>{d.dni}</b></td>
          </tr>
          <tr key="Telefono">
            <td>Telefono</td>
            <td><b>{d.telephone}</b></td>
          </tr>
          <tr key="Celular">
            <td>Celular</td>
            <td><b>{d.celphone}</b></td>
          </tr>
          <tr key="Direccion">
            <td>Direccion</td>
            <td><b>{d.address}</b></td>
          </tr>
        </tbody>
      )
    });
    const car = this.state.driver.map((c) => {
      return (
        <tbody key="car">
          <tr key="Marca">
            <td>Marca</td>
            <td><b>{c.brand}</b></td>
          </tr>
          <tr key="Modelo">
            <td>Modelo</td>
            <td><b>{c.model}</b></td>
          </tr>
          <tr key="Color">
            <td>Color</td>
            <td><b>{c.carcolour}</b></td>
          </tr>
          <tr key="Numero de seguro">
            <td>Número de seguro</td>
            <td><b>{c.insurancepolicynumber}</b></td>
          </tr>
          <tr key="Numero de registro de conducir">
            <td>Numero de registro de conducir</td>
            <td><b>{c.licensenumber}</b></td>
          </tr>
        </tbody>
      )
    });
    const profile_pic = this.state.driver.map((d) => {
      return(
        <div key="profile_pic">
          <img fluid src={d.photo_url} />
        </div>
      )
    });
    const license = this.state.driver.map((d) => {
      return (
        <img className="img-fluid" key="license" rounded src={d.license_photo_url} />
      )
    });
    const car_plate = this.state.driver.map((d) => {
      return (
        <img className="img-fluid" key="car_plate" rounded src={d.car_plate_photo_url} />
      )
    });
    const status_and_rating = this.state.driver.map((d) => {
      return (
        <div>
        <Row>
          <Col><h3>{d.name + " " + d.lastname}</h3><br/></Col>
        </Row>
        <Row className="align-bottom">
          <Col>
            <p><b>Viajes realizados: </b>{this.state.driver_trips.length}</p>
            <p><b>Status: </b>{d.status}</p>
            <p><b>Rating: </b>{d.rating}</p>
          </Col>
        </Row>
        </div>
      )
    });
    const buttons = this.state.driver.map((d) => {
      return (
        <div>
          <Button className="btn-pill" block color="dark" onClick={this.blockDriver}>Bloquear</Button>
          <Button className="btn-pill" block color="success" onClick={this.approveDriver}>Aprobar</Button>
          <Button className="btn-pill" block color="danger" onClick={this.rejectDriver}>Rechazar</Button>
        </div>
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
        <br/>
        <Row className="row-eq-height">
          <Col>
            {profile_pic}
          </Col>
          <Col>
            {status_and_rating}
          </Col>
          <Col>
            {buttons}
          </Col>
          <Col>
            {comment}
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Datos personales
              </CardHeader>
              <CardBody>
                  <Table hover bordered striped responsive size="sm">
                      {driver}
                  </Table>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Datos del auto
              </CardHeader>
              <CardBody>
                  <Table hover bordered striped responsive size="sm">
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
          <i className="fa fa-align-justify"></i> Viajes del chofer
        </CardHeader>
        <CardBody>
          <Table hover bordered striped responsive size="sm">
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
