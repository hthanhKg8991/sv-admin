import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {bindActionCreators} from 'redux';
import ComponentFilter from "pages/AccountService/ApplicantPage/ComponentFilter";
import {changeStatusApplicant, getListApplicant} from "api/mix";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import queryString from "query-string";
import {Link} from "react-router-dom";
import PopupChangeApplicantStatus from "pages/CustomerCare/EmployerPage/Popup/PopupChangeApplicantStatus";
import PopupSendMailAccountService from "pages/AccountService/ApplicantPage/PopupSendMailAccountService";

const idKey = "ApplicantList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Applicant",
                    cell: row => (
                        <>
                            <p>- Mã: {row?.resume_id}</p>
                            <p>- Tên: {row?.name}</p>
                            <p>- Tiêu đề: {row?.job_title}</p>
                            <p>- Email: {row?.email}</p>
                            <p>- SĐT: {row?.mobile}</p>
                        </>
                    )
                },
                {
                    title: "Campaign",
                    cell: row => (
                        <Link
                            to={`/account-service-campaign?${queryString.stringify({
                                q: row?.campaign_id
                            })}`}>
                             <span className="cursor-pointer" style={{color: '#3276b1'}}>{`${row?.campaign_id} - ${row?.campaign_name}`}</span>
                        </Link>
                    )
                },
                {
                    title: "Ngày ứng tuyển",
                    cell: row =><>{moment.unix(row?.applied_at).format("DD/MM/YYYY HH:mm:ss")}</>
                },
                {
                    title: "Trạng thái trợ lý",
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_account_service_status}
                                           value={row?.status}/>;
                    }
                },
                {
                    title: "Hành động",
                    cell: row => {
                        return (
                            <>
                                <CanRender actionCode={ROLES.account_service_applicant_change_status}>
                                    <span className="text-underline text-danger font-bold cursor-pointer ml5"
                                          onClick={() => this.onClickChangeStatus(row)}>
                                       Đổi trạng thái
                                    </span>
                                    <br/>
                                    <span className="text-link text-blue font-bold ml5" onClick={() => this.viewDetail(row)}>
                                        Xem chi tiết
                                    </span>
                                    <br/>
                                    <span className="text-link text-blue font-bold ml5" onClick={() => this.onClickSendMailAS(row)}>
                                        Gửi mail ứng viên
                                    </span>
                                </CanRender>
                            </>
                        );
                    }
                },
            ],
        };
        this.viewDetail = this._viewDetail.bind(this);
        this.onClickChangeStatus = this._onClickChangeStatus.bind(this);
        this.onClickSendMailAS = this._onClickSendMailAS.bind(this);
    }

    async _viewDetail(object) {
        // Hồ sơ đã gửi đến NTD
        if(Number(object?.status) === 1){
            const obj = {
                "campaign_id": object?.campaign_id,
                "resume_applied_id": object?.resume_applied_id,
                "status": 2, // Hồ sơ đã xem qua
            }
            const res = await changeStatusApplicant(obj);
            if (res){
                publish(".refresh", {}, idKey);
            }
        }
        if (object?.file_name_url){
            window.open(object?.file_name_url);
        } else if (object?.cv_file){
            window.open(object?.cv_file);
        }
        else{
            window.open(`${Constant.BASE_URL_SEEKER_RESUME}?action=detail&id=${object?.resume_id}`);
        }
    }

    _onClickChangeStatus(obj) {
        this.props.uiAction.createPopup(PopupChangeApplicantStatus,"Chuyển trạng thái", {object: obj});
    }

    _onClickSendMailAS(object) {
        this.props.uiAction.createPopup(PopupSendMailAccountService, 'Gửi email ứng viên', {idKey, object, campaign_id: object.campaign_id});
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        const queryMerge = {...query, type: Constant.TRANSACTION_TYPE_CUSTOMER};
        return (
            <Default
                title="Danh Sách Applicant Pipeline"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <ComponentFilter idKey={idKey} query={query}/>
                <Gird idKey={idKey}
                      fetchApi={getListApplicant}
                      query={queryMerge}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
