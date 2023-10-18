import jwt from 'jsonwebtoken';
import * as Constant from "utils/Constant";
import * as types from '../utils/ConstantActionTypes';
import _ from "lodash";
import AdminStorage from "utils/storage";
import { googleLogout } from '@react-oauth/google';

export function userInfo(token_FE) {
    let decoded = jwt.decode(token_FE, Constant.JWT_SECRET_KEY);

    decoded.isRole = function (division_code) {
        if (Array.isArray(division_code)) {
            return division_code.includes(this.division_code);
        }

        return division_code === this.division_code;
    };

    decoded.can = function (role) {
        return _.has(this.scopes, role);
    };

    return dispatch => {
        dispatch({type: types.USER_INFO_SUCCESS, payload: {user: decoded}});
    }
}

export function logout(token_expired = false, current_page = {}) {
    googleLogout();
    AdminStorage.clear();
    //log current page
    AdminStorage.setItem('referrer_url', String(window.location.pathname + window.location.search));
    return dispatch => {
        dispatch({type: types.BRANCH_CHANGE, payload: {}});
        dispatch({type: types.USER_LOGOUT});
        dispatch({type: types.LOGOUT_SUCCESS});
    }
}

export function changeProfile(user) {
    AdminStorage.setItem('token_FE', jwt.sign(user, Constant.JWT_SECRET_KEY));
    return dispatch => {
        dispatch({type: types.USER_INFO_SUCCESS, payload: {user: user}});
    }
}
