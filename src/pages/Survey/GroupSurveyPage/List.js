import React, { Component } from "react";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import PopupAddEditGroupSurvey from "./PopupAddEditGroupSurvey";
import PopupAddDivisionCode from "./PopupAddDivisionCode";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { publish } from "utils/event";
import { getListGroupSurvey, toggleActiveGroupSurvey, deleteGroupSurvey, getListDivisionGroupSurvey, deleteDivisionGroupSurvey } from "api/survey";
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup } from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
const idKey = Constant.IDKEY_GROUP_SURVEY_LIST;
const idKeyDivisionCode = Constant.IDKEY_DIVISION_CODE_GROUP_SURVEY_LIST

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Id",
                    width: 70,
                    accessor: "id"
                },
                {
                    title: "Tên",
                    width: 300,
                    accessor: "name"
                },
                {
                    title: "Division code",
                    width: 200,
                    cell: row => (
                        <>
                            {
                                row?.division_info?.map((item, key) => (
                                    <p key={key}>
                                        {
                                            item?.division_code
                                        }
                                    </p>
                                ))
                            }
                        </>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => {
                        return (<SpanCommon idKey={Constant.COMMON_DATA_KEY_status_group_survey} value={row?.status} />)
                    }
                },
                {
                    title: "Hành động",
                    width: 280,
                    onClick: () => { },
                    cell: row => (
                        <>
                            {
                                row.status != Constant.GROUP_SURVEY_DELETE &&
                                <span className="text-link text-blue font-bold mr10" onClick={() => { this.onUpdateGroupSurvey(row) }}>
                                    Chỉnh sửa
                                </span>
                            }
                            {
                                row.status == Constant.GROUP_SURVEY_INACTIVE &&
                                <span className="text-link text-green font-bold mr10" onClick={() => this.toggleActiveGroupSurvey(row?.id, row?.status)}>
                                    Hoạt động
                                </span>
                            }
                            {
                                row.status == Constant.GROUP_SURVEY_ACTIVE &&
                                <span className="text-link text-brown font-bold mr10" onClick={() => this.toggleActiveGroupSurvey(row?.id, row?.status)}>
                                    Ngưng hoạt động
                                </span>
                            }
                            {
                                row.status === Constant.GROUP_SURVEY_INACTIVE &&
                                <span className="text-link text-red font-bold" onClick={() => this.onDeleteGroupSurvey(row?.id)}>
                                    Xóa
                                </span>
                            }
                        </>
                    )
                }
            ],
            columnsExpand: [
                {
                    title: "Bộ phận",
                    width: 400,
                    accessor: "division_code"
                },
                {
                    title: "",
                    width: 100,
                    cell: row => (
                        <span className="text-link text-red font-bold" onClick={() => this.onDeleteDivisionCode(row?.division_code, row?.id)}>
                            Xóa
                        </span>
                    )
                },
            ],
            loading: false,
        };
        this.onCreateGroupSurvey = this._onCreateGroupSurvey.bind(this);
        this.onUpdateGroupSurvey = this._onUpdateGroupSurvey.bind(this);
        this.toggleActiveGroupSurvey = this._toggleActiveGroupSurvey.bind(this);
        this.onDeleteGroupSurvey = this._onDeleteGroupSurvey.bind(this);
        this.onCreateDivisionCode = this._onCreateDivisionCode.bind(this);
        this.onDeleteDivisionCode = this._onDeleteDivisionCode.bind(this);
        this.expandRow = this._expandRow.bind(this);
    }

    _onCreateGroupSurvey() {
        const { actions } = this.props;
        actions.createPopup(PopupAddEditGroupSurvey, "Thêm mới group survey", { idKey: idKey });
    }

    _onUpdateGroupSurvey(detail) {
        const { actions } = this.props;
        actions.createPopup(PopupAddEditGroupSurvey, "Chỉnh sửa group survey", { detail: detail, idKey: idKey });
    }

    _onDeleteGroupSurvey(id) {
        const { actions } = this.props;
        actions.SmartMessageBox({
            title: `Bạn có chắc muốn group survey Id : ${id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteGroupSurvey({ id, status });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey)
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    _toggleActiveGroupSurvey(id, status) {
        const { actions } = this.props;
        const name = (status !== Constant.GROUP_SURVEY_ACTIVE) ? "hoạt động" : "ngưng hoạt động";

        actions.SmartMessageBox({
            title: `Bạn có chắc muốn ${name} Id : ${id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await toggleActiveGroupSurvey({ id });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey)
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    _onCreateDivisionCode(id) {
        const { actions } = this.props;
        actions.createPopup(PopupAddDivisionCode, "Thêm mới", { group_survey_id: id, idKeyDivisionCode, idKey });
    }

    _onDeleteDivisionCode(division_code, id) {
        const { actions } = this.props;
        actions.SmartMessageBox({
            title: `Bạn có chắc muốn division code : ${division_code}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteDivisionGroupSurvey({ group_survey_division_id: id });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey)
                    publish(".refresh", {}, idKeyDivisionCode)
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    _expandRow(row) {
        const { history } = this.props;
        const { columnsExpand } = this.state;

        return (
            <div style={{ maxWidth: "500px", marginBottom: "20px" }}>
                {
                    row.status != Constant.GROUP_SURVEY_DELETE && <button
                        type="button"
                        className="el-button el-button-primary el-button-small mb10"
                        onClick={() => this.onCreateDivisionCode(row.id)}
                    >
                        <span>Thêm bộ phận access <i className="glyphicon glyphicon-plus" /></span>
                    </button>
                }
                <Gird
                    idKey={idKeyDivisionCode}
                    fetchApi={getListDivisionGroupSurvey}
                    defaultQuery={{
                        group_survey_id: row?.id
                    }}
                    columns={columnsExpand}
                    history={history}
                    isPushRoute={false}
                    isPagination={false}
                />
            </div>
        )
    };

    render() {
        const { columns } = this.state;
        const { query, defaultQuery, history } = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter} />
                )}
                title="Danh sách quản lý Group Survey"
                buttons={(

                    <div className="left btnCreateNTD">
                        <button
                            type="button"
                            className="el-button el-button-primary el-button-small"
                            onClick={this.onCreateGroupSurvey}
                        >
                            <span>Thêm mới <i className="glyphicon glyphicon-plus" /></span>
                        </button>
                    </div>
                )}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh" />
                    </button>
                )}
            >
                <Gird
                    idKey={idKey}
                    fetchApi={getListGroupSurvey}
                    columns={columns}
                    query={query}
                    defaultQuery={defaultQuery}
                    history={history}
                    expandRow={row => this.expandRow(row)}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ putToastSuccess, SmartMessageBox, hideSmartMessageBox, createPopup }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
