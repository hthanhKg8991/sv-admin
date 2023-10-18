import React, { Component } from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from 'lodash';

class PopupCustomerService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_required: ['name', 'division_id'],
            object_error: {},
            name_focus: "",
            roomList: [],
            unLimitPerPage: Constant.UN_LIMIT_PER_PAGE
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
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
        if (!object.id) {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CREATE, object);
        } else {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_UPDATE, object);
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = Object.assign({}, this.state.object);
        if (name == "division_id") {
            const { division_list } = this.props;
            const find = division_list.find(item => item.id == value);
            object['division_code'] = find?.code;
        }
        object[name] = value;
        this.setState({ object: object })
    }

    componentWillReceiveProps(newProps) {

        if (newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList(this.props.idKey);
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_UPDATE]) {
            let response = newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList(this.props.idKey);
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_UPDATE);
        }
    }

    render() {
        let { object, object_error, object_required, name_focus } = this.state;
        const { division_list } = this.props;

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
                                    <Input2 type="text" name="name" label="Tên nhóm" required={object_required.includes('name')}
                                        value={object.name} error={object_error.name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox
                                        name="division_id"
                                        label="Mã bộ phận"
                                        data={division_list}
                                        required={object_required.includes('division_id')}
                                        key_value="id"
                                        key_title="code"
                                        error={object_error.division_id}
                                        value={_.get(object, 'division_id', null)}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
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
export default connect(mapStateToProps, mapDispatchToProps)(PopupCustomerService);
