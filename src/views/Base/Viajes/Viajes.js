import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Form, FormGroup, Label, Input } from 'reactstrap';

const items_per_page = 2;

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
      chofer_filter: ""
    }
    this.onClickHandle = this.onClickHandle.bind(this);
    this.handleOrigenChange = this.handleOrigenChange.bind(this);
    this.handleDestinoChange = this.handleDestinoChange.bind(this);
    this.handleDuracionChange = this.handleDuracionChange.bind(this);
    this.handleChoferChange = this.handleChoferChange.bind(this);
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
        if(!trip.source.toLowerCase().includes(this.state.origen_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.destino_filter !== "") {
        if(!trip.destination.toLowerCase().includes(this.state.destino_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.duracion_filter !== "") {
        if(!trip.duration.toLowerCase().includes(this.state.duracion_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.chofer_filter !== "") {
        if(!trip.driver_id.toLowerCase().includes(this.state.chofer_filter.toLowerCase())) {
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
  
  render() {
    const filter =
    <Card>
      <CardHeader>
        <i className="fa fa-align-justify"></i> Filtros
      </CardHeader>
      <CardBody>
        <Form action="" method="" inline>
          <FormGroup className="pr-1">
            <Label htmlFor="Origen" className="pr-1">Origen</Label>
            <Input type="text" id="origen_filter" placeholder="origen" value={this.state.origen_filter} onChange={this.handleOrigenChange}/>
          </FormGroup>
          <FormGroup className="pr-1">
            <Label htmlFor="Destino" className="pr-1">Destino</Label>
            <Input type="text" id="Destino" placeholder="destino" value={this.state.destino_filter} onChange={this.handleDestinoChange} />
          </FormGroup>
          <FormGroup className="pr-1">
            <Label htmlFor="Duracion" className="pr-1">Duracion</Label>
            <Input type="text" id="Duracion" placeholder="1234" value={this.state.duracion_filter} onChange={this.handleDuracionChange} />
          </FormGroup>
          <FormGroup className="pr-1">
            <Label htmlFor="Chofer" className="pr-1">Chofer</Label>
            <Input type="text" id="Chofer" placeholder="123" value={this.state.chofer_filter} onChange={this.handleChoferChange} />
          </FormGroup>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Button block color="dark" onClick={this.filter}>Buscar</Button>
          </Col>
        </Form>
      </CardBody>
    </Card>
    const trips = this.state.trips.map((trip) => {
      return (
        <tr key={trip.id}>
          <td>{trip.id}</td>
          <td>{trip.driver_id}</td>
          <td>{trip.client}</td>
          <td>{trip.status}</td>
          <td>$ {Math.round(trip.price * 100) / 100 }</td>
          <td>{trip.start_time}</td>
          <td>
            <Link to={"/viajes/"+trip.id}>
              <button className="btn btn-link p-0">Ver Mapa</button>
            </Link>
          </td>
        </tr>
            );
    });
    const paginator = this.state.pages.map((page, index) => {
      return (
          <PaginationItem>
            <PaginationLink value={index} onClick={this.onClickHandle} tag="button">{index}</PaginationLink>
          </PaginationItem>
      )
    });
    return (
      <div className="animated fadeIn">
        {filter}
        <Row>
          <Col xs="20" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Lista de viajes
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                  <tr>
                    <th>Id</th>
                    <th>Chofer</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Precio</th>
                    <th>Fecha de inicio</th>
                    <th>Mapa</th>
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
