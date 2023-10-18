import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import {history, store} from 'store';
import Routes from 'routes';
import Toast from "components/Common/Ui/Toast";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import Common from "components/Layout/Common";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// Sentry
Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.1,
});

const Application = (
    <Provider store={store}>
        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
            <Toast />
            <Common>
                <ConnectedRouter history={history}>
                    <Routes />
                </ConnectedRouter>
            </Common>
        </MuiPickersUtilsProvider>
    </Provider>
);

const root = document.getElementById('smartadmin-root');

render(Application, root);

