import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Form, FormGroup, Label, Input } from 'reactstrap';

const items_per_page = 5;

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
      status_filter: "",
      queryparams: ""
    }
    this.fetchDrivers = this.fetchDrivers.bind(this);
    this.onClickHandle = this.onClickHandle.bind(this);
    this.filter = this.filter.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleApellidoChange = this.handleApellidoChange.bind(this);
    this.handlePatenteChange = this.handlePatenteChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
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

  handleStatusChange(event) {
    const value = event.target.value;
    this.setState({status_filter : value});
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
      if (this.state.status_filter !== "") {
        if(!driver.status.toLowerCase().includes(this.state.status_filter.toLowerCase())) {
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
        <Form action="" method="">
          <Row className="no-gutters">
            <Col className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="nombre_filter">Nombre:</Label>
              <Input type="text" id="nombre_filter" placeholder="Ej: Juan" size="sm" value={this.state.nombre_filter} onChange={this.handleNombreChange}/>
            </Col>
            <Col className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="Apellido">Apellido:</Label>
              <Input type="text" id="Apellido" placeholder="Ej: Perez" size="sm" value={this.state.apellido_filter} onChange={this.handleApellidoChange} />
            </Col>
            <Col className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="Patente">Patente:</Label>
              <Input type="text" id="Patente" placeholder="Ej: OSO300" size="sm" value={this.state.patente_filter} onChange={this.handlePatenteChange} />
            </Col>
            <Col className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="Email">Email:</Label>
              <Input type="text" id="Patente" placeholder="Ej: OSO300" size="sm" value={this.state.email_filter} onChange={this.handleEmailChange} />
            </Col>
            <Col className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="status_filter">Status:</Label>
              <Input type="select" id="status_filter" placeholder="Ej: En proceso" size="sm" value={this.state.status_filter} onChange={this.handleStatusChange}>
                <option hidden value="">Ej: Confirmado</option>
                <option value="">Todos</option>
                <option value="Aprobado">Aprobado</option>
                <option value="No confirmado">No confirmado</option>
                <option value="Bloqueado">Bloqueado</option>
              </Input>
            </Col>
            <Col>
              <Label size="sm" className="mb-0 invisible">Buscar</Label>
              <Button block size="sm" color="dark" onClick={this.filter}>Buscar</Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
    const paginator = this.state.pages.map((page, index) => {
      return (
          <PaginationItem key={index}>
            <PaginationLink value={index} onClick={this.onClickHandle} tag="button">{index + 1}</PaginationLink>
          </PaginationItem>
      )
    });
    const drivers = this.state.drivers.map((driver) => {
      return (
        <tr key={driver.id}>
          <td class="align-middle">{driver.id}</td>
          <td class="text-center align-middle">
            <div className="avatar">
              <img className="img-avatar" src={driver.photo_url} />
            </div>
          </td>
          <td class="align-middle">{driver.name}</td>
          <td class="align-middle">{driver.lastname}</td>
          <td class="align-middle">{driver.carlicenseplate}</td>
          <td class="align-middle">{driver.email}</td>
          <td  class="align-middle">{driver.status}</td>
          <td class="align-middle">
            <Link to={"/choferes/"+driver.id}>
              <i class="cui-cursor h5"></i>
            </Link>
          </td>
        </tr>
              );
    });
    return (
      <div className="animated fadeIn">
        <h1>Choferes</h1>
        <br/>
        {filter}
        <Row>
          <Col xs="20" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Listado de choferes
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Id</th>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Patente</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
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
