import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {verifyEmployerMarketing} from "api/employer";
import queryString from "query-string";
import ROLES from 'utils/ConstantActionCode';
import CanRender from "components/Common/Ui/CanRender";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {hideLoading, hideSmartMessageBox, putToastSuccess, showLoading, SmartMessageBox} from "actions/uiAction";
import {connect} from "react-redux";
import SpanSystem from "components/Common/Ui/SpanSystem";
import {publish} from "utils/event";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };

        this.goBack = this._goBack.bind(this);
        this.onVerify = this._onVerify.bind(this);
    }

    async _onVerify(item) {
        const {idKey, actions} = this.props;
        const {id} = item;
        const res = await verifyEmployerMarketing({id: id});
        if (res) {
            actions.putToastSuccess("Xác nhận Email thành công!");
            publish(".refresh", {}, idKey);
        }
    }

    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    render() {
        const {items, employerDetail} = this.props;
        const {loading} = this.state;

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <>
                {items.map((item, idx) => (
                    <div className={`row content-box mt15 ${idx % 2 === 1 ? "bgColorBlueLight" : ""}`}
                         key={idx.toString()}>
                        <div className="col-sm-6 col-xs-6">
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Nhà tuyển dụng</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{employerDetail?.name}</div>
                                <div className="col-sm-4 col-xs-4 padding0 marginTop10">Xác thực email marketing</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{item?.marketing_email}</div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <CanRender actionCode={ROLES.customer_care_employer_email_marketing}>
                                    {item?.token_email_status === Constant.EMAIL_MARKETING_STATUS_PENDING &&
                                    <button type="button" className="el-button el-button-bricky el-button-small"
                                            onClick={() => this.onVerify(item)}>
                                        <span>Xác nhận</span>
                                    </button>
                                    }
                                </CanRender>
                                {item?.token_email_status === Constant.EMAIL_MARKETING_STATUS_ACTIVE &&
                                <button type="button" className="el-button el-button-info el-button-small disabled"
                                        onClick={() => {
                                        }}>
                                    <span>Đã xác nhận</span>
                                </button>
                                }
                            </div>
                        </div>
                        <div className="col-sm-6 col-xs-6">
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Vị trí</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{item?.title}</div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Ngành nghề</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    <SpanSystem value={item?.field} type={"jobField"} notStyle/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Tuần suất</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    {item?.frequency} lần/ngày
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Địa điểm</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    <SpanSystem value={item?.province} type={"province"} notStyle/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Giới tính</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_gender} value={item?.gender} notStyle/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Trình độ</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_level} value={item?.level}
                                                notStyle/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Kinh nghiệm</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_experience_range}
                                                value={item?.experience} notStyle/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Mức lương</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_salary_range}
                                                value={item?.salary}
                                                notStyle/>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className={"row content-box mt15"}>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <button type="button" className="el-button el-button-default el-button-small"
                                onClick={this.goBack}>
                            <span>Quay lại</span>
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({
            putToastSuccess,
            showLoading,
            hideLoading,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        common: state.sys.common
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
