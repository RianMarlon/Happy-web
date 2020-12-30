import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import AuthContext from './contexts/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import ConfirmEmail from './pages/ConfirmEmail';
import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';
import Orphanage from './pages/Orphanage';
import CreateOrphanage from './pages/CreateOrphanage';
import OrphanagesConfirmed from './pages/OrphanagesConfirmed';
import OrphanagesPending from './pages/OrphanagesPending';
import ConfirmOrphanage from './pages/ConfirmOrphanage';
import DeleteOrphanage from './pages/DeleteOrphanage';
import EditOrphanage from './pages/EditOrphanage';

import SplashScreen from './components/SplashScreen';

const AdminRoute = ({component, ...rest}: any) => {
  const { isValidToken, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }
  
  const routeComponent = (props: any) => {
    return isValidToken && isAdmin
      ? React.createElement(component, props)
      : <Redirect to={{pathname: '/login', state: { from: props.location }}} />
  }
  
  return <Route {...rest} render={routeComponent} />;
};

const PrivateRoute = ({component, ...rest}: any) => {
  const { isValidToken, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }
  
  const routeComponent = (props: any) => {
    return isValidToken
      ? React.createElement(component, props)
      : <Redirect to={{pathname: '/login', state: { from: props.location }}} />
  }
  
  return <Route {...rest} render={routeComponent} />;
};

const PublicRoute = ({component, ...rest}: any) => {
  const { isValidToken, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }

  const routeComponent = (props: any) => (
    !isValidToken
      ? React.createElement(component, props)
      : <Redirect to={{pathname: '/', state: { from: props.location }}} />
  );
  
  return <Route {...rest} render={routeComponent} />;
};

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />
        <PublicRoute path="/confirm-email" component={ConfirmEmail} />
        <PublicRoute path="/forgot-password" component={ForgotPassword} />
        <PublicRoute path="/change-password" component={ChangePassword} />

        <PrivateRoute path="/" exact component={Landing} />
        <PrivateRoute path="/app" component={OrphanagesMap} />
        <PrivateRoute path="/orphanages/create" component={CreateOrphanage} />
        <PrivateRoute path="/orphanages/:id" exact component={Orphanage} />

        <AdminRoute path="/orphanages-confirmed" component={OrphanagesConfirmed} />
        <AdminRoute path="/orphanages-pending" component={OrphanagesPending} />
        <AdminRoute path="/orphanages/confirm/:id" component={ConfirmOrphanage} />
        <AdminRoute path="/orphanages/delete/:id" component={DeleteOrphanage} />
        <AdminRoute path="/orphanages/edit/:id" component={EditOrphanage} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;