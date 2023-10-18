import * as types from 'utils/ConstantActionTypes';

const initialState = {
    currentBranch: null,
    branch: [],
    branchGroup: null,
    branch_list: []
};

function branchReducer(state = initialState, action){
    switch(action.type){
        case types.BRANCH_INIT:
        case types.BRANCH_CHANGE:
            return action.payload;
        default:
            return state;
    }
}
export default branchReducer;
