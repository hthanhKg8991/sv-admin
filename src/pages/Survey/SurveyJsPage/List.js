import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Survey/SurveyJsPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import PopupDetailTotalAnswer from "pages/Survey/SurveyJsPage/DetailTotalAnswer";
import * as uiAction from "actions/uiAction";
import {
    deleteSurveyJsQuestion,
    getDetailSurveyJsAnswerFull,
    getListSurveyJsQuestion,
    toggleSurveyJsQuestion
} from "api/survey";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import ROLES from "utils/ConstantActionCode";

const idKey = "SurveyJsList";
class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Tiêu đề",
                    width: 160,
                    accessor: "title"
                },
                {
                    title: "Loại",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_survey_type} value={row?.type}/>
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_experiment_status} value={row?.status}/>
                },
                {
                    title: "Tổng câu trả lời",
                    width: 50,
                    accessor: "total_answer",
                    cell: row=>(
                        <span className="text-underline cursor-pointer text-success font-bold"
                            onClick={() => this.openDetailAnswer(row?.id)}>
                            {row?.total_answer}
                        </span>
                    )
                },
                {
                    title: "Hành động",
                    width: 240,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.survey_survey_js_toggle}>
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
                             <span className="text-link text-blue font-bold ml10"
                                   onClick={() => this.onDetail(row)}>
                                   Chi tiết
                             </span>
                            <CanRender actionCode={ROLES.survey_survey_js_update}>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <span className="text-link text-blue font-bold ml10"
                                  onClick={() => this.onResult(row?.id)}>
                                   Kết quả
                             </span>
                            <CanRender actionCode={ROLES.survey_survey_js_delete}>
                                {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (
                                    <span className="text-link text-red font-bold ml10"
                                          onClick={() => this.onDelete(row?.id)}>
                                        Xóa
                                    </span>
                                )}
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
        this.onDetail = this._onDetail.bind(this);
        this.onResult = this._onResult.bind(this);
        this.openDetailAnswer = this._openDetailAnswer.bind(this);
    }
    _openDetailAnswer(id){
        const { uiAction, query } = this.props;
        uiAction.createPopup(PopupDetailTotalAnswer, "Thông tin người thực hiện survey", { surveyjs_question_id: id, query });
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SURVEY,
            search: '?action=edit&id=0'
        });
    }

    _onResult(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SURVEY,
            search: '?action=result&id=' + id
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SURVEY,
            search: '?action=edit&id=' + id
        });
    }

    _onDetail(row) {
        const {history} = this.props;
        if(parseInt(row.type) === Constant.SURVEY_TYPE_INTERNAL) {
            history.push({
                pathname: Constant.BASE_URL_SURVEY,
                search: '?action=detail&id=' + row.id
            });
            return true;
        }
        const {channel_code} = this.props.branch.currentBranch;
        if (["survey_account_service"].includes(row.code) && channel_code ==="vl24h"){
            window.open(`${Constant.URL_FE.vl24h_re}/survey/${row.code}`);
        }else{
            window.open(`${Constant.URL_FE[channel_code]}/survey/${row.code}`);
        }
    }

    _onToggle(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn thay đổi: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await toggleSurveyJsQuestion({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);

                    // check show survey
                    const resSurvey = await getDetailSurveyJsAnswerFull({surveyjs_question_id: Constant.SURVEY_ID_SURVEY_PAGE});
                    if (resSurvey && resSurvey.code !== Constant.STATUS_CODE_SUCCESS) {
                        window.open(`${Constant.BASE_URL_SURVEY}?action=detail&id=${Constant.SURVEY_ID_SURVEY_PAGE}`)
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
                const res = await deleteSurveyJsQuestion({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
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
                title="Danh Sách Survey"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.survey_survey_js_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListSurveyJsQuestion}
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
