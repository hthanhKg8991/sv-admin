import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from "query-string";
import ROLES from 'utils/ConstantActionCode';
import CanRender from "components/Common/Ui/CanRender";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {connect} from "react-redux";
import {putToastSuccess, showLoading, hideLoading, hideSmartMessageBox, SmartMessageBox} from "actions/uiAction";
import {approveAssignmentRequest, rejectAssignmentRequest} from "api/employer";
import SpanText from "components/Common/Ui/SpanText";
import FormReject from "pages/QualityControlEmployer/ApproveAssignmentRequestPage/FormReject";
import * as Yup from "yup";
import PopupForm from "components/Common/Ui/PopupForm";
import {publish} from "utils/event";

let timer = null;

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };

        this.goBack = this._goBack.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onRejectSuccess = this._onRejectSuccess.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_APPROVE_ASSIGNMENT_REQUEST,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_APPROVE_ASSIGNMENT_REQUEST,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    async _onApprove() {
        const {actions, item, idKey} = this.props;
        actions.showLoading();
        let res = await approveAssignmentRequest({id: item.id});
        if (res) {
            const {code, msg} = res;
            if([Constant.CODE_RES_CONFIRM, Constant.CODE_RES_ALERT].includes(code)) {
                const confirm = window.confirm(msg);
                if(confirm) {
                    const res = await approveAssignmentRequest({id: item.id, allowed_continue: Constant.ALLOW_COUNTINUE_VALUE});
                    if (res) {
                        actions.putToastSuccess("Thao tác thành công!");
                        publish(".refresh", {}, idKey)
                    }
                }
            }
            else if(code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess('Thao tác thành công');
                publish(".refresh", {}, idKey);
            }
        }
        actions.hideLoading();
    }

    _onReject() {
        this.popupReject._handleShow();
    }

    _onRejectSuccess() {
        const {idKey} = this.props;
        publish(".refresh", {}, idKey)
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    render() {
        const {item} = this.props;
        const {loading} = this.state;
        const {attached_file, attached_file_url, employer_info} = item;
        const type = attached_file?.split(".").pop();

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <div className="row content-box">
                <div className="col-sm-6 col-xs-6">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên công ty</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{employer_info?.name}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{employer_info?.email}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Loại tài khoản</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status} value={employer_info?.premium_status}/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Loại công ty</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {employer_info?.company_kind_label}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">CSKH cũ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.from_staff_username} <br/>
                            <>{item?.from_staff_level && `(Cấp bậc: ${item?.from_staff_level})`}</>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">CSKH mới</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.to_staff_username} <br/>
                            <>{item?.to_staff_level && `(Cấp bậc: ${item?.to_staff_level})`}</>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Lý do</div>
                        <div className="col-sm-8 col-xs-8 text-bold" style={{marginLeft: "-15px"}}>
                            <SpanText idKey={Constant.COMMON_DATA_KEY_employer_discard_reason} value={item?.reason} />
                        </div>
                    </div>
                    {item?.reason === Constant.REASON_OTHER_VALUE && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Nội dung lý do khác</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {item?.orther_reason}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ghi chú</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.note}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">File đính kèm</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {type && Constant.FILE_OPEN_BROWSER_TYPE.includes(type) && <span onClick={() => {window.open(attached_file_url)}} className="text-link">Xem file</span>}
                            {type && !Constant.FILE_OPEN_BROWSER_TYPE.includes(type) && <a href={attached_file_url} target="_new" download className="text-link">Xem file</a>}
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-xs-12 mt10">
                    {item?.status === Constant.STATUS_INACTIVED && (
                        <>
                            <CanRender actionCode={ROLES.quality_control_employer_approve_assignment_request_approve}>
                                <button type="button"
                                        className="el-button el-button-small el-button-success"
                                        onClick={this.onApprove}>
                                    <span>Duyệt</span>
                                </button>
                            </CanRender>

                            <CanRender actionCode={ROLES.quality_control_employer_approve_assignment_request_reject}>
                                <button type="button"
                                        className="el-button el-button-bricky el-button-small"
                                        onClick={this.onReject}>
                                    <span>Không duyệt</span>
                                </button>
                            </CanRender>

                            <PopupForm onRef={ref => (this.popupReject = ref)}
                                       title={"Không duyệt yêu cầu"}
                                       FormComponent={FormReject}
                                       initialValues={{id: item?.id, reason_reject: ''}}
                                       validationSchema={Yup.object().shape({
                                           reason_reject: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                                       })}
                                       apiSubmit={rejectAssignmentRequest}
                                       afterSubmit={this.onRejectSuccess}
                                       hideAfterSubmit/>
                        </>
                    )}
                    <button type="button" className="el-button el-button-default el-button-small" onClick={this.goBack}>
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
        actions: bindActionCreators({putToastSuccess, showLoading, hideLoading, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        common: state.sys.common
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
