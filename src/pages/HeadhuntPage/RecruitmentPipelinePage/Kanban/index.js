import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Default from "components/Layout/Page/Default";
import { bindActionCreators } from 'redux';
import {
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    SmartMessageBox,
    createPopup,
    deletePopup
} from "actions/uiAction";
import ComponentFilter from "pages/HeadhuntPage/RecruitmentPipelinePage/ComponentFilter";
import MainBoard from "pages/HeadhuntPage/RecruitmentPipelinePage/Kanban/MainBoard";
import {
    getListHeadhuntApplicant,
    listHeadhuntApplicantStatusListCampaign
} from "api/headhunt";
import PopupRecruitmentPipelineForm
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupRecruitmentPipelineForm";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import queryString from 'query-string';
import PopupSearchApplicant from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupSearchApplicant";
import PopupChangeStatusCampaign from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupChangeStatusCampaign";
import PopupChangeStatusRecruitmentPipeline
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupChangeStatusRecruitmentPipeline";
import PopupChangeRecruiterRecruitmentPipeline
    from "pages/HeadhuntPage/RecruitmentPipelinePage/Popup/PopupChangeRecruiterRecruitmentPipeline";
import config from "config";
import * as Constant from "utils/Constant";
import PopupImportFile from "pages/HeadhuntPage/CustomerPage/Popup/PopupImportFile";
const idKey = "RecruitmentPipelineListKanban";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            lanes: null,
            checked: [],
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickSearchCandidate = this._onClickSearchCandidate.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.getListStatus = this._getListStatus.bind(this);
        this.onChangeStatusCampaign = this._onChangeStatusCampaign.bind(this);
        this.toggleChecked = this._toggleChecked.bind(this);
        this.onChangeStatus = this._onChangeStatus.bind(this);
        this.onChangeRecruiter = this._onChangeRecruiter.bind(this);
        this.clearChecked = this._clearChecked.bind(this);
        this.onImportCandidate = this._onImportCandidate.bind(this);
        this.onDownFileSample = this._onDownFileSample.bind(this);

    }

    async _asyncData() {
        const { campaign_id } = this.props.query;
        this.getListStatus(campaign_id);
    }

    async _getListStatus(campaign_id) {
        const res = await listHeadhuntApplicantStatusListCampaign({ campaign_id });
        if (res) {
            const status = res.sort(function (a, b) {
                return a.ordering - b.ordering;
            });
            const lanes = status?.map(_ => ({
                cards: [],
                currentPage: 1,
                disallowAddingCard: true,
                id: _.code,
                style: {
                    width: 280,
                    height: "68vh"
                },
                title: _.name
            })) || [];
            this.setState({ lanes });
        }
    }

    _onClickAdd() {
        const { actions } = this.props;
        actions.createPopup(PopupRecruitmentPipelineForm, 'Thêm ứng viên', { idKey });
    }

    _onClickSearchCandidate() {
        const { actions } = this.props;
        const { lanes } = this.state;
        actions.createPopup(PopupSearchApplicant, 'Tra cứu ứng viên', { idKey, lanes });
    }

    _onChangeStatusCampaign() {
        const { actions } = this.props;
        actions.createPopup(PopupChangeStatusCampaign, 'Thay đổi Pipeline Status');
    }

    _toggleChecked(id) {
        const { actions } = this.props;
        const { checked } = this.state;
        actions.deletePopup();
        if (checked.includes(id)) {
            this.setState({ checked: checked.filter(v => v !== id) });
        } else {
            this.setState({ checked: [...checked, id] });
        }
    }

    _onChangeStatus() {
        const { actions } = this.props;
        const { lanes, checked } = this.state;
        if (checked.length > 0) {
            actions.createPopup(PopupChangeStatusRecruitmentPipeline, 'Chuyển trạng thái', {
                idKey,
                checked,
                lanes,
                clearChecked: this.clearChecked
            });
        } else {
            actions.putToastError("Chọn ứng viên cần thao tác!")
        }

    }

    _onChangeRecruiter() {
        const { actions, location } = this.props;
        const { checked } = this.state;
        if (checked.length > 0) {
            actions.createPopup(PopupChangeRecruiterRecruitmentPipeline, 'Chuyển Recruiter', {
                location,
                idKey,
                checked,
                clearChecked: this.clearChecked
            });
        } else {
            actions.putToastError("Chọn ứng viên cần thao tác!")
        }
    }

    _onImportCandidate() {
        const { actions } = this.props;
        actions.createPopup(PopupImportFile, 'Import ứng viên số lượng lớn', {
            idKey,
            type: Constant.IMPORT_HISTORY_TYPE_APPLICANT, 
            link_sample: Constant.HEADHUNT_FILE_IMPORT_APPLICANT_SAMPLE,
        });
    }

    _clearChecked() {
        this.setState({ checked: [] });
    }

    _onDownFileSample() {
        window.open(`${config.apiHeadHuntDomain}${Constant.HEADHUNT_FILE_IMPORT_APPLICANT_SAMPLE}`)
    }

    componentDidMount() {
        this.asyncData();
    }

    componentWillReceiveProps(nextProps) {
        const { history } = this.props;
        if (nextProps.filter && nextProps.filter !== this.props.filter) {
            history.replace(window.location.pathname + '?' + queryString.stringify(nextProps.filter));
        }
        if (nextProps.query?.campaign_id !== this.props.query?.campaign_id) {
            this.getListStatus(nextProps.query?.campaign_id);
            this.clearChecked();
        }
    }

    render() {
        const { query } = this.props;
        const { lanes, checked } = this.state;
        return (
            <Default
                title="Danh Sách Recruitment Pipeline"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh" />
                    </button>
                )}
            >

                {
                    lanes && (
                        <>
                            <div className="row">
                                <div className="col-sm-12">
                                    <ComponentFilter idKey={idKey} query={query} list_status={lanes} />
                                </div>
                                <div className="col-sm-12">
                                    <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_create}>
                                        <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.onClickAdd}>
                                            <span>Thêm ứng viên <i className="glyphicon glyphicon-plus" /></span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_search_candidate}>
                                        <button type="button" className="el-button el-button-info el-button-small"
                                            onClick={this.onClickSearchCandidate}>
                                            <span>Tra cứu ứng viên</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_change_status_campaign}>
                                        <button type="button" className="el-button el-button-warning el-button-small"
                                            onClick={this.onChangeStatusCampaign}>
                                            <span>Thêm/bớt trạng thái pipeline</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_change_status}>
                                        <button type="button" className="el-button el-button-info el-button-small"
                                            style={{ background: "#56889D", border: "1px solid #56889D" }}
                                            onClick={this.onChangeStatus}>
                                            <span>Chuyển trạng thái</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_acceptance_update_recruiter}>
                                        <button type="button" className="el-button el-button-info el-button-small"
                                            style={{ background: "#3274B0", border: "1px solid #3274B0" }}
                                            onClick={this.onChangeRecruiter}>
                                            <span>Chuyển Recruiter</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.headhunt_recruitment_pipeline_acceptance_update_recruiter}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onImportCandidate}>
                                        <span>Import ứng viên</span>
                                    </button>
                                    </CanRender>
                                </div>
                            </div>

                            <MainBoard stateChecked={[checked, this.toggleChecked]} query={query} idKey={idKey}
                                lanes={lanes}
                                fetchApi={getListHeadhuntApplicant} />
                        </>
                    )
                }
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        filter: state.filter[idKey]
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            deletePopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
