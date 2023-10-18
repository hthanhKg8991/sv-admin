import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import CanRender from "components/Common/Ui/CanRender";
import ComponentFilter from "pages/CustomerCare/ToolTransferStepGetEmployerPage/ComponentFilter";
import {deleteRequestEmployer, getListRequestEmployer} from "api/employer";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from "redux";

const idKey = "ToolTransferStepGetEmployerList";

class StepGetEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID yêu cầu",
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
                    title: "Ghi chú",
                    width: 200,
                    accessor: "note"
                },
                {
                    title: "Hành động",
                    width: 120,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.customer_care_tool_transfer_employer_assignment_list_employer}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.customer_care_tool_transfer_employer_assignment_list_employer}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ]
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onRedirectTransferStep = this._onRedirectTransferStep.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TOOL_TRANSFER_GET_EMPLOYER,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TOOL_TRANSFER_GET_EMPLOYER,
            search: '?action=edit&id=' + id
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
                const res = await deleteRequestEmployer({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    _onRedirectTransferStep() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_TOOL_TRANSFER_PROCESS,
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                title="Bước 1: Lấy danh sách NTD cần chuyển"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <CanRender actionCode={ROLES.customer_care_tool_transfer_employer_assignment_list_employer}>
                        <div className="left btnCreateNTD">
                            <button type="button" className="el-button el-button-primary el-button-small margin-right-5"
                                    onClick={this.onClickAdd}>
                                <span>Tạo yêu cầu <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onRedirectTransferStep}>
                                <span>Chuyển qua bước 2 <i className="glyphicon glyphicon-arrow-right"/></span>
                            </button>
                        </div>
                    </CanRender>
                )}>
                <ComponentFilter idKey={idKey}/>
                <Gird idKey={idKey}
                      fetchApi={getListRequestEmployer}
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
