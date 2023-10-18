import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import {getHistoryViewResume} from "api/mix";
import Gird from "components/Common/Ui/Table/Gird";
import queryString from "query-string";
import SpanServiceAll from 'components/Common/Ui/SpanServiceAll';
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "historyPoint";

class PopupHistoryViewResume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Hồ sơ",
                    width: 140,
                    cell: row => (
                        <span>{row.resume_id} - {row.cache_resume_title}</span>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.resume_id,
                        };
                        window.open(Constant.BASE_URL_SEEKER_RESUME + '?' + queryString.stringify(
                            params));
                    }
                },
                {
                    title: "Ứng viên",
                    width: 140,
                    cell: row => (
                        <span>{row.seeker_id} - {row.cache_seeker_name}</span>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.seeker_id,
                        };
                        window.open(Constant.BASE_URL_SEEKER + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Góc dịch vụ",
                    width: 100,
                    cell: (row) => (
                        <>
                            <SpanServiceAll value={row.service_code} notStyle />
                        </>
                    )
                },
                {
                    title: "Mã đăng ký",
                    width: 100,
                    cell: (row) => (
                        <>
                            <span className="textRed font-weight-bold">{row?.registration_filter_resume_id}</span>
                            
                        </>
                    )
                },
                {
                    title: "Loại gói lọc",
                    width: 100,
                    cell: (row) => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_fee_type} value={row?.registration_info?.fee_type} notStyle/>
                        </>
                    )
                },
                {
                    title: "Điểm mua",
                    width: 100,
                    cell: (row) => (
                        <>
                            <span className="textRed font-weight-bold">{row.point}</span>
                        </>
                    )
                },
                {
                    title: "Thời gian xem",
                    width: 150,
                    time: true,
                    accessor: "updated_at"
                },
                {
                    title: "IP",
                    width: 150,
                    accessor: "ip_address"
                },

            ],
            loading: false,
        };
        this.hidePopup = this._hidePopup.bind(this);
        this.refreshListSeen = this._refreshListSeen.bind(this);
    }

    /**
     * Lấy list điểm đã xem ra để tính
     * @param delay
     * @private
     */
    _refreshListSeen(delay = 0) {
        this.setState({ loading: true });
        let args = {
            employer_id: this.props.object.id,
        };
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiSalesOrderDomain,
            ConstantURL.API_URL_GET_LIST_POINT,
            args);
    }

    _hidePopup() {
        this.props.uiAction.deletePopup();
    }

    componentWillMount() {
        this.refreshListSeen();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_POINT]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_POINT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ point: response.data });
            }
            this.setState({ loading: false });
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_POINT);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        let { point, columns } = this.state;
        const {branch, history} = this.props;
        const {channel_code} = branch.currentBranch;
        const defaultQuery = {
            employer_id: this.props.object.id,
            per_page: this.state.per_page,
            page: this.state.page
        };

        let remainingGuaranteePoint = 0;
        let totalGuaranteePoint = 0;

        switch (channel_code) {
            case Constant.CHANNEL_CODE_VL24H:
                remainingGuaranteePoint = Number(point?.guarantee_service?.remaining_point || 0);
                totalGuaranteePoint = Number(point?.guarantee_service?.total_point || 0);
                break;
            case Constant.CHANNEL_CODE_TVN:
                remainingGuaranteePoint = Number(point?.guarantee_service?.remaining_point || 0) +
                    Number(point?.guarantee_service_basic?.remaining_point || 0);
                totalGuaranteePoint = Number(point?.guarantee_service?.total_point || 0) +
                    Number(point?.guarantee_service_basic?.total_point || 0);
                break;
            default:
        }

        return (
            <div className="dialog-popup-body">
                <div className="relative form-container">
                    <div className="popupContainer">
                        <div className="crm-section text-right mr10">
                            <span className="ml12">Điểm mua</span>
                            <span>{` ${point?.filter_resume_2018?.remaining_point || 0} / 
                            ${point?.filter_resume_2018?.total_point || 0}`}</span>

                            <span className="ml12 mr5">Điểm BH tin</span>
                            <span>{remainingGuaranteePoint} /{totalGuaranteePoint}</span>

                            <span className="ml12">Điểm BH Lọc</span>
                            <span>{` ${point?.guarantee_resume?.remaining_point || 0} / 
                            ${point?.guarantee_resume?.total_point || 0}`}</span>

                            <span className="ml12">Điểm tặng tin ghim</span>
                            <span>{` ${point?.point_gift?.remaining_point || 0} / 
                            ${point?.point_gift?.total_point || 0}`}</span>

                        </div>
                        <Gird idKey={idKey}
                              fetchApi={getHistoryViewResume}
                              columns={columns}
                              defaultQuery={defaultQuery}
                              isPushRoute={false}
                              isRedirectDetail={false}
                              history={history}
                        />
                    </div>
                    <div>
                        <hr className="v-divider margin0"/>
                        <div className="v-card-action">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.hidePopup}>
                                <span>Đóng</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupHistoryViewResume);
