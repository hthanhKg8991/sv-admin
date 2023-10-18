import jwt from 'jsonwebtoken';
import React  from 'react';
import * as types from '../utils/ConstantActionTypes';
import * as Constant from "utils/Constant";
import AdminStorage from "utils/storage";

export function putToastSuccess(msg){
    return function(dispatch) {
        dispatch({
            type: types.PUT_TOAST_SUCCESS,
            payload: {
                msg: msg,
                uid: Math.random()
            }
        });
    }
}
export function putToastError(msg){
    return function(dispatch) {
        dispatch({
            type: types.PUT_TOAST_ERROR,
            payload: {
                msg: msg,
                uid: Math.random()
            }
        });
    }
}
export function putToastWarning(msg){
    return function(dispatch) {
        dispatch({
            type: types.PUT_TOAST_WARNING,
            payload: {
                msg: msg,
                uid: Math.random()
            }
        });
    }
}
export function showLoading(id = null){
    return function(dispatch) {
        dispatch({
            type: types.SHOW_LOADING,
            id: id
        });
    }
}
export function hideLoading(id = null){
    return function(dispatch) {
        dispatch({
            type: types.HIDE_LOADING,
            id: id
        });
    }
}
export function changeLanguage(language) {
    AdminStorage.setLang(language);
    return dispatch => {
        dispatch({type: language, language: language})
    }
}
export function changeBranch(current,branch) {
    return dispatch => {
        let currentBranch = current;
        // Nếu không có thì mặc định lấy Branch Null
        if(!current){
            currentBranch = branch.branch.length > 0 ? { ...branch.branch[0], ...Constant.BRANCH_ALL } : null ;
        }
        const branch_localStorage = {...branch,currentBranch};
        AdminStorage.setItem('branch_localStorage', jwt.sign(branch_localStorage, Constant.JWT_SECRET_KEY));
        dispatch({
            type: types.BRANCH_CHANGE,
            payload: branch_localStorage
        });
    }
}
export function createPopup(Component = null ,title = "",propsComponent = {}, classname = '', style = {}) {
    return dispatch => {
        dispatch({
            type: types.SHOW_POPUP,
            payload: {
                Component: Component,
                title: title,
                propsComponent:propsComponent,
                classname: classname,
                style: style
            }
        });
    }
}
export function deletePopup(refrest_type = 0, delay = 0) {
    return dispatch => {
        dispatch({
            type: types.HIDDEN_POPUP,
            payload: {
                Component: null,
                title: "",
                refrest_type: refrest_type,
                delay: delay
            }
        });
    }
}
export function factoryReset(){
    return function(dispatch) {
        dispatch(SmartMessageBox(
            {
                title: <span><i className='fa fa-refresh' style={{color: "green"}}/> Clear Local Storage</span>,
                content: "Would you like to RESET all your saved widgets and clear LocalStorage?",
                buttons: ["No","Yes"]
            },
            (ButtonPressed)=>{
                if (ButtonPressed === "Yes") {
                    let token_FE = AdminStorage.getItem('token_FE');
                    AdminStorage.clear();
                    AdminStorage.setItem('token_FE', token_FE);
                    window.location.reload();
                }
            }
        ));
    }
}
export function SmartMessageBox(data, cb) {
    return dispatch => {
        dispatch({
            type: types.SHOW_MESSAGE_BOX,
            payload: {
                title: data.title,
                content: data.content,
                buttons: data.buttons,
                ButtonPressed: cb
            }
        })
    }
}
export function SmartMessageBoxV2(data, cb) {
	return dispatch => {
		 dispatch({
			  type: types.SHOW_MESSAGE_BOX_V2,
			  payload: {
					title: data.title,
					content: data.content,
					buttons: data.buttons,
					styles: data.styles,
					uniqueKey: data.uniqueKey,
					optional: data.optional,
					ButtonPressed: cb,
			  }
		 })
	}
}
export function hideSmartMessageBox() {
    return dispatch => {
        dispatch({type: types.HIDDEN_MESSAGE_BOX})
    }
}
export function hideSmartMessageBoxV2() {
	return dispatch => {
		 dispatch({type: types.HIDDEN_MESSAGE_BOX_V2})
	}
}
export function addSOStaffId(old_staff_id, recent_staff_id) {
	return dispatch => {
		 dispatch({
            type: types.ASSIGNED_STAFF_OLD, 
            recent_staff_id: recent_staff_id || null,
            old_staff_id: old_staff_id || null
        })
	}
}
export function refreshPage(){
    window.location.reload();
}

export function reloadWithoutQuery(){
    window.location = window.location.href.split("?")[0];
}

export function refreshList(name = 'all', payload = {}) {
    return dispatch => {
        dispatch({
            type: types.REFRESH_LIST,
            name: name,
            payload: payload
        });
    }
}
export function deleteRefreshList(name = 'all') {
    return dispatch => {
        dispatch({
            type: types.DELETE_REFRESH_LIST,
            name: name
        });
    }
}

export const refreshComponent = (name) => {
    return dispatch => {
        dispatch({
            type: types.REFRESH_COMPONENT,
            name: name
        });
    }
};
