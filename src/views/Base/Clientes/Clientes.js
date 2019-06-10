import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table, Form, FormGroup, Label, Input } from 'reactstrap';

const items_per_page = 5;

class Clientes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_clients: [],
      clients: [],
      pages:[],
      nombre_filter: "",
      apellido_filter: "",
      email_filter: "",
      status_filter: "",
      queryparams: ""
    }
    this.fetchClients = this.fetchClients.bind(this);
    this.onClickHandle = this.onClickHandle.bind(this);
    this.filter = this.filter.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleApellidoChange = this.handleApellidoChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    fetch('https://correapp-api.herokuapp.com/users')
      .then(response => response.json())
      .then(data =>{
        var pages =[];
        var currentPage = [];
        data.forEach((user) => {
          currentPage.push(user);
          if (currentPage.length == items_per_page) {
            pages.push(currentPage);
            currentPage = [];
          }
        });
        if (data.length % items_per_page !== 0) {
          pages.push(currentPage);
        }
        this.setState({ all_clients: data, clients: pages[0]? pages[0] : [], pages: pages? pages : [] });
      });
  }

  fetchClients() {
    const request = require('request');
    var driv;
    request.get({url: 'https://correapp-api.herokuapp.com/users', headers: {'accept' : 'json'}}, function (error, response, body) {
      driv = JSON.parse(body);
    });
    this.setState({clients : driv});
  }

  onClickHandle(event) {
    this.setState({clients: this.state.pages[event.target.value]});
  }

  handleStatusChange(event) {
    const value = event.target.value;
    this.setState({status_filter : value});
  }

  filter(event) {
    var selected_clients = [];
    this.state.all_clients.forEach((client) => {
      if (this.state.nombre_filter !== "") {
        if(!client.name.toLowerCase().includes(this.state.nombre_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.apellido_filter !== "") {
        if(!client.lastname.toLowerCase().includes(this.state.apellido_filter.toLowerCase())) {
          return;
        }
      }

      if (this.state.email_filter !== "") {
        if(!client.email.toLowerCase().includes(this.state.email_filter.toLowerCase())) {
          return;
        }
      }
      if (this.state.status_filter !== "") {
        if(!client.status.toLowerCase().includes(this.state.status_filter.toLowerCase())) {
          return;
        }
      }
      selected_clients.push(client);
    });
    var pages = [];
    var currentPage = [];
    selected_clients.forEach((client) => {
      currentPage.push(client);
      if (currentPage.length == items_per_page) {
        pages.push(currentPage);
        currentPage = [];
      }
    });
    if (selected_clients.length % items_per_page !== 0) {
      pages.push(currentPage);
    }
    this.setState({clients: pages[0]? pages[0] : [], pages: pages? pages :[]});
  }

  handleNombreChange(event) {
    const value = event.target.value;
    this.setState({nombre_filter : value});
  }

  handleApellidoChange(event) {
    const value = event.target.value;
    this.setState({apellido_filter : value});
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
              <Label size="sm" className="mb-0" htmlFor="Email">Email:</Label>
              <Input type="text" id="Patente" placeholder="Ej: OSO300" size="sm" value={this.state.email_filter} onChange={this.handleEmailChange} />
            </Col>
            <Col className="pr-1">
              <Label size="sm" className="mb-0" htmlFor="status_filter">Status:</Label>
              <Input type="select" id="status_filter" placeholder="Ej: En proceso" size="sm" value={this.state.status_filter} onChange={this.handleStatusChange}>
                <option hidden value="">Ej: Habilitado</option>
                <option value="">Todos</option>
                <option value="Habilitado">Habilitado</option>
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
    const clients = this.state.clients.map((client) => {
      return (
        <tr key={client.id}>
          <td class="align-middle">{client.id}</td>
          <td class="text-center align-middle">
            <div className="avatar">
              <img className="img-avatar" src={client.photo_url} />
            </div>
          </td>
          <td class="align-middle">{client.name}</td>
          <td class="align-middle">{client.lastname}</td>
          <td class="align-middle">{client.email}</td>
          <td  class="align-middle">{client.status}</td>
            <td className="align-middle">
                <Link to={"/clientes/" + client.id}>
                    <i className="cui-cursor h5"></i>
                </Link>
            </td>
        </tr>
              );
    });
    return (
      <div className="animated fadeIn">
        <h1>Clientes</h1>
        <br/>
        {filter}
        <Row>
          <Col xs="20" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Listado de clientes
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                  <tr>
                    <th>Id</th>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                    {clients}
                  </tbody>
                </Table>
                <Pagination>
                  {paginator}
                </Pagination>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <h3 align="center">{this.state.clients.length == 0 ? "No se encontraron resultados para su búsqueda" : ""} </h3>
      </div>

    );
  }
}

export default Clientes;
