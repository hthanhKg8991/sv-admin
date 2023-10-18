import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import _ from "lodash";
import queryString from "query-string";
import SeekerSupport from '../Detail/SeekerSupport';
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import { hideLoading, putToastSuccess, showLoading } from "actions/uiAction";
import { connect } from "react-redux";
import moment from "moment";
import * as utils from "utils/utils";
import SpanText from "components/Common/Ui/SpanText";
import SpanSystem from "components/Common/Ui/SpanSystem";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const { history } = this.props;
        const search = queryString.parse(_.get(history, ['location', 'search']));

        const params = {
            id: search?.jobId,
            action: "detail",
        };

        history.push({
            pathname: Constant.BASE_URL_JOB,
            search: '?' + queryString.stringify(params)
        });

        return true;
    }

    render() {
        const { seeker, revision } = this.props;
        const gender = utils.convertObjectValueCommonData(this.props.sys.items, Constant.COMMON_DATA_KEY_gender);
        const marital_status = utils.convertObjectValueCommonData(this.props.sys.items, Constant.COMMON_DATA_KEY_marital_status);
        const created_at = moment.unix(_.get(seeker, 'created_at')).format("DD/MM/YYYY HH:mm:ss");
        const last_logged_in_at = seeker?.logined_at ?
            moment.unix(_.get(seeker, 'logined_at')).format("DD/MM/YYYY HH:mm:ss") :
            "Chưa cập nhật";

        return (
            <div className="row content-box">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Tài Khoản</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{seeker?.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Kênh</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {Constant.CHANNEL_LIST[String(seeker?.channel_code)]}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Họ và tên</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{seeker?.name}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày sinh</div>
                        <div
                            className="col-sm-8 col-xs-8 text-bold">{seeker?.birthday ? moment.unix(seeker?.birthday).format("DD/MM/YYYY") : "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Giới tính</div>
                        <div
                            className="col-sm-8 col-xs-8 text-bold">{gender[seeker?.gender] || "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{seeker?.address || "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tỉnh/ Thành phố</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {seeker?.province_id &&
                                <SpanSystem value={seeker?.province_id} type={"province"} notStyle />}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Miền theo IP đăng ký</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_branch_name}
                                value={seeker?.branch_register} notStyle />
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Hôn nhân</div>
                        <div
                            className="col-sm-8 col-xs-8 text-bold">{marital_status[seeker?.marital_status] || "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày đăng ký</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{created_at}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Đăng nhập gần nhất</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{last_logged_in_at}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái TK</div>
                        <div className="col-sm-6 col-xs-6 padding0">
                            <SpanText
                                idKey={Constant.COMMON_DATA_KEY_seeker_status}
                                value={seeker?.status_combine} />
                        </div>
                    </div>
                    {parseInt(_.get(seeker, 'status')) !== Constant.STATUS_ACTIVED && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do từ chối</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {_.isArray(_.get(revision, 'rejected_reason')) && _.get(
                                    revision,
                                    'rejected_reason').map(reason => (
                                        <div key={reason}>
                                            - <SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_rejected_reason}
                                                value={reason}
                                                notStyle />
                                        </div>
                                    ))}
                                {_.get(revision, 'rejected_reason_note') && (<div>- {_.get(
                                    revision,
                                    'rejected_reason_note')}</div>)}
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-sm-4 col-xs-4">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin thêm
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Nguồn tạo</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{_.get(seeker, 'created_source')}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Người duyệt</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{_.get(revision, 'approved_by')}</span>
                        </div>
                    </div>
                    {seeker?.id && (
                        <SeekerSupport {...seeker} />
                    )}
                </div>
                <div className="col-sm-3 col-xs-3">
                    <div className="logo-c">
                        {seeker?.avatar_url
                            ? <img src={seeker?.avatar_url} alt="logo" />
                            : <img src="/assets/img/no_image.dc8b35d.png" alt="no logo" />
                        }
                    </div>
                </div>

                <div className="col-sm-12 col-xs-12 mt10">
                    <button type="button" className="el-button el-button-default el-button-small"
                        onClick={() => this.goBack()}>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({ putToastSuccess, showLoading, hideLoading }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        sys: state.sys.common
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
