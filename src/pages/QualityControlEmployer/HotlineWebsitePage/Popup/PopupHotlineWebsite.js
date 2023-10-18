import React, {Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PopupHotlineWebsite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_required: ['team_id', 'staff_id', 'displayed_name', 'phone', 'branch_code'],
            object_error: {},
            name_focus: "",
            team_list: [],
            staff_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getCustomerCare = this._getCustomerCare.bind(this);
        this.getTeamCustomerCare = this._getTeamCustomerCare.bind(this);
        this.onChangeTeam = this._onChangeTeam.bind(this);
    }

    _onSave(data, object_required) {
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        if (!object.id) {
            this.props.apiAction.requestApi(apiFn.fnPost,
                config.apiAuthDomain,
                ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_CREATE,
                object);
        } else {
            object.hotline_id = object.id;
            this.props.apiAction.requestApi(apiFn.fnPost,
                config.apiAuthDomain,
                ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_UPDATE,
                object);
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        if (name === "branch_code") {
            this._getTeamCustomerCare(value);
        }
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object: object});
    }

    _onChangeTeam(value, name) {
        this.onChange(value, name);
        this.getCustomerCare(value);
    }


    _getCustomerCare(value) {
        let division_code = this.props.user ? this.props.user.division_code : '';
        let args = {};
        args['team_id'] = value;
        args['division_code_list[0]'] = Constant.DIVISION_TYPE_customer_care_member;
        if (division_code !== Constant.DIVISION_TYPE_customer_care_member) {
            args['division_code_list[1]'] = Constant.DIVISION_TYPE_customer_care_leader;
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_TEAM_MEMBER_LIST, args);
    }

    _getTeamCustomerCare(branch_code) {
        const args = {
            branch_code,
        };
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiAuthDomain,
            ConstantURL.API_URL_GET_TEAM_LIST, args);
    }

    componentDidMount() {
        this.getTeamCustomerCare();
        if (this.state.object.team_id) {
            this.getCustomerCare(this.state.object.team_id);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('HotlineWebsitePage');
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_UPDATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('HotlineWebsitePage');
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_UPDATE);
        }
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({team_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        const {branch, currentBranch} = this.props.branch;
        const listBranch = branch.filter((item) => item.channel_code === currentBranch.channel_code);
        let {object, object_error, object_required, name_focus, team_list, staff_list} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12">
                                <div className="col-sm-6 col-xs-6 mb10">
                                    <Dropbox name="branch_code"
                                             label="Miền"
                                             data={listBranch}
                                             required={object_required.includes('branch_code')}
                                             key_value="code"
                                             key_title="name"
                                             error={object_error.branch_code}
                                             value={object.branch_code}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="team_id"
                                             label="Nhóm CSKH"
                                             data={team_list}
                                             required={object_required.includes('team_id')}
                                             key_value="id"
                                             key_title="name"
                                             error={object_error.team_id}
                                             value={object.team_id}
                                             nameFocus={name_focus}
                                             onChange={this.onChangeTeam}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12">
                                <div className="col-sm-6 col-xs-6 mb10">
                                    <Dropbox name="staff_id"
                                             label="CSKH"
                                             data={staff_list}
                                             required={object_required.includes('staff_id')}
                                             key_value="id"
                                             key_title="login_name"
                                             error={object_error.staff_id}
                                             value={object.staff_id}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-6 mb10">
                                    <Input2 type="text"
                                            name="displayed_name"
                                            label="Tên hotline"
                                            required={object_required.includes('displayed_name')}
                                            value={object.displayed_name}
                                            error={object_error.displayed_name}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text"
                                            name="phone"
                                            label="Số hotline"
                                            numberOnly
                                            required={object_required.includes('phone')}
                                            value={object.phone}
                                            error={object_error.phone}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
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
        user: state.user,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupHotlineWebsite);
