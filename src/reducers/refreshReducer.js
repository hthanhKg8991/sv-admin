import * as types from 'utils/ConstantActionTypes';

function refreshReducer(state = {}, action){
    switch(action.type){
        case types.REFRESH_LIST:
            return {
                ...state,
                [action.name]: {...action.payload}
            };
        case types.DELETE_REFRESH_LIST:
            delete state[action.name];
            return {...state};
        default:
            return state;
    }
}
export default refreshReducer;
