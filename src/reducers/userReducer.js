import * as types from '../utils/ConstantActionTypes';

function userReducer(state = null, action){
    switch(action.type){
        case types.USER_INFO_SUCCESS:
            return action.payload.user;
        case types.USER_LOGOUT:
            return null;
        default:
            return state;
    }
}
export default userReducer
