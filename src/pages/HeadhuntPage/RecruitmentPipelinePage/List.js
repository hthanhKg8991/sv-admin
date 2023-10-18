import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/HeadhuntPage/RecruitmentPipelinePage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {getListHeadhuntApplicant, listHeadhuntApplicantStatusListCampaign} from "api/headhunt";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupRecruitmentPipelineForm
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupRecruitmentPipelineForm";
import PopupChangeStatusRecruitmentPipeline
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupChangeStatusRecruitmentPipeline";
import PopupDetail from "pages/HeadhuntPage/RecruitmentPipelinePage/Kanban/PopupDetail";
import PopupHistory from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupHistory";

const idKey = "RecruitmentPipelineList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Applicant",
                    width: 200,
                    cell: row => (
                        <>
                            <p>- Tên: {row.seeker_name}</p>
                            <p>- Tiêu đề: {row.resume_title}</p>
                            <p>- Email: {row?.seeker_email}</p>
                            <p>- SĐT: {row?.seeker_phone}</p>
                        </>
                    )
                },
                {
                    title: "Campaign",
                    width: 200,
                    cell: row => <>{row.campaign_id} - {row?.campaign_info?.name}</>
                },
                {
                    title: "Ngày ghi nhận",
                    width: 100,
                    time: true,
                    accessor: "created_at",
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => <span>{this.state.list_status.find(v=> v.id === row.status)?.title}</span>
                },
                {
                    title: "Nguồn",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_source}
                                    value={row?.data_source}/>,
                },
                {
                    title: "Hành động",
                    width: 120,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_change_status}>
                                <span className="text-underline text-danger font-bold cursor-pointer ml5"
                                      onClick={() => this.onChangeStatus(row)}>
                                   Đổi trạng thái
                                </span>
                            </CanRender><br/>
                            <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_update}>
                                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <br/>
                            <span className="text-link text-blue font-bold ml5" onClick={() => this.onClickDetail(row)}>
                                    Xem chi tiết
                            </span>
                            <br/>
                            <span className="text-link text-blue font-bold ml5" onClick={() => this.onClickHistory(row)}>
                                    Xem lịch sử
                            </span>
                        </>
                    )
                },
            ],
            loading: false,
            list_status: []
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onClickDetail = this._onClickDetail.bind(this);
        this.onChangeStatus = this._onChangeStatus.bind(this);
        this.onClickHistory = this._onClickHistory.bind(this);
        this.asyncData = this._asyncData.bind(this);
    }

    async _asyncData(){
        const res = await listHeadhuntApplicantStatusListCampaign();
        if (res){
            const status =  res.sort(function(a, b) {
                return a.ordering - b.ordering;
            });
            const list_status = status.map(_ => ({
                id: _.code,
                title: _.name
            })) || [];
            this.setState({list_status});
        }
    }

    _onClickAdd() {
        const {actions} = this.props;
        actions.createPopup(PopupRecruitmentPipelineForm, 'Thêm ứng viên', {idKey});
    }

    _onClickDetail(object) {
        const {actions, idKey} = this.props;
        actions.createPopup(PopupDetail, 'Chi tiết ứng viên', {id:object.id, idKey, object});
    }

    _onEdit(object) {
        const {actions} = this.props;
        actions.createPopup(PopupRecruitmentPipelineForm, 'Chỉnh sửa ứng viên', {idKey, object});
    }

    _onChangeStatus(object) {
        const {actions} = this.props;
        const {list_status} = this.state;
        actions.createPopup(PopupChangeStatusRecruitmentPipeline, 'Chuyển trạng thái', {idKey, object, lanes: list_status});
    }

    _onClickHistory(object) {
        const {actions} = this.props;
        actions.createPopup(PopupHistory, 'Lịch sử thay đổi', {idKey, object});
    }

    componentDidMount(){
        this.asyncData();
    }

    render() {
        const {columns, list_status} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <Default
                title="Danh Sách Recruitment Pipeline"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <div className="mb15 text-right">
                    <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_create}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm ứng viên <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </CanRender>
                </div>
                <ComponentFilter idKey={idKey} query={query} list_status={list_status}/>
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntApplicant}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
