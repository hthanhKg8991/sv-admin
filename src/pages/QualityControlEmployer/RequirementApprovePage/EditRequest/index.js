import React from "react";
import {
    getDetail,
    getDetailRequestEmployer,
    getDetailRequestJob,
    sendRequestApproveJob,
    sendRequestRejectJob, sendRequestRejectEmployer, sendRequestApproveEmployer,
} from "api/employer";
import { getDetail as getDetailJob } from "api/job";
import { subscribe } from "utils/event";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import FormReject from './FormReject';
import * as Yup from 'yup';
import PopupForm from 'components/Common/Ui/PopupForm';
import { BASE_URL_REQUIREMENT_APPROVE } from 'utils/Constant';

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employer_id: props.employer_id,
            job_id: props.job_id,
            type: Number(props.type),
            id: props.id,
            detail: null,
            loading: true,
            initialForm: {
                email: "email",
                name: "name",
                type: "type",
                employer_id: "employer_id",
                new_data: "new_data",
                file: "file",
                reason_request: "reason_request",
            }
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({ loading: true }, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.goBack = this._goBack.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
    }

    async _onApprove() {
        this.setState({ loading: true });
        const { id, actions, type, job_id } = this.props;
        const params = {
            id,
            type,
        }
        const fnApprove = job_id > 0 ? sendRequestApproveJob : sendRequestApproveEmployer;
        const res = await fnApprove(params);
        if (res) {
            this.goBack();
            actions.putToastSuccess("Thao tác thành công");
        }
        this.setState({ loading: false });
    }

    _onReject() {
        this.popupReject._handleShow();
    }

    _goBack() {
        const { history } = this.props;
        history.push(BASE_URL_REQUIREMENT_APPROVE);
        return true;
    }

    async asyncData() {
        const { employer_id, job_id, id } = this.state;
        if (employer_id > 0) {
            const resDetail = await getDetailRequestEmployer(id);
            const resEmployer = await getDetail(employer_id);
            if (resEmployer) {
                this.setState({ detail: { ...resEmployer, ...resDetail }, loading: false });
            }
        } else if (job_id > 0) {
            const resDetail = await getDetailRequestJob(id);
            const resJob = await getDetailJob(job_id);
            if (resJob) {
                const resEmployer = await getDetail(resJob?.employer_id);
                this.setState({ detail: { ...resJob, ...resDetail, employer_info: resEmployer }, loading: false });
            }
        } else {
            this.setState({ loading: false });
        }
    }

    componentDidMount() {
        const { id } = this.state;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({ loading: false });
        }
    }

    render() {
        const { job_id, detail, loading, type, employer_id, id } = this.state;
        const apiReject = job_id > 0 ? sendRequestRejectJob : sendRequestRejectEmployer;
        return (
            <div className="row">
                {loading && <LoadingSmall className="form-loading"/>}
                <div className="col-sm-5 col-xs-5 mt15 mb15 ml10">
                {/* Yêu cầu đổi tin */}
                {job_id > 0 && (
                    <>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Email</div>
                            <div
                                className="col-sm-8 col-xs-8 text-bold">{detail?.employer_info?.email}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Tên công ty</div>
                            <div
                                className="col-sm-8 col-xs-8 text-bold">{detail?.job_contact_info?.contact_name}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Tiêu đề cũ</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.old_data}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Tiêu đề mới</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.new_data}</div>
                        </div>
                    </>
                )}

                {/* Xác thực email */}
                {employer_id > 0 && type === Constant.REASON_APPROVE_VERIFY_EMAIL && (
                    <>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Email</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.email}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do</div>
                            <div
                                className="col-sm-8 col-xs-8 text-bold">{detail?.reason_request}</div>
                        </div>
                    </>
                )}

                {/* Đổi tên công ty */}
                {employer_id > 0 && type === Constant.REASON_APPROVE_CHANGE_COMPANY && (
                    <>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Email</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.email}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Tên công ty cũ</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.old_data}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Tên công ty mới</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.new_data}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do</div>
                            <div
                                className="col-sm-8 col-xs-8 text-bold">{detail?.reason_request}</div>
                        </div>
                    </>
                )}

                {/* Đổi email công ty */}
                {employer_id > 0 && type === Constant.REASON_APPROVE_CHANGE_EMAIL && (
                    <>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Email</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.email}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Email Cũ</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.old_data}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Email mới</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{detail?.new_data}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do</div>
                            <div
                                className="col-sm-8 col-xs-8 text-bold">{detail?.reason_request}</div>
                        </div>
                    </>
                )}
                    {detail?.file_path &&
                        <div className="col-sm-12 col-xs-12 row-content padding0 mt15">
                            <div className="col-sm-4 col-xs-4 padding0">File đính kèm</div>
                            <div
                                className="col-sm-8 col-xs-8 text-bold">
                                <a href={detail?.file_path || "#"} rel="noopener noreferrer" target="_blank">Tải file</a>
                            </div>
                        </div>
                    }
                </div>
                <div className={"row mt15 ml10"}>
                    <div className="col-sm-12">
                        <button type="button"
                                className="el-button el-button-bricky el-button-small"
                                onClick={this.onApprove}>
                            <span>Duyệt</span>
                        </button>
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={this.onReject}>
                            <span>Không duyệt</span>
                        </button>
                        <PopupForm onRef={ref => (this.popupReject = ref)}
                                   title={"Không duyệt"}
                                   FormComponent={FormReject}
                                   initialValues={{
                                       id: Number(id),
                                       reason_reject: ''
                                   }}
                                   validationSchema={Yup.object().shape({
                                       reason_reject: Yup.string().required(
                                           Constant.MSG_REQUIRED)
                                   })}
                                   afterSubmit={()=>this.goBack()}
                                   apiSubmit={apiReject}
                                   hideAfterSubmit/>
                        <button type="button"
                                className="el-button el-button-default el-button-small"
                                onClick={this.goBack}>
                            <span>Trở lại</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ putToastSuccess }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
