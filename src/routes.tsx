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

import SplashScreen from './components/SplashScreen';

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
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/confirm-email" component={ConfirmEmail} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/change-password" component={ChangePassword} />

        <Route path="/" exact component={Landing} />
        <Route path="/app" component={OrphanagesMap} />
        <Route path="/orphanages/create" component={CreateOrphanage} />
        <Route path="/orphanages/:id" exact component={Orphanage} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;