import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/CustomerCare/ToolTransferStepProcessPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import {deleteMultiRequestAssignmentEmployer, getListMultiRequestAssignmentEmployer} from "api/employer";
import {bindActionCreators} from "redux";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "ToolTransferStepGetEmployerList";

class StepGetEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID Yêu cầu",
                    width: 100,
                    accessor: "id"
                },
                {
                    title: "Người tạo",
                    width: 100,
                    accessor: "created_by"
                },
                {
                    title: "Ngày tạo",
                    width: 100,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_tool_transfer_process_status} value={row?.status} />
                    )
                },
                {
                    title: "File kết quả chia",
                    width: 100,
                    time: true,
                    cell: row => (
                        <>{row?.status === Constant.STATUS_ACTIVED &&
                        <a href={row?.url_file || ""} className="text-link text-bold" download>Tải xuống</a>}</>
                    )
                },
                {
                    title: "Hành động",
                    width: 120,
                    cell: row => (
                        <>
                            {row?.status !== Constant.STATUS_TRANSFER_PROCESS_ACTIVE && (
                                <CanRender actionCode={ROLES.customer_care_tool_transfer_employer_assignment_transfer}>
                                    <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                        Chỉnh sửa
                                    </span>
                                </CanRender>
                            )}
                            {row?.status === Constant.STATUS_TRANSFER_PROCESS_DRAFT && (
                                <CanRender actionCode={ROLES.customer_care_tool_transfer_employer_assignment_transfer}>
                                    <span className="text-link text-red font-bold ml5"
                                          onClick={() => this.onDelete(row?.id)}>
                                        Xóa
                                    </span>
                                </CanRender>
                            )}
                        </>
                    )
                },
            ]
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onRedirectGetEmployerStep = this._onRedirectGetEmployerStep.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TOOL_TRANSFER_PROCESS,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TOOL_TRANSFER_PROCESS,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Xác nhận xóa yêu cầu chuyển giỏ với ID yêu cầu ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteMultiRequestAssignmentEmployer({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    _onRedirectGetEmployerStep() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TOOL_TRANSFER_GET_EMPLOYER,
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                title="Bước 2: Chia giỏ NTD số lượng lớn"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <CanRender actionCode={ROLES.customer_care_tool_transfer_employer_assignment_transfer}>
                        <div className="left btnCreateNTD">
                            <button type="button" className="el-button el-button-primary el-button-small margin-right-5"
                                    onClick={this.onClickAdd}>
                                <span>Tạo yêu cầu <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onRedirectGetEmployerStep}>
                                <span>Quay về bước 1 <i className="glyphicon glyphicon-arrow-left"/></span>
                            </button>
                        </div>
                    </CanRender>
                )}>
                <ComponentFilter idKey={idKey}/>
                <Gird idKey={idKey}
                      fetchApi={getListMultiRequestAssignmentEmployer}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
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

export default connect(mapStateToProps, mapDispatchToProps)(StepGetEmployer);
