import React,{Component} from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';

class PopupChangeRoomForTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: this.props.team,
            object_required: ['room_id'],
            object_error: {},
            name_focus: "",
            roomList: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getRoomList = this._getRoomList.bind(this);
    }
    _onSave(data, object_required){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        let params = [];
        params['room_id'] = object.room_id;
        params['team_id'] = object.id;
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_CHANGE_ROOM, params);
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object});
    }
    _getRoomList(){
        let {object} = this.state;
        let params = [];
        params['branch_code'] = object.branch_code;
        params['exclude_id'] = object.room_id;
        params['per_page'] = this.state.unLimitPerPage;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_ROOM_LIST, params);
    }
    componentDidMount(){
        this.getRoomList();
    }
    componentWillReceiveProps(newProps) {
        //list phòng
        if (newProps.api[ConstantURL.API_URL_GET_ROOM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_ROOM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({roomList: response.data.items});
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ROOM_LIST);
        }

        if (newProps.api[ConstantURL.API_URL_POST_AUTH_CHANGE_ROOM]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_CHANGE_ROOM];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('RoomPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_CHANGE_ROOM);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {object, object_error, object_required, name_focus, roomList} = this.state;
        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="room_id"
                                         label="Chọn phòng"
                                         data={roomList}
                                         required={object_required.includes('room_id')}
                                         key_value="id" key_title="name"
                                         error={object_error.room_id}
                                         value= {null}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupChangeRoomForTeam);
