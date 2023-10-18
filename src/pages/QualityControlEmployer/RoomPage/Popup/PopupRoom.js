import React, { Component } from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";

class PopupRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            object: {},
            //object: Object.assign({}, props.object),
            object_required: ['name','staff_ids','code'],
            object_error: {},
            name_focus: "",
            staff_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getCustomer = this._getCustomer.bind(this);
        this.getDetailRoom = this._getDetailRoom.bind(this);
    }

    _onSave(data, object_required) {
        this.setState({ object_error: {} });
        this.setState({ name_focus: "" });

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({ name_focus: check.field });
            this.setState({ object_error: check.fields });
            return;
        }
        this.props.uiAction.showLoading();
        if (!_.has(object, "id")) {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_ROOM_CREATE, object);
        } else {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_ROOM_UPDATE, object);
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({ object: object });
    }

    _getCustomer() {
        let args = {
            'division_code': Constant.DIVISION_TYPE_regional_sales_leader,
            'status': Constant.STATUS_ACTIVED,
        };
        if (!this.state.id) {
            args.not_staff_director = true;
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, args);
    }

    _getDetailRoom() {
        let args = {
            'id': this.state.id
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_ROOM_DETAIL, args);
    }

    componentDidMount() {
        this.getCustomer();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_ROOM_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_ROOM_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('RoomPage');
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_ROOM_CREATE);
        }

        if (newProps.api[ConstantURL.API_URL_POST_ROOM_UPDATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_ROOM_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('RoomPage');
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_ROOM_UPDATE);
        }
        if (newProps.api[ConstantURL.API_URL_GET_ROOM_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_ROOM_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = response.data;
                object.staff_ids = _.get(response.data, 'room_member', []).map(o => o.staff_id);
                this.setState({ object: object });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ROOM_DETAIL);
        }

        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ staff_list: response.data.items || [] });
                //tạm gọi theo tuần tự, fix lại cơ chế gọi promise all
                if (this.state.id) {
                    this.getDetailRoom();
                }
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }

    render() {
        const { object, object_error, object_required, name_focus, staff_list } = this.state;
        const {sys, branch} = this.props
        const room_type = utils.convertArrayValueCommonData(sys.common.items,Constant.COMMON_DATA_KEY_room_type);
        const branch_common = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_branch_code_for_room);
        const branch_list = branch.branch_list.filter(c => c.channel_code === branch.currentBranch.channel_code);
        
        return (
            <form onSubmit={(event) => {event.preventDefault();this.onSave(object, object_required);}}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb15">
                                <Dropbox name="branch_code"
                                    label="Chi nhánh"
                                    data={branch_list}
                                    key_value="code" key_title="name"
                                    value={_.get(object, "branch_code", null)}
                                    required={_.includes(object_required, "name")}
                                    error={object_error.branch_code}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="code"
                                        label="Mã Phòng"
                                        required={_.includes(object_required, "code")}
                                        value={_.get(object, "code", null)}
                                        error={object_error.name}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb15">
                                <Input2 type="text"
                                        name="name"
                                        label="Tên Phòng"
                                        required={_.includes(object_required, "name")}
                                        value={_.get(object, "name", null)}
                                        error={object_error.name}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb15">
                                <Dropbox name="type"
                                         label="Loại phòng"
                                         data={room_type}
                                         key_value="value" key_title="title"
                                         value={_.get(object, "type", null)}
                                         required={_.includes(object_required, "name")}
                                         error={object_error.type}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb15">
                                <DropboxMulti name="staff_ids"
                                         label="Trưởng phòng kinh doanh"
                                         key_value="id"
                                         key_title="login_name"
                                         data={staff_list}
                                         required={_.includes(object_required, "staff_ids")}
                                         error={object_error.staff_ids}
                                         value={object.staff_ids}
                                         onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit"
                                className="el-button el-button-success el-button-small">
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
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupRoom);
