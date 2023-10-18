import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import config from 'config';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import Dropbox from 'components/Common/InputValue/Dropbox';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import classnames from 'classnames';
import Input2 from "components/Common/InputValue/Input2";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import { publish } from "utils/event";
import { getAccountService } from "api/employer";

class PopupChangeAccountService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            page: 1,
            per_page: 5,
            pagination_data: {},
            staff_list: [],
            account_service: {},
            account_service_error: {},
            account_service_required: ['staff_id', 'reason'],
            name_focus: ''
        };
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onChange = this._onChange.bind(this);
        this.customerList = this._customerList.bind(this);
        this.onSave = this._onSave.bind(this);
    }
    _changePage(newpage) {
        this.setState({ page: newpage }, () => {
            this.refreshList();
        });
    }
    _changePerPage(newperpage) {
        this.setState({ page: 1 });
        this.setState({ per_page: newperpage }, () => {
            this.refreshList();
        });
    }
    _refreshList(delay = 0) {
        let args = {
            employer_id: this.props.object.id,
            per_page: this.state.per_page,
            page: this.state.page
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_HISTORY, args, delay);
    }
    _hidePopup() {
        this.props.uiAction.deletePopup();
    }

    async _customerList() {
        const res = await getAccountService({});
        if (res) {
            this.setState({ staff_list: res })
        }
    }

    _onChange(value, name) {
        let account_service_error = this.state.account_service_error;
        delete account_service_error[name];
        this.setState({ account_service_error: account_service_error });
        this.setState({ name_focus: "" });
        let account_service = Object.assign({}, this.state.account_service);
        account_service[name] = value;
        this.setState({ account_service: account_service });
    }

    _onSave(event) {
        event.preventDefault();
        this.setState({ account_service_error: {} });
        this.setState({ name_focus: "" });
        let account_service = this.state.account_service;
        let check = utils.checkOnSaveRequired(account_service, this.state.account_service_required);
        if (check.error) {
            this.setState({ name_focus: check.field });
            this.setState({ object_error: check.fields });
            return;
        }
        this.props.uiAction.showLoading();
        account_service.employer_id = this.props.object.id;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_CHANGE_ACCOUNT_SERVICE, account_service);
    }
    componentWillMount() {
        this.customerList();
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_HISTORY]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_HISTORY];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ data_list: response.data.items });
                this.setState({ pagination_data: response.data });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_HISTORY);
        }
        if (newProps.api[ConstantURL.API_URL_POST_CHANGE_ACCOUNT_SERVICE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_CHANGE_ACCOUNT_SERVICE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ account_service: {} });
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
                publish(".refresh", {}, "EmployerDetail");
            } else {
                this.setState({ account_service_error: response.data });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CHANGE_ACCOUNT_SERVICE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let { account_service, account_service_error, account_service_required, name_focus, staff_list, data_list } = this.state;
        let employer_discharged_reason = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_discharged_reason);

        return (
            <div className="dialog-popup-body">
                <div className="relative form-container">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <form onSubmit={this.onSave}>
                                <div className="col-sm-12 sub-title-form mb15">
                                    <span>Chuyển giỏ</span>
                                </div>
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <Dropbox name="staff_id" label="CSKH" data={staff_list} key_value="staff_id" key_title="staff_username"
                                             required={account_service_required.includes('staff_id')} nameFocus={name_focus}
                                             value={account_service.staff_id} error={account_service_error.staff_id}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <Input2 type="text"
                                            name="reason"
                                            label="Lý do chuyển"
                                            required={account_service_required.includes('reason')}
                                            error={account_service_error.reason}
                                            nameFocus={name_focus}
                                            onChange={this.onChange} />
                                </div>
                                <CanRender actionCode={ROLES.customer_care_employer_change_account_service}>
                                    <div className="col-sm-12 col-xs-12 mb15">
                                        <button type="submit" className="el-button el-button-success el-button-small">
                                            <span>Chuyển</span>
                                        </button>
                                    </div>
                                </CanRender>
                            </form>
                        </div>
                        <div className="body-table el-table crm-section">
                            <TableComponent>
                                <TableHeader tableType="TableHeader" width={250}>
                                    CSKH bị rút
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={250}>
                                    CSKH
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={160}>
                                    Ngày chuyển
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200} dataField="created_by">
                                    Người duyệt
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Lý do
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key) => {
                                        let from_staff_username = item.from_staff_username ? item.from_staff_username : '';
                                        let to_staff_username = item.to_staff_username ? item.to_staff_username : '';
                                        let reason = '';
                                        if (item.reason) {
                                            reason = item.reason
                                        } else {
                                            const reasons = Array.isArray(item.reason) ? item.reason : [];
                                            reasons.forEach((r, k) => {
                                                r = employer_discharged_reason[r] ? employer_discharged_reason[r] : r;
                                                reason += k === 0 ? r : ', ' + r;
                                            });
                                        }
                                        let data = {
                                            staff_username_from: "-> " + from_staff_username,
                                            staff_username_to: "-> " + to_staff_username,
                                            created_at: item.created_at,
                                            created_by: item.created_by,
                                            reason: reason
                                        };
                                        return (
                                            <tr key={key} className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                                {Object.keys(data).map((name, k) => {
                                                    return (
                                                        <td key={k}>
                                                            <div className="cell" title={data[name]}>{data[name]}</div>
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
                        </div>
                        <div className="crm-section">
                            <Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={false} />
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.hidePopup}>
                            <span>Đóng</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeAccountService);
