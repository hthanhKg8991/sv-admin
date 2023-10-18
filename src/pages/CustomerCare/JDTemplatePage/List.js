import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/JDTemplatePage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {deleteJDTemplate, getListJDTemplate, toggleJDTemplate} from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "JDTemplateList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Tiêu đề",
                    width: 240,
                    accessor: "title"
                },
                {
                    title: "Trạng thái tin",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_jd_template_status} value={row.status}/>
                    )
                },
                {
                    title: "Ngày tạo",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Người tạo",
                    width: 120,
                    accessor: "created_by"
                },
                {
                    title: "Hành động",
                    width: 200,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.customer_care_jd_template_update}>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.customer_care_jd_template_toggle}>
                                <span className="text-link text-success font-bold ml10"
                                      onClick={() => this.onToggle(row?.id)}>
                                    {parseInt(row.status) === Constant.STATUS_ACTIVED ? "Ngưng hoạt động" : "Hoạt động"}
                                </span>
                            </CanRender>
                            {parseInt(row.status) !== Constant.STATUS_ACTIVED && (
                                <CanRender actionCode={ROLES.customer_care_jd_template_delete}>
                                <span className="text-link text-red font-bold ml10"
                                      onClick={() => this.onDelete(row?.id)}>Xóa
                                </span>
                                </CanRender>
                            )}
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
            pathname: Constant.BASE_URL_JD_TEMPLATE,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_JD_TEMPLATE,
            search: '?action=edit&id=' + id
        });
    }

    _onToggle(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn thay đổi ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await toggleJDTemplate({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
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
                const res = await deleteJDTemplate({id});
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
                title="Danh Sách JD Template"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.customer_care_jd_template_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListJDTemplate}
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
