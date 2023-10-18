import * as types from "utils/ConstantActionTypes";

export function pushFilter(id, params){
    return function(dispatch) {
        dispatch({
            type: types.PUSH_FILTER,
            id: id,
            params: params
        });
    }
}

export function removeFilter(id){
    return function(dispatch) {
        dispatch({
            type: types.REMOVE_FILTER,
            id: id
        });
    }
}
