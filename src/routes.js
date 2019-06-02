import React from 'react';

const Choferes = React.lazy(() => import('./views/Base/Choferes/Choferes'));
const Chofer = React.lazy(() => import('./views/Base/Choferes/Chofer'));
const Viajes = React.lazy(() => import('./views/Base/Viajes/Viajes'));
const Viaje = React.lazy(() => import('./views/Base/Viajes/Mapa'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/choferes/:id', exact: true, name: 'Chofer', component: Chofer },
  { path: '/choferes', name: 'Choferes', component: Choferes },
  { path: '/viajes/:id', exact: true, name: 'Viaje', component: Viaje },
  { path: '/viajes', name: 'Viajes', component: Viajes }
];

export default routes;
