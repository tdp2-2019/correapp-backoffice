import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import { Button, Card, CardBody, CardHeader, Col, Row, Table, FormGroup, Label, Input, Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const items_per_page = 5;

class Cliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: [],
      client_all_trips: [],
      client_trips: [],
      client_trips_pages: [],
      comment: "",
      show_modal: false,
      action_modal: "",
      id: props.match.params.id
    }
    this.handleChange = this.handleChange.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.approveUser = this.approveUser.bind(this);
    this.onClickPaginatorHandle = this.onClickPaginatorHandle.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
  }

  componentDidMount() {
    fetch('https://correapp-api.herokuapp.com/users/' + this.state.id)
      .then(response => response.json())
      .then(data =>{
        this.setState({ client: [data], comment: data.comment });
      });
    fetch('https://correapp-api.herokuapp.com/trips?user_id=' + this.state.id)
      .then(response => response.json())
      .then(data_trips => {
        if(typeof data_trips.errorCode == 'undefined') {
          var pages =[];
          var currentPage = [];
          data_trips.forEach((trip) => {
            currentPage.push(trip);
            if (currentPage.length == items_per_page) {
              pages.push(currentPage);
              currentPage = [];
            }
          });
          if (data_trips.length % items_per_page !== 0) {
            pages.push(currentPage);
          }
          this.setState({client_all_trips: data_trips, client_trips: pages[0]? pages[0] : [], client_trips_pages: pages? pages : [] });
        }
      });
  }

  handleToggleModal(action) {
    this.setState(prevState => ({
      show_modal: !prevState.show_modal,
      action_modal: action
    }));
  }

  handleChange(event) {
    this.setState({comment: event.target.value});
  }

  onClickPaginatorHandle(event) {
    this.setState({client_trips: this.state.client_trips_pages[event.target.value]});
  }

  blockUser() {
    fetch('https://correapp-api.herokuapp.com/users/' + this.state.id,
      {
        method: "put",
        body:JSON.stringify({status: 'Bloqueado', comment: this.state.comment}),
        headers: {"content-type" : "application/json"}
      }
    )
    .then(response => response.json())
    .then(data => {
      this.setState({ show_modal: false });
      window.location.reload();
    });
  }

  approveUser() {
    fetch('https://correapp-api.herokuapp.com/users/' + this.state.id,
        {
          method: "put",
          body:JSON.stringify({status: 'Habilitado', comment: this.state.comment}),
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
    const client_trips = this.state.client_trips.map((trip) => {
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
            <i className="cui-location-pin h5"></i>
          </Link>
          <Link to={"/viajes/"+trip.id}>
            <i className="cui-cursor h5"></i>
          </Link>
        </td>
        </tr>
      )
    });
    const paginator = this.state.client_trips_pages.map((page, index) => {
      return (
          <PaginationItem key="paginador">
            <PaginationLink value={index} onClick={this.onClickPaginatorHandle} tag="button">{index + 1}</PaginationLink>
          </PaginationItem>
      )
    });
    const client_trips_container = this.state.client.map((d) => {
        if (this.state.client_trips.length == 0) {
            return(
                <p key="client_container">El cliente no realizó ningun viaje</p>
            );
        }
        return(
            <div key="client_container">
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
                {client_trips}
              </tbody>
            </Table>
            <Pagination>
              {paginator}
            </Pagination>
            </div>
        );
    });
    const client = this.state.client.map((d) => {
      return (
        <tbody key="client">
          <tr key="Nombre">
            <td>Nombre</td>
            <td><b>{d.name}</b></td>
          </tr>
          <tr key="Apellido">
            <td>Apellido</td>
            <td><b>{d.lastname}</b></td>
          </tr>
          <tr key="Email">
            <td>Email</td>
            <td><b>{d.email}</b></td>
          </tr>
        </tbody>
      )
    });


    const status_and_rating = this.state.client.map((d) => {
      return (
        <div key="client">
        <Row>
          <Col><h3>{d.name + " " + d.lastname}</h3><br/></Col>
        </Row>
        <Row className="align-bottom">
          <Col>
            <p><b>Viajes realizados: </b>{this.state.client_trips.length}</p>
            <p><b>Status: </b>{d.status} {this.state.comment ? " (" + this.state.comment + ")" : null}</p>
            <p><b>Rating: </b>{d.rating}</p>
          </Col>
        </Row>
        </div>
      )
    });

    const profile_pic = this.state.client.map((d) => {
      return(
        <div key="profile_pic">
          <img className="img-fluid" src={d.photo_url} />
        </div>
      )
    });

    const buttons = this.state.client.map((d) => {
      return (
        <div key="buttons">
            <Button className="btn-pill" block color={this.state.client[0].status == "Bloqueado" ? "success" : "dark"}

                    onClick={() =>{
                        if(this.state.client[0].status == "Bloqueado"){
                            this.handleToggleModal("aprobar")
                        } else {
                            this.handleToggleModal("bloquear")
                        }
                    }
                    }

                    >{this.state.client[0].status == "Habilitado" ? "Bloquear" : "Habilitar"}
            </Button>
        </div>
      )
    });
    const comment = this.state.client.map((d) => {
      return (
      <FormGroup key="comment">
        <Label htmlFor="textarea-input"><h5>¿Por qué vas a {this.state.action_modal} a este cliente?</h5></Label>
        <Input type="textarea" name="textarea-input" id="textarea-input" rows="9" placeholder="Ingresar comentario" onChange={this.handleChange} />
      </FormGroup>
    )
    });
    return (
      <div className="animated fadeIn">
        <h2>Ficha del Cliente</h2>
        <br/>
        <Row className="row-eq-height">
          <Col>{profile_pic}</Col>
          <Col>{status_and_rating}</Col>
          <Col>{buttons}</Col>
        </Row>
        <br/>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Datos personales
              </CardHeader>
              <CardBody>
                  <Table hover bordered striped responsive size="sm">
                      {client}
                  </Table>
              </CardBody>
            </Card>
          </Col>
          <Col>
          </Col>
        </Row>
        <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Viajes del cliente
        </CardHeader>
        <CardBody>
            {client_trips_container}
        </CardBody>
        </Card>
        <Modal isOpen={this.state.show_modal} toggle={() => this.handleToggleModal("") }>
          <ModalBody>{comment}</ModalBody>
          <ModalFooter>
            { this.state.action_modal == "bloquear" ? <Button color="dark" onClick={this.blockUser}>Bloquear</Button> : null }
            { this.state.action_modal == "aprobar" ? <Button color="success" onClick={this.approveUser}>Aprobar</Button> : null }
            {' '}
            <Button color="secondary" onClick={() => this.handleToggleModal("")}>Cerrar</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default Cliente;
