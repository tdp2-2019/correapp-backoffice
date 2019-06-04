import React from 'react';

const Choferes = React.lazy(() => import('./views/Base/Choferes/Choferes'));
const Chofer = React.lazy(() => import('./views/Base/Choferes/Chofer'));
const Viajes = React.lazy(() => import('./views/Base/Viajes/Viajes'));
const Viaje = React.lazy(() => import('./views/Base/Viajes/Viaje'));
const Clientes = React.lazy(() => import('./views/Base/Clientes/Clientes'));
const Cliente = React.lazy(() => import('./views/Base/Clientes/Cliente'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/choferes/:id', exact: true, name: 'Chofer', component: Chofer },
  { path: '/choferes', name: 'Choferes', component: Choferes },
  { path: '/viajes/:id', exact: true, name: 'Viaje', component: Viaje },
  { path: '/viajes', name: 'Viajes', component: Viajes },
    { path: '/clientes/:id', exact: true, name: 'Cliente', component: Cliente },
    { path: '/clientes', name: 'Clientes', component: Clientes }

];

export default routes;
