import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from 'reducers';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, createMemoryHistory } from 'history';

export const isServer = !(typeof window !== 'undefined' && window.document && window.document.createElement);

export default (url = '/') => {
    const history = isServer ? createMemoryHistory({initialEntries: [url]}) : createBrowserHistory();
    const enhancers = [];
    if (process.env.NODE_ENV === 'development' && !isServer) {
        const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
        if (typeof devToolsExtension === 'function') {
            enhancers.push(devToolsExtension());
        }
    }
    const middleware = [thunk, routerMiddleware(history)];
    const composedEnhancers = compose(
        applyMiddleware(...middleware),
        ...enhancers
    );
    const initialState = !isServer ? window.__PRELOADED_STATE__ : {};
    if (!isServer) {
        delete window.__PRELOADED_STATE__;
    }
    const store = createStore(
        rootReducer(history),
        initialState,
        composedEnhancers
    );
    return {store, history};
}

