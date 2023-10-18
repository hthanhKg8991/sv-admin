import * as types from 'utils/ConstantActionTypes';

const init = {
    toast: {},
    loading: {},
    popup: {}
};

function uiReducer(state = init, action){
    switch(action.type) {
        case types.PUT_TOAST_SUCCESS:
            return {
                ...state,
                toast:{
                    error: 0,
                    msg: action.payload.msg,
                    uid: action.payload.uid,
                }
            };
        case types.PUT_TOAST_ERROR:
            return {
                ...state,
                toast:{
                    error: 1,
                    msg: action.payload.msg,
                    uid: action.payload.uid,
                }
            };
        case types.PUT_TOAST_WARNING:
            return {
                ...state,
                toast:{
                    error: 2,
                    msg: action.payload.msg,
                    uid: action.payload.uid,
                }
            };
        case types.SHOW_LOADING:
            return {
                ...state,
                loading:{
                    isShowLoading: true,
                    id: action.id
                }
            };
        case types.HIDE_LOADING:
            return {
                ...state,
                loading:{
                    isShowLoading: false,
                    id: action.id
                }
            };
        case types.SHOW_POPUP:
            return {
                ...state,
                popup: action.payload
            };
        case types.HIDDEN_POPUP:
            return {
                ...state,
                popup: action.payload
            };
        case types.SHOW_MESSAGE_BOX_V2:
            return {
                ...state,
                smart_message_v2: action.payload
            };
        case types.SHOW_MESSAGE_BOX:
            return {
                    ...state,
                    smart_message: action.payload
            };
        case types.HIDDEN_MESSAGE_BOX:
            return {
                ...state,
                smart_message: null
            };
        case types.HIDDEN_MESSAGE_BOX_V2:
            return {
                ...state,
                smart_message_v2: null
            };
        case types.ASSIGNED_STAFF_OLD:
            return {
                ...state,
                sale_order_as_staff:{
                    recent_staff_id: action.recent_staff_id,
                    old_staff_id: action.old_staff_id
                }
            };
        case types.LOGOUT_SUCCESS:
            return {};
        default :
            return state;
    }
}

export default uiReducer;
