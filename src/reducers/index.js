import {combineReducers} from 'redux';
import { connectRouter } from 'connected-react-router';
import language from './languageReducer';
import api from './apiReducer';
import ui from './uiReducer';
import user from './userReducer';
import branch from './branchReducer';
import sys from './sysReducer';
import refresh from './refreshReducer';
import filter from './filterReducer';
import refreshComponent from './refreshComponentReducer';

export default (history) => combineReducers({
    router: connectRouter(history),
    language,
    api,
    ui,
    user,
    branch,
    sys,
    refresh,
    filter,
    refreshComponent
});
