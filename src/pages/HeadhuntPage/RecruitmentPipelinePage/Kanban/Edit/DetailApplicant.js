import React from "react";
import {connect} from "react-redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import classnames from "classnames";
import {
    deleteApplicantInfoAction, deleteHeadhuntApplicant, failHeadhuntApplicant, getDetailHeadhuntApplicant,
    getFileCvApplicant,
    getFileCvHideApplicant,
    getListFullApplicantInfoAction,
    getListFullHeadhuntApplicant,
} from "api/headhunt";
import PopupRecruitmentPipelineForm
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupRecruitmentPipelineForm";
import {
    createPopup,
    deletePopup,
    putToastError,
    putToastSuccess,
    SmartMessageBox,
    hideSmartMessageBox
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import PopupRecruitmentInfoPipelineForm
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupRecruitmentInfoPipelineForm";
import PopupHistoryInterview from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupInterviewHistory";
import moment from "moment";
import PopupSendMailSeeker from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupSendMailSeeker";
import PopupSendMailCustomer from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupSendMailCustomer";
import PopupViewContactSeeker from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupViewContact";
import LoadingComponent from "components/Common/Ui/LoadingComponent";
import {formatNumber} from "utils/utils";
import PopupEvaluateSourcer from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupEvaluateSourcer";
import PopupGuarantee from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupGuarantee";
import {publish} from "utils/event";
import ConstantActionCode from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import PopupMarkAcceptance from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupMarkAcceptance";

class DetailApplicant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resume_point: null,
            object: null,
            list_applicant: [],
            history_interview: [],
            loading: false
        }
        this.asyncData = this._asyncData.bind(this);
        this.onAdd = this._onAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onEditInfo = this._onEditInfo.bind(this);
        this.onEditHistoryInterview = this._onEditHistoryInterview.bind(this);
        this.onDeleteHistoryInterview = this._onDeleteHistoryInterview.bind(this);
        this.getFileCv = this._getFileCv.bind(this);
        this.onClickSendMailSeeker = this._onClickSendMailSeeker.bind(this);
        this.onClickSendMailCustomer = this._onClickSendMailCustomer.bind(this);
        this.onDeleteInfo = this._onDeleteInfo.bind(this);
        this.onViewContact = this._onViewContact.bind(this);
        this.onEvaluateSourcer = this._onEvaluateSourcer.bind(this);
        this.onGuarantee = this._onGuarantee.bind(this);
        this.onFailApplicant = this._onFailApplicant.bind(this);
        this.onMarkAcceptance = this._onMarkAcceptance.bind(this);
    }

    _onAdd() {
        const {actions, idKey} = this.props;
        const {object} = this.state;
        actions.createPopup(PopupRecruitmentPipelineForm, 'Thêm Ứng Viên', {idKey, object});
    }

    _onEdit(data) {
        const {actions, idKey} = this.props;
        const {object} = this.state;
        const filter = ['email', 'phone', 'name', 'address', 'date_of_birth'];
        const objectInfo = {};
        filter.forEach(v => {
            objectInfo[v] = data[v];
        })
        actions.createPopup(PopupRecruitmentPipelineForm, 'Chỉnh sửa Ứng Viên', {
            idKey,
            object: {...object, ...objectInfo},
            applicant_info: data
        });
    }

    _onDeleteInfo(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa!',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteHeadhuntApplicant({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    actions.hideSmartMessageBox();
                    actions.deletePopup();
                }
            }
        });
    }

    _onEditInfo() {
        const {actions, idKey} = this.props;
        const {object} = this.state;
        actions.createPopup(PopupRecruitmentInfoPipelineForm, 'Chỉnh sửa', {idKey, object});
    }

    _onEditHistoryInterview(data) {
        const {actions, idKey, object} = this.props;
        actions.createPopup(PopupHistoryInterview, 'Chỉnh sửa', {
            idKey,
            applicant_info_id: object.applicant_info_id,
            applicant_id: object.id,
            item: data
        });
    }

    _onDeleteHistoryInterview(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa!',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteApplicantInfoAction({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    actions.hideSmartMessageBox();
                    this._refreshList();
                }
            }
        });
    }

    async _getFileCv(id, hide = false) {
        let res;
        if (hide) {
            res = await getFileCvHideApplicant({id});
        } else {
            res = await getFileCvApplicant({id});
        }
        if (res) {
            window.open(res.cv_file_url);
        }

    }

    async _refreshList() {
        const res = await getListFullApplicantInfoAction({
            applicant_info_id: this.props.object.applicant_info_id,
            per_page: 99
        });
        if (res) {
            this.setState({history_interview: res});
        }
    }

    async _asyncData() {
        const [resDetail, resHistory, resListApplicant] = await Promise.all([
            getDetailHeadhuntApplicant({id: this.props.object.id}),
            getListFullApplicantInfoAction({applicant_info_id: this.props.object.applicant_info_id, per_page: 99}),
            getListFullHeadhuntApplicant({applicant_info_id: this.props.object.applicant_info_id}),
        ])
        if (resDetail && resHistory && resListApplicant) {
            this.setState({object: resDetail, history_interview: resHistory, list_applicant: resListApplicant});
        }
    }

    _onClickSendMailSeeker() {
        const {actions, idKey, object} = this.props;
        actions.createPopup(PopupSendMailSeeker, 'Gửi email ứng viên', {idKey, object, applicant_id: object.id});
    }

    async _onClickSendMailCustomer(id, hide = false) {
        const {actions, idKey, object} = this.props;
        this.setState({loading: true})
        let res;
        if (hide) {
            res = await getFileCvHideApplicant({id});
        } else {
            res = await getFileCvApplicant({id});
        }
        if (res) {
            actions.createPopup(PopupSendMailCustomer, 'Gửi CV cho Khách hàng', {
                idKey,
                object,
                attached_file_url: res.cv_file_url,
                applicant_id: id
            });
        }
        this.setState({loading: false})
    }

    _onViewContact() {
        const {actions, idKey} = this.props;
        const {object} = this.state;
        actions.createPopup(PopupViewContactSeeker, 'Xem contact ứng viên', {object, idKey});
    }

    _onEvaluateSourcer() {
        const {actions, idKey} = this.props;
        const {object} = this.state;
        actions.createPopup(PopupEvaluateSourcer, 'Đánh giá CV từ Sourcer', {id: object.id, object, idKey});
    }

    _onGuarantee() {
        const {actions, idKey} = this.props;
        const {object} = this.state;
        actions.createPopup(PopupGuarantee, 'Đánh dấu bảo hành ứng viên', {object: object, idKey});
    }

    async _onFailApplicant() {
        const {actions, object, idKey} = this.props;

        actions.SmartMessageBox({
            title: 'Bạn có chắc chắn muốn remove ứng viên khỏi pipeline',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await failHeadhuntApplicant({id: object.id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    actions.hideSmartMessageBox();
                    actions.deletePopup();
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    _onMarkAcceptance() {
        const {actions} = this.props;
        const {object} = this.state;
        actions.createPopup(PopupMarkAcceptance, 'Đánh dấu nghiệm thu ứng viên', {id: object.id});
    }
    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {object, history_interview, list_applicant, loading} = this.state;
        return (
            <div className="ml15 mt20">
                <div className="content-box pl25">
                    <div className="row">
                        <div className="col-md-6 mb10">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin CV
                                </div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Applicant ID:</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{object?.id}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Tiêu đề hồ sơ:</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{object?.resume_title}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">File CV:</div>
                                {object?.applicant_info_info?.status_contact === Constant.APPLICANT_INFO_STATUS_CONTACT_SHOW && (
                                    <div className="col-sm-4 col-xs-4 text-bold">
                                        <span onClick={() => this.getFileCv(object?.id)} className="text-link">File CV gốc</span>
                                    </div>
                                )}
                                <div className="col-sm-4 col-xs-4 text-bold">
                                    <span onClick={() => this.getFileCv(object?.id, true)} className="text-link">File CV che</span>
                                </div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Nguồn</div>
                                <div className="col-sm-8 col-xs-8 text-bold">
                                    <SpanCommon value={object?.data_source}
                                                idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_source}/>
                                </div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Expected:</div>
                                <div
                                    className="col-sm-8 col-xs-8 text-bold">{formatNumber(object?.revenue_expected, 0, '.', 'đ')}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Actual Revenue:</div>
                                <div
                                    className="col-sm-8 col-xs-8 text-bold">{formatNumber(object?.revenue_actual, 0, '.', 'đ')}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Recruiter:</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{object?.recruiter_staff_login_name}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">UV được bảo hành:</div>
                                {object?.guarantee_applicant_info && (
                                    <div
                                        className="col-sm-8 col-xs-8 text-bold">{`${object?.guarantee_applicant_info?.id} - ${object?.guarantee_applicant_info?.seeker_name}`}</div>
                                )}

                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin Ứng Viên
                                </div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Tên ứng viên:</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{object?.applicant_info_info?.name}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Email:</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{object?.applicant_info_info?.email}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Số điện thoại:</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{object?.applicant_info_info?.phone}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Địa chỉ:</div>
                                <div
                                    className="col-sm-8 col-xs-8 text-bold">{object?.applicant_info_info?.address}</div>
                            </div>
                            <div className="row mb10">
                                <div className="col-sm-4 col-xs-4">Ngày sinh:</div>
                                <div
                                    className="col-sm-8 col-xs-8 text-bold">
                                    {object?.applicant_info_info?.date_of_birth ?
                                        moment.unix(object?.applicant_info_info?.date_of_birth).format("DD/MM/YYYY")
                                        : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <CanRender actionCode={ConstantActionCode.headhunt_recruitment_pipeline_update}>
                                <button
                                    onClick={() => this.onEdit(object?.applicant_info_info)}
                                    type="button"
                                    className={"el-button el-button-small el-button-primary mb10"}>
                                    Chỉnh sửa
                                </button>
                            </CanRender>
                            {object?.applicant_info_info?.status_contact === Constant.APPLICANT_INFO_STATUS_CONTACT_HIDE && (
                                <button
                                    onClick={this.onViewContact}
                                    type="button"
                                    className={"el-button el-button-small el-button-info mb10"}>
                                    Xem contact ứng viên
                                </button>
                            )}
                            <CanRender actionCode={ConstantActionCode.headhunt_recruitment_pipeline_send_mail_seeker}>
                                {object?.applicant_info_info?.status_contact === Constant.APPLICANT_INFO_STATUS_CONTACT_SHOW && (
                                    <button
                                        onClick={this.onClickSendMailSeeker}
                                        type="button"
                                        className={"el-button el-button-small el-button-warning mb10"}>
                                        Gửi email cho ứng viên
                                    </button>
                                )}
                            </CanRender>
                            <CanRender
                                actionCode={ConstantActionCode.headhunt_recruitment_pipeline_send_mail_recruiter}>
                                <button
                                    onClick={() => this.onClickSendMailCustomer(object.applicant_info_info.id, true)}
                                    type="button"
                                    className={"el-button el-button-small el-button-warning mb10"}>
                                    Gửi email cho KH
                                </button>
                            </CanRender>
                            <CanRender
                                actionCode={ConstantActionCode.headhunt_recruitment_pipeline_fail_applicant}>
                                <button
                                    onClick={this.onFailApplicant}
                                    type="button"
                                    className={"el-button el-button-small el-button-info mb10"}>
                                    Remove khỏi pipeline
                                </button>
                            </CanRender>
                            <CanRender
                                actionCode={ConstantActionCode.headhunt_recruitment_pipeline_delete}>
                                <button
                                    onClick={() => this.onDeleteInfo(object.id, true)}
                                    type="button"
                                    className={"el-button el-button-small el-button-bricky mb10"}>
                                    Xóa
                                </button>
                            </CanRender>
                            <CanRender
                                actionCode={ConstantActionCode.headhunt_recruitment_pipeline_guarantee}>
                                <button
                                    onClick={this.onGuarantee}
                                    type="button"
                                    style={{background: "#9A28C7"}}
                                    className={"el-button el-button-small el-button-pink mb10"}>
                                    Đánh dấu ứng viên bảo hành
                                </button>
                            </CanRender>
                            <CanRender
                                actionCode={ConstantActionCode.headhunt_recruitment_pipeline_evaluate_sourcer}>
                                <button
                                    onClick={this.onEvaluateSourcer}
                                    type="button"
                                    className={"el-button el-button-small el-button-pink mb10"}>
                                    Đánh giá CV từ Sourcer
                                </button>
                            </CanRender>

                            <CanRender
                                actionCode={ConstantActionCode.headhunt_recruitment_pipeline_acceptance_create}>
                                {object && !object.applicant_acceptance_info && (
                                    <button
                                        onClick={this.onMarkAcceptance}
                                        type="button"
                                        style={{background: "#579C78"}}
                                        className={"el-button el-button-small el-button-success mb10"}>
                                        Đánh dấu nghiệm thu
                                    </button>
                                )}

                            </CanRender>
                        </div>
                    </div>
                    <div className="row mb10">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">Lịch sử campaign</div>
                        <div className="col-md-12 mb10">
                            <div className="body-table el-table">
                                {loading && (
                                    <LoadingComponent/>
                                )}
                                <TableComponent DragScroll={false}>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Date
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={50}>
                                        Applicant ID
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Campaign
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Recruiter
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {list_applicant?.map((item, key) => {
                                            return (
                                                <React.Fragment key={key}>
                                                    <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                                        <td>
                                                            <div
                                                                className="cell">{moment.unix(item.updated_at).format("DD-MM-YYYY")}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{item.id}</div>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className="cell">{`${item.campaign_info.id} - ${item.campaign_info.name}`}</div>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className="cell">{item.recruiter_staff_login_name}</div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">Lịch sử interview</div>
                        <div className="col-md-12 mb10">
                            <div className="body-table el-table">
                                <TableComponent DragScroll={false}>
                                    <TableHeader tableType="TableHeader" width={120}>
                                        Date
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Activity
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={120}>
                                        Campaign Reference
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Entered by
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Note
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Result
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Reason
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Sửa
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {history_interview?.map((item, key) => {
                                            return (
                                                <React.Fragment key={key}>
                                                    <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                                        <td>
                                                            <div className="cell text-center">
                                                                <div
                                                                    className="cell">{moment.unix(item.date_at).format("DD-MM-YYYY")}</div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{item.action_info?.name}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{item.campaign_info?.name}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{item.created_by}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{item.note}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{item.result}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{item.reason}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell text-center">
                                                                <span className="text-link mr5 font-bold"
                                                                      onClick={() => this.onEditHistoryInterview(item)}>Chỉnh sửa</span>
                                                                <span className="text-link text-red font-bold"
                                                                      onClick={() => this.onDeleteHistoryInterview(item.id)}>Xóa</span>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </React.Fragment>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createPopup,
            putToastSuccess,
            putToastError,
            deletePopup,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailApplicant);
