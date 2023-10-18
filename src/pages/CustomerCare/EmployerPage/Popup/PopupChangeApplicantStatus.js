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
import SpanCommon from "components/Common/Ui/SpanCommon";

class PopupChangeApplicantStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmit: false,
            data_list: [],
            page: 1,
            per_page: 5,
            pagination_data: {},
            show_reason: false,
            applicant: {},
            applicant_error: {},
            applicant_required: ['status'],
            name_focus: ''
        };
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onChange = this._onChange.bind(this);
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
            per_page: this.state.per_page,
            resume_applied_id: this.props.object.resume_applied_id,
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiMixDomain, ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_HISTORY_APPLICANT, args, delay);
    }
    _hidePopup() {
        this.props.uiAction.deletePopup();
    }

    _onChange(value, name) {
        // status "Từ chối phỏng vấn" Sẽ show thêm field cho nhập lý do
        if(name === 'status'){
            if(value === 6){
                this.setState({ show_reason: true });
                this.setState({ applicant_required: ['status','reason'] });
            }
            else{
                this.setState({ show_reason: false });
                this.setState({ applicant_required: ['status'] });
            }
        }
        let applicant_error = this.state.applicant_error;
        delete applicant_error[name];
        this.setState({ applicant_error: applicant_error });
        this.setState({ name_focus: "" });
        let applicant = Object.assign({}, this.state.applicant);
        applicant[name] = value;
        this.setState({ applicant: applicant });
    }

    _onSave(event) {
        if(!this.state.isSubmit){
            event.preventDefault();
            this.setState({ applicant_error: {} });
            this.setState({ name_focus: "" });
            let applicant = this.state.applicant;
            let check = utils.checkOnSaveRequired(applicant, this.state.applicant_required);
            if (check.error) {
                this.setState({ name_focus: check.field });
                this.setState({ applicant_error: check.fields });
                return;
            }
            this.props.uiAction.showLoading();
            applicant.resume_applied_id = this.props.object.resume_applied_id;
            applicant.campaign_id = this.props.object.campaign_id;
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiMixDomain, ConstantURL.API_URL_POST_CHANGE_STATUS_APPLICANT, applicant);
        }
        this.setState({ isSubmit: true });
    }
    componentWillMount() {
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_HISTORY_APPLICANT]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_HISTORY_APPLICANT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ data_list: response.data.items });
                this.setState({ pagination_data: response.data });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_HISTORY_APPLICANT);
        }
        if (newProps.api[ConstantURL.API_URL_POST_CHANGE_STATUS_APPLICANT]) {
            let response = newProps.api[ConstantURL.API_URL_POST_CHANGE_STATUS_APPLICANT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ applicant: {} });
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
                publish(".refresh", {}, "ApplicantList");
                this.hidePopup()
            } else {
                this.setState({ applicant_error: response.data });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CHANGE_STATUS_APPLICANT);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let { applicant, applicant_error, applicant_required, name_focus, data_list, show_reason } = this.state;
        let applicant_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_account_service_status);

        return (
            <div className="dialog-popup-body">
                <div className="relative form-container">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <form onSubmit={this.onSave}>
                                <div className="col-sm-12 sub-title-form mb15">
                                    <span>Pipeline status</span>
                                </div>
                                <div className="col-sm-12 col-xs-12 mb15">
                                    <Dropbox name="status" label="Trạng thái pipeline" data={applicant_status} required={applicant_required.includes('status')}
                                             error={applicant_error.status} value={applicant.status} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb15">
                                    <Input2 type="text"
                                            name="note"
                                            label="Ghi chú"
                                            error={applicant_error.note}
                                            nameFocus={name_focus}
                                            onChange={this.onChange} />
                                </div>
                                {show_reason && (
                                    <div className="col-sm-12 col-xs-12 mb15">
                                        <Input2 type="text"
                                                name="reason"
                                                label="Lý do"
                                                required={applicant_required.includes('reason')}
                                                error={applicant_error.reason}
                                                nameFocus={name_focus}
                                                onChange={this.onChange} />
                                    </div>
                                )}
                                <CanRender actionCode={ROLES.account_service_applicant_change_status}>
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
                                    Trạng thái cũ
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={250}>
                                    Trạng thái mới
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={160}>
                                    Ngày chuyển
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Người duyệt
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Lý do
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Ghi chú
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key) => {
                                        let data = {
                                            from_status: <SpanCommon idKey={Constant.COMMON_DATA_KEY_account_service_status}
                                                                     value={item?.from_status}/>,
                                            to_status: <SpanCommon idKey={Constant.COMMON_DATA_KEY_account_service_status}
                                                                   value={item?.to_status}/>,
                                            created_at: item?.created_at,
                                            created_by: item?.created_by,
                                            reason: item?.reason,
                                            note: item?.note
                                        };
                                        return (
                                            <tr key={key} className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                                {Object.keys(data).map((name, k) => {
                                                    return (
                                                        <td key={k}>
                                                            {
                                                                (name === "note" || name === "reason") ? 
                                                                 <div className="cell" style={{ whiteSpace:"unset"}} title={data[name]}>{data[name]}</div> :
                                                                 <div className="cell" title={data[name]}>{data[name]}</div>
                                                            }
                                                           
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
export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeApplicantStatus);
