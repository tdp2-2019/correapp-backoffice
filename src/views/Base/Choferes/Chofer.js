import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import { Button, Card, CardBody, CardHeader, Col, Row, Table, FormGroup, Label, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const items_per_page = 5;

class Chofer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driver: [],
      driver_all_trips: [],
      driver_trips: [],
      driver_trips_pages: [],
      comment: "",
      id: props.match.params.id
    }
    this.handleChange = this.handleChange.bind(this);
    this.blockDriver = this.blockDriver.bind(this);
    this.rejectDriver = this.rejectDriver.bind(this);
    this.approveDriver = this.approveDriver.bind(this);
    this.onClickPaginatorHandle = this.onClickPaginatorHandle.bind(this);
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
          var pages =[];
          var currentPage = [];
          data.forEach((trip) => {
            currentPage.push(trip);
            if (currentPage.length == items_per_page) {
              pages.push(currentPage);
              currentPage = [];
            }
          });
          if (data.length % items_per_page !== 0) {
            pages.push(currentPage);
          }
          this.setState({driver_all_trips: data, driver_trips: pages[0]? pages[0] : [], driver_trips_pages: pages? pages : [] });
        }
      });
  }

  handleChange(event) {
    this.setState({comment: event.target.value});
  }

  onClickPaginatorHandle(event) {
    this.setState({driver_trips: this.state.driver_trips_pages[event.target.value]});
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

  formatearStatus(status) {
    switch (status) {
      case "started":
      case "created":
        return "En proceso";
      case "Aborted":
        return "Cancelado";
      case "finished":
        return "Finalizado";
      default:
    }
  }

  render() {
    const driver_trips = this.state.driver_trips.map((trip) => {
      return(
        <tr key={trip.id}>
        <td>{trip.id}</td>
        <td>{Moment(trip.start_time).format('DD-MM-YYYY')}</td>
        <td>{trip.client}</td>
        <td>{trip.source.name}</td>
        <td>{trip.destination.name}</td>
        <td>${trip.price.toFixed(2)}</td>
        <td>{Math.floor(trip.duration / 60) + " min."}</td>
        <td>{this.formatearStatus(trip.status)}</td>
        <td>
          <Link to={"/viajes/"+trip.id}>
            <i class="cui-location-pin h5"></i>
          </Link>
          <Link to={"/viajes/"+trip.id}>
            <i class="cui-cursor h5"></i>
          </Link>
        </td>
        </tr>
      )
    });
    const paginator = this.state.driver_trips_pages.map((page, index) => {
      return (
          <PaginationItem>
            <PaginationLink value={index} onClick={this.onClickPaginatorHandle} tag="button">{index + 1}</PaginationLink>
          </PaginationItem>
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
        <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Viajes del chofer
        </CardHeader>
        <CardBody>
          <Table hover bordered striped responsive size="sm">
            <thead>
            <tr>
              <th>Id</th>
              <th>Fecha de inicio</th>
              <th>Cliente</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
              {driver_trips}
            </tbody>
          </Table>
          <Pagination>
            {paginator}
          </Pagination>
        </CardBody>
        </Card>
      </div>
    )
  }
}

export default Chofer;
