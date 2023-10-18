import React, {Component} from "react";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import Gird from "components/Common/Ui/Table/Gird";
import {getDetailGuaranteeJob} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilterJob";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox,} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import queryString from 'query-string';
import SpanCommon from 'components/Common/Ui/SpanCommon';
import _ from "lodash";
import SpanService from "components/Common/Ui/SpanService";
import {Link} from "react-router-dom";
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupUpdateCommonInfoGuarantee from "pages/CustomerCare/GuaranteeJobPage/Popup/PopupUpdateCommonInfoGuarantee";
import PopupUpdateDetailInfoGuarantee from "pages/CustomerCare/GuaranteeJobPage/Popup/PopupUpdateDetailInfoGuarantee";

const idKey = "EmployerGuaranteeDetail";

class List extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        this.state = {
            employer_id: queryParsed?.employer_id,
            columns: [
                {
                    title: "Tin tuyển dụng",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            <span className="cursor-pointer"
                                  style={{color: '#3276b1'}}>{row?.job_info?.id} - {row?.job_info?.title}</span>
                            {row?.guarantee_type === Constant.GUARANTEE_TYPE_NEW && (
                                <span className="text-red ml-1"> (Chính sách mới)</span>
                            )}
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.job_id
                        };
                        window.open(Constant.BASE_URL_JOB + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Gói phí",
                    width: 120,
                    cell: row => (<>
                        <SpanService value={row?.service_code} notStyle/>
                        <br/>
                        <span>
                            {`${moment.unix(row?.start_date).format("DD/MM/YYYY")} - ${moment.unix(row?.end_date).format("DD/MM/YYYY")}`}
                        </span>
                    </>)
                },
                {
                    title: "Thời gian được áp dụng bảo hành",
                    width: 100,
                    cell: row => (
                        <>
                            {row?.guarantee_start_date && (
                                <span>
                                    {moment.unix(row?.guarantee_start_date).format("DD/MM/YYYY")} -
                                    {moment.unix(row?.guarantee_end_date).format("DD/MM/YYYY")}
                                </span>
                            )}
                        </>
                    )
                },
                {
                    title: "Gói bảo hành",
                    width: 200,
                    cell: row => (
                        <>
                            {row?.guarantee_type !== Constant.GUARANTEE_TYPE_NEW ? (
                               <>
                                   Gói điểm dịch vụ: {row.point || 0} điểm
                                   <br/>
                                   {row?.filter_resume_start_date && Constant.ARRAY_STATUS_SHOW_TIME_GUARANTEE.includes(Number(row?.guarantee_status)) && (
                                       <span>
                                           {moment.unix(row?.filter_resume_start_date).format("DD/MM/YYYY")} -
                                               {moment.unix(row?.filter_resume_end_date).format("DD/MM/YYYY")}
                                        </span>
                                   )}
                               </>
                            ) : (
                                <>{row?.guarantee_status === Constant.STATUS_ACTIVED && (
                                    <p>
                                        - Gói dịch vụ: <SpanService value={row?.registration_guarantee?.service_code} notStyle /> <br/>
                                        - Thời gian: {moment.unix(row?.registration_guarantee?.start_date).format("DD-MM-YYYY")} - {moment.unix(row?.registration_guarantee?.expired_at).format("DD-MM-YYYY")} <br/>
                                        {row?.registration_guarantee?.remaining_point ? <span>- Điểm: <span className="text-red">{row?.registration_guarantee?.remaining_point} / {row?.registration_guarantee?.total_point}</span></span> : <></>}
                                        {row?.registration_guarantee?.job_id ? <>
                                            - Tin tuyển dụng:
                                                <Link to={`${Constant.BASE_URL_JOB}?${queryString.stringify({action: "detail", id: row?.registration_guarantee?.job_id})}`}
                                                target="_blank"
                                                >
                                                    <span className="ml5 mr5" >{row?.registration_guarantee?.job_id}</span>
                                                </Link>
                                                <span>- {row?.registration_guarantee?.cache_job_title}</span>
                                        </> : <></>}
                                    </p>
                                )}</>
                            )}
                        </>
                    )
                },
                {
                    title: "Số điểm còn lại",
                    width: 70,
                    cell: row => (
                        row?.guarantee_type !== Constant.GUARANTEE_TYPE_NEW && <span>{row.remaining_point || 0}</span>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 70,
                    cell: row => (
                        <SpanCommon value={row?.guarantee_status}
                                    idKey={Constant.COMMON_DATA_KEY_job_guarantee_status}/>
                    )
                },
                {
                    title: "Hành động",
                    width: 180,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.update_common_info_guarantee_package_management}>
                                <span 
                                    className="text-link text-red font-bold" 
                                    onClick={() => this.onUpdateCommonInfo(row)}>
                                        Sửa thông tin chung
                                </span>
                            </CanRender>
                            <br/>
                            <CanRender actionCode={ROLES.update_detail_info_guarantee_package_management}>
                                <span className="text-link text-red font-bold"
                                    onClick={() => this.onUpdateDetailInfo(row)}>Sửa thông tin chi tiết</span>
                            </CanRender>
                        </>
                    )
                },
            ]
        };
        this.onDetail = this._onDetail.bind(this);
        this.goBack = this._goBack.bind(this);
        this.onUpdateCommonInfo = this._onUpdateCommonInfo.bind(this);
        this.onUpdateDetailInfo = this._onUpdateDetailInfo.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.goBack();
    }

    _onDetail(row) {
        const {history} = this.props;
        const {employer_id} = row;
        history.push({
            pathname: Constant.BASE_URL_GUARANTEE_JOB,
            search: '?action=edit&employer_id=' + employer_id || 0,
        });
    }

    _onUpdateCommonInfo(row) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupUpdateCommonInfoGuarantee, "Cập nhật thông tin bảo hành", {
            row,
            idKey,
        });
    }

    _onUpdateDetailInfo(row) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupUpdateDetailInfoGuarantee, "Cập nhật thông tin bảo hành chi tiết", {
            row,
            idKey,
        });
    }

    render() {
        const {columns, employer_id} = this.state;
        const {query, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Bảo Hành Tin"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getDetailGuaranteeJob}
                      query={query}
                      columns={columns}
                      defaultQuery={{employer_id}}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
