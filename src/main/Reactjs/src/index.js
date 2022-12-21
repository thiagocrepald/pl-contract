import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import './assets/vendor/nucleo/css/nucleo.css';
import './assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
import './assets/scss/argon-dashboard-react.scss';

import AdminLayout from './layouts/Admin.jsx';
import AuthLayout from './layouts/Auth.jsx';


import './config/i18n';

Sentry.init({
    dsn: "https://beca385423234ac9ae278a46c66e28eb@o62558.ingest.sentry.io/5885228",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });

ReactDOM.render(
    <Sentry.ErrorBoundary>
        <BrowserRouter>
            <Switch>
                <Route path="/admin" render={props => <AdminLayout {...props} />} />
                <Route path="/auth" render={props => <AuthLayout {...props} />} />
                <Redirect from="/" to="/auth/login" />
            </Switch>
        </BrowserRouter>
    </Sentry.ErrorBoundary>,
    document.getElementById('root')
);
