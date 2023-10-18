import * as types from '../utils/ConstantActionTypes';
import * as Constant from "utils/Constant";

export function requestApi(fnRequest, service = "" ,url = "", args, delay = 0, putToast = true, prefix = "") {
    return function(dispatch) {
        fnRequest(service, url, args, delay)
            .then(response => {
                    response.info = {fnRequest, service, url, args, delay};
                    dispatch({
                        type: types.RECEIVIE_API,
                        url: `${url}${prefix}` ,
                        payload: response
                    });
                    if(putToast){
                        if (![Constant.CODE_SUCCESS, Constant.CODE_NON_RECORD].includes(response.code)) {
                            dispatch({type: types.PUT_TOAST_ERROR, payload: {msg: response.msg, uid: Math.random()}});
                        }
                        if([Constant.CODE_NON_RECORD].includes(response.code)){
                            dispatch({type: types.PUT_TOAST_WARNING, payload: {msg: response.msg, uid: Math.random()}});
                        }
                    }
            })
            .catch(error => {
                dispatch({
                    type: types.RECEIVIE_API,
                    url: `${url}${prefix}`,
                    payload: {code: -1}
                });
                // off Errors Log
                console.log(error, "giá trị error");
                // dispatch({type: types.PUT_TOAST_ERROR, payload: {msg: 'requestApi: ' + String(error), uid: Math.random()}});
            });
    }
}

export function deleteRequestApi(url){
    return function(dispatch) {
        dispatch({
            type: types.DELETE_RECEIVIE_API,
            url: url
        });
    }
}
