import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import { Button, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Form, FormGroup, Label, Input } from 'reactstrap';

const items_per_page = 5;

class Viajes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_trips: [],
      trips: [],
      pages: [],
      origen_filter: "",
      destino_filter: "",
      duracion_filter: "",
      chofer_filter: "",
      status_filter: ""
    }
    this.onClickHandle = this.onClickHandle.bind(this);
    this.handleOrigenChange = this.handleOrigenChange.bind(this);
    this.handleDestinoChange = this.handleDestinoChange.bind(this);
    this.handleDuracionChange = this.handleDuracionChange.bind(this);
    this.handleChoferChange = this.handleChoferChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    fetch('https://correapp-api.herokuapp.com/trips')
      .then(response => response.json())
      .then(data =>{
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
        this.setState({all_trips: data, trips: pages[0]? pages[0] : [], pages: pages? pages : [] });
      });
  }

  onClickHandle(event) {
    this.setState({trips: this.state.pages[event.target.value]});
  }

  filter() {
    var selected_trips = [];
    this.state.all_trips.forEach((trip) => {
      if (this.state.origen_filter !== "") {
        if(!trip.source.name.toLowerCase().includes(this.state.origen_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.destino_filter !== "") {
        if(!trip.destination.name.toLowerCase().includes(this.state.destino_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.duracion_filter !== "") {
        switch (this.state.duracion_filter) {
          case "10":
            if(trip.duration > 10 * 60) {
              return;
            }
            break;
          case "10-30":
            if(trip.duration < 10 * 60 || trip.duration > 30 * 60) {
              return;
            }
            break;
          case "30":
            if(trip.duration < 30 * 60) {
              return;
            }
            break;
          default:
            return;
        }
      }
      if (this.state.chofer_filter !== "") {
        var query = "";
        if(trip.driver_name !== null) {
          query += trip.driver_name + " ";
        }
        if(trip.driver_lastname !== null) {
          query += trip.driver_lastname;
        }
        if (!query.toLowerCase().includes(this.state.chofer_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.status_filter !== "") {
        if(!trip.status.toLowerCase().includes(this.state.status_filter.toLowerCase())) {
          return;
        }
      }
      selected_trips.push(trip);
    });
    var pages = [];
    var currentPage = [];
    selected_trips.forEach((trip) => {
      currentPage.push(trip);
      if (currentPage.length == items_per_page) {
        pages.push(currentPage);
        currentPage = [];
      }
    });
    if (selected_trips.length % items_per_page !== 0) {
      pages.push(currentPage);
    }
    this.setState({trips: pages[0]? pages[0] : [], pages: pages? pages :[]});
  }

  handleOrigenChange(event) {
    const value = event.target.value;
    this.setState({origen_filter : value});
  }

  handleDestinoChange(event) {
    const value = event.target.value;
    this.setState({destino_filter : value});
  }

  handleDuracionChange(event) {
    const value = event.target.value;
    this.setState({duracion_filter : value});
  }

  handleChoferChange(event) {
    const value = event.target.value;
    this.setState({chofer_filter : value});
  }

  handleStatusChange(event) {
    const value = event.target.value;
    this.setState({status_filter : value});
  }

  formatearChofer(nombre, apellido) {
    var r = "" ;
    if (nombre !== null) {
      r += nombre + " ";
    }
    if (apellido !== null) {
      r += apellido;
    }
    return r;
  }

  formatearStatus(status) {
    switch (status) {
      case "started":
        return "En proceso";
      case "created":
        return "Esperando chofer";
      case "Aborted":
        return "Cancelado";
      case "finished":
        return "Finalizado";
      default:
    }
  }

  render() {
    const filter =
    <Card>
      <CardHeader>
        <i className="fa fa-align-justify"></i> Filtros
      </CardHeader>
      <CardBody>
        <Form action="" method="">
          <Row className="no-gutters">
            <Col xs="2" className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="origen_filter">Origen:</Label>
              <Input type="text" id="origen_filter" placeholder="Ej: Santa Fe 1392" size="sm" value={this.state.origen_filter} onChange={this.handleOrigenChange}/>
            </Col>
            <Col xs="2" className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="destino_filter">Destino:</Label>
              <Input type="text" id="destino_filter" placeholder="Ej: Córdoba 598" size="sm" value={this.state.destino_filter} onChange={this.handleDestinoChange} />
            </Col>
            <Col xs="2" className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="duracion_filter">Duración:</Label>
              <Input type="select" id="duracion_filter" placeholder="Ej: +10 minutos" size="sm" value={this.state.duracion_filter} onChange={this.handleDuracionChange}>
                <option hidden value="">Ej: menos de 10 min.</option>
                <option value="">Todas</option>
                <option value="10">Menos de 10 min.</option>
                <option value="10-30">Entre 10 y 30 min.</option>
                <option value="30">Más de 30 min.</option>
              </Input>
            </Col>
            <Col xs="2" className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="nombre_chofer_filter">Nombre de chofer:</Label>
              <Input type="text" id="nombre_chofer_filter" placeholder="Ej: Juan Perez" size="sm" value={this.state.nombre_chofer_filter} onChange={this.handleChoferChange} />
            </Col>
            <Col xs="2" className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="status_filter">Status:</Label>
              <Input type="select" id="status_filter" placeholder="Ej: En proceso" size="sm" value={this.state.status_filter} onChange={this.handleStatusChange}>
                <option hidden value="">Ej: En proceso</option>
                <option value="">Todos</option>
                <option value="created">Esperando chofer</option>
                <option value="started">En proceso</option>
                <option value="finished">Finalizado</option>
                <option value="Aborted">Cancelado</option>
              </Input>
            </Col>
            <Col xs="2">
              <Label size="sm" className="mb-0 invisible">Buscar</Label>
              <Button block size="sm" color="dark" onClick={this.filter}>Buscar</Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
    const trips = this.state.trips.map((trip) => {
      return (
        <tr key={trip.id}>
          <td>{trip.id}</td>
          <td>{Moment(trip.start_time).format('DD-MM-YYYY')}</td>
          <td>{this.formatearChofer(trip.driver_name, trip.driver_lastname)}</td>
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
            );
    });
    const paginator = this.state.pages.map((page, index) => {
      return (
          <PaginationItem>
            <PaginationLink value={index} onClick={this.onClickHandle} tag="button">{index + 1}</PaginationLink>
          </PaginationItem>
      )
    });
    return (
      <div className="animated fadeIn">
        <h1>Viajes</h1>
        <br/>
        {filter}
        <Row>
          <Col xs="20" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Listado de viajes
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Id</th>
                    <th>Fecha de inicio</th>
                    <th>Chofer</th>
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
                    {trips}
                  </tbody>
                </Table>
                <Pagination>
                  {paginator}
                </Pagination>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    );
  }
}

export default Viajes;
