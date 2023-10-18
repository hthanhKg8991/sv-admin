import * as types from 'utils/ConstantActionTypes';
import _ from "lodash";

const refreshComponentReducer = (state = {}, action) => {
    switch (action.type) {
        case types.REFRESH_COMPONENT:
            return {
                ...state,
                [action.name]: _.has(state, action.name) ? _.get(state, action.name) + 1 : 1
            };
        default :
            return state;
    }
}

export default refreshComponentReducer;
