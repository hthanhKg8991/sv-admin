import React, { Component } from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
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

class PopupAddMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, this.props.object),
            object_required: ['staff_id', 'role'],
            object_error: {},
            name_focus: "",
            staff_list: [],
            staffLevelList: utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_staff_level),
            staffLevelFilterList: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeTeamRole = this._onChangeTeamRole.bind(this);
        this.getCustomerCare = this._getCustomerCare.bind(this);
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
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CREATE_STAFF, { ...object, team_id: this.props.team_id });
    }
    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = Object.assign({}, this.state.object);
        if (name === "staff_id") {
            const { staff_list } = this.state;
            const find = staff_list.find(item => item.id === value);
            object["staff_username"] = find?.login_name;
            object["staff_name"] = find?.display_name;
            object["staff_code"] = find?.code;
        }
        object[name] = value;
        this.setState({ object: object });
    }

    _onChangeTeamRole(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });

        let object = Object.assign({}, this.state.object);
        object[name] = value;
        if (value !== Constant.TEAM_ROLE_LEADER) {
            delete object['employer_care_type'];
            delete object_error['employer_care_type'];
        }
        object['customer_care_level'] = null;
        this.setState({ object: object });
    }

    _getCustomerCare() {
        let args = {
            division_code: [Constant.COMMON_DATA_KEY_account_service, Constant.COMMON_DATA_KEY_account_service_lead, Constant.COMMON_DATA_KEY_account_service_manager],
            page: 1,
            per_page: 1000,
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, args);
    }
    componentDidMount() {
        this.getCustomerCare();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ staff_list: response.data.items });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CREATE_STAFF]) {
            let response = newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CREATE_STAFF];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.refreshList()
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CREATE_STAFF);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {

        let { object, object_error, object_required, name_focus, staff_list } = this.state;
        let role_name = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_role_name);

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox
                                        name="staff_id"
                                        label="Người dùng" data={staff_list}
                                        required={object_required.includes('staff_id')}
                                        key_title="login_name"
                                        key_value="id"
                                        error={object_error.staff_id}
                                        value={object.staff_id}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox
                                        name="role"
                                        label="Quyền"
                                        data={role_name}
                                        required={object_required.includes('role')}
                                        error={object_error.role}
                                        value={object.role}
                                        nameFocus={name_focus}
                                        onChange={this.onChangeTeamRole}
                                    />
                                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(PopupAddMember);
