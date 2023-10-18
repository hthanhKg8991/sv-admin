import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Experiment/ExperimentPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {deleteExperiment, getListExperiment, toggleExperiment} from "api/experiment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {getDetailSurveyJsAnswerFull} from "api/survey";

const idKey = "ExperimentList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Project ID",
                    width: 60,
                    accessor: "project_id"
                },
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Tên",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_experiment_status} value={row?.status}/>
                },
                {
                    title: "Ngày tạo",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Hành động",
                    width: 200,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.experiment_experiment_toggle}>
                                {row.status === Constant.EXPERIMENT_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-warning font-bold"
                                          onClick={() => this.onToggle(row?.id)}>
                                       Tắt
                                    </span>
                                )}
                                {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-success font-bold"
                                          onClick={() => this.onToggle(row?.id)}>
                                        Bật
                                    </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.experiment_experiment_update}>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.experiment_experiment_delete}>
                                <span className="text-link text-red font-bold ml10"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
            isImport: true,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onToggle = this._onToggle.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EXPERIMENT_EXPERIMENT,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EXPERIMENT_EXPERIMENT,
            search: '?action=edit&id=' + id
        });
    }

    _onToggle(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn thay đổi: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await toggleExperiment({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                    // check show survey
                    const resSurvey = await getDetailSurveyJsAnswerFull({surveyjs_question_id: Constant.SURVEY_ID_EXPERIMENT_PAGE});
                    if (resSurvey && resSurvey.code !== Constant.STATUS_CODE_SUCCESS) {
                         window.open(`${Constant.BASE_URL_SURVEY}?action=detail&id=${Constant.SURVEY_ID_EXPERIMENT_PAGE}`)
                    }
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteExperiment({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Quản Lý Experiment"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.experiment_experiment_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListExperiment}
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
