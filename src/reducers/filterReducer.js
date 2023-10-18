import * as types from 'utils/ConstantActionTypes';

const init = {};

function filterReducer(state = init, action) {
    switch (action.type) {
        case types.PUSH_FILTER:
            return {
                ...state,
                [action.id]: action.params
            };
        case types.REMOVE_FILTER:
            delete state[action.id];

            return {...state};
        default :
            return state;
    }
}

export default filterReducer;
