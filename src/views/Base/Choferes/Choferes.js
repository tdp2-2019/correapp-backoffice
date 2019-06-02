import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Form, FormGroup, Label, Input } from 'reactstrap';

const items_per_page = 2;

class Choferes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_drivers: [],
      drivers: [],
      pages:[],
      nombre_filter: "",
      apellido_filter: "",
      patente_filter: "",
      email_filter: "",
      queryparams: ""
    }
    this.fetchDrivers = this.fetchDrivers.bind(this);
    this.onClickHandle = this.onClickHandle.bind(this);
    this.filter = this.filter.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleApellidoChange = this.handleApellidoChange.bind(this);
    this.handlePatenteChange = this.handlePatenteChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }
  
  componentDidMount() {
    fetch('https://correapp-api.herokuapp.com/drivers')
      .then(response => response.json())
      .then(data =>{
        var pages =[];
        var currentPage = [];
        data.forEach((driver) => {
          currentPage.push(driver);
          if (currentPage.length == items_per_page) {
            pages.push(currentPage);
            currentPage = [];
          }
        });
        if (data.length % items_per_page !== 0) {
          pages.push(currentPage);
        }
        this.setState({ all_drivers: data, drivers: pages[0]? pages[0] : [], pages: pages? pages : [] });
      });
  }
  
  fetchDrivers() {
    const request = require('request');
    var driv;
    request.get({url: 'https://correapp-api.herokuapp.com/drivers', headers: {'accept' : 'json'}}, function (error, response, body) {
      driv = JSON.parse(body);
    });
    this.setState({drivers : driv});
  }
  
  onClickHandle(event) {
    this.setState({drivers: this.state.pages[event.target.value]});
  }
  
  filter(event) {
    var selected_drivers = [];
    this.state.all_drivers.forEach((driver) => {
      if (this.state.nombre_filter !== "") {
        if(!driver.name.toLowerCase().includes(this.state.nombre_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.apellido_filter !== "") {
        if(!driver.lastname.toLowerCase().includes(this.state.apellido_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.patente_filter !== "") {
        if(!driver.carlicenseplate.toLowerCase().includes(this.state.patente_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.email_filter !== "") {
        if(!driver.email.toLowerCase().includes(this.state.email_filter.toLowerCase())) {
          return;
        }
      }
      selected_drivers.push(driver);
    });
    var pages = [];
    var currentPage = [];
    selected_drivers.forEach((driver) => {
      currentPage.push(driver);
      if (currentPage.length == items_per_page) {
        pages.push(currentPage);
        currentPage = [];
      }
    });
    if (selected_drivers.length % items_per_page !== 0) {
      pages.push(currentPage);
    }
    this.setState({drivers: pages[0]? pages[0] : [], pages: pages? pages :[]});
  }
  
  handleNombreChange(event) {
    const value = event.target.value;
    this.setState({nombre_filter : value});
  }
  
  handleApellidoChange(event) {
    const value = event.target.value;
    this.setState({apellido_filter : value});
  }
  
  handlePatenteChange(event) {
    const value = event.target.value;
    this.setState({patente_filter : value});
  }
  
  handleEmailChange(event) {
    const value = event.target.value;
    this.setState({email_filter : value});
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
    <Label htmlFor="Nombre" className="pr-1">Nombre</Label>
    <Input type="text" id="nombre_filter" placeholder="Juan" value={this.state.nombre_filter} onChange={this.handleNombreChange}/>
    </FormGroup>
    <FormGroup className="pr-1">
    <Label htmlFor="Apellido" className="pr-1">Apellido</Label>
    <Input type="text" id="Apellido" placeholder="Perez" value={this.state.apellido_filter} onChange={this.handleApellidoChange} />
    </FormGroup>
    <FormGroup className="pr-1">
    <Label htmlFor="Patente" className="pr-1">Patente</Label>
    <Input type="text" id="Patente" placeholder="OSO300" value={this.state.patente_filter} onChange={this.handlePatenteChange} />
    </FormGroup>
    <FormGroup className="pr-1">
    <Label htmlFor="Email" className="pr-1">Email</Label>
    <Input type="text" id="Email" placeholder="taller@fiuba.com" value={this.state.email_filter} onChange={this.handleEmailChange} />
    </FormGroup>
    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
    <Button block color="dark" onClick={this.filter}>Buscar</Button>
    </Col>
    </Form>
    </CardBody>
    </Card>
    const paginator = this.state.pages.map((page, index) => {
      return (
          <PaginationItem key={index}>
            <PaginationLink value={index} onClick={this.onClickHandle} tag="button">{index}</PaginationLink>
          </PaginationItem>
      )
    });
    const drivers = this.state.drivers.map((driver) => {
      return (
        <tr key={driver.id}>
          <td>
            <div className="avatar">
              <img className="img-avatar" src={driver.photo_url} />
            </div>
          </td>
          <td>
          <Link to={"/choferes/"+driver.id}>
          <button className="btn btn-link p-0">{driver.id}</button>
          </Link>
          </td>
          <td>{driver.name}</td>
          <td>{driver.lastname}</td>
          <td>
            {driver.carlicenseplate}
          </td>
          <td>
            {driver.email}
          </td>
        </tr>
              );
    });
    return (
      <div className="animated fadeIn">
      {filter}
        <Row>
          <Col xs="20" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Lista de choferes
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Patente</th>
                    <th>Email</th>
                  </tr>
                  </thead>
                  <tbody>
                    {drivers}
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

export default Choferes;
