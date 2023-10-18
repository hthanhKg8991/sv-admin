import * as types from 'utils/ConstantActionTypes';

const init = {
    menu: {},
    channel: {items: []},
    province: {items: []},
    district: {items: []},
    currency: {items: []},
    gateJobField: {items: []},
    common: {items: {}},
    jobField: {items: [], list: []},
    service: {items: [], list: []},
    gate: {items: [], list: []},
    effect: {items: [], list: []},
    jobLevel: {items: [], list: []},
    gateJobLevel: {items: [], list: []},
};

function sysReducer(state = init, action){
    switch(action.type){
        case types.INIT_ALL:
            return {
                ...state,
                ...action.payload,
            };

        case types.INIT_ALL_BRANCH:
            return {
                ...state,
                ...action.payload,
            };

        default :
            return state;
    }
}
export default sysReducer;
