import * as types from 'utils/ConstantActionTypes';

function apiReducer(state = {}, action){
    switch(action.type){
        case types.RECEIVIE_API:
            return {
                ...state,
                [action.url]: {...action.payload}
            };
        case types.DELETE_RECEIVIE_API:
            delete state[action.url];
            return {...state};
        default :
            return state;
    }
}
export default apiReducer;
