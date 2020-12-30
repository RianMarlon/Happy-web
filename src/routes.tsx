import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import ConfirmEmail from './pages/ConfirmEmail';
import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';
import Orphanage from './pages/Orphanage';
import CreateOrphanage from './pages/CreateOrphanage';

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