import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/OpportunityPage/EmailTemplate/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupForm from "pages/CustomerCare/OpportunityPage/EmailTemplate/Popup/PopupForm";
import * as Constant from "utils/Constant";
import {
    deleteOpportunityEmailTemplate,
    getListOpportunityEmailTemplates,
    toggleStatusOpportunityEmailTemplate
} from "api/saleOrder";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "OpportunityEmailTemplateList";

const templateStatus = {
    active: ""
}

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
                    title: "Tên",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row =>
                        <div className="text-center"><SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_email_template_status}
                        value={row?.status}/></div>,
                },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.email_marketing_template_email_crud}>
                                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.email_marketing_template_email_crud}>
                                {row.status === Constant.EXPERIMENT_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-warning font-bold ml5"
                                          onClick={() => this.onToggle(row?.id, Constant.STATUS_INACTIVED)}>
                                         Ngưng hoạt động
                                    </span>
                                )}
                                {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (
                                    <>
                                        <span className="text-underline cursor-pointer text-success font-bold ml5"
                                              onClick={() => this.onToggle(row?.id, Constant.STATUS_ACTIVED)}>
                                            Hoạt động
                                        </span>
                                        <span className="text-link text-red font-bold ml5"
                                              onClick={() => this.onDelete(row?.id)}>
                                            Xóa
                                    </span>
                                    </>
                                )}
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onToggle = this._onToggle.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _onClickAdd() {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Thêm mới', {idKey});
    }

    _onEdit(object) {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Chỉnh sửa', {idKey, object});
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteOpportunityEmailTemplate({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    _onToggle(id, status) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: `Bạn có muốn ${status == Constant.STATUS_ACTIVED ? "kích hoạt" : "ngưng hoạt động"} template ID: ${id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await toggleStatusOpportunityEmailTemplate({id, status});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    _goBack() {
        const {history} = this.props;
        
        history.push({
            pathname: Constant.BASE_URL_OPPORTUNITY,
            search: "?action=list"
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <>
                <button type="button" className="el-button el-button-default el-button-small mb10"
                    onClick={this.goBack}>
                    <span>Quay lại </span>
                </button>
                <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="Danh Sách Quản Lý Email Template"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.email_marketing_template_email_crud}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick= {this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                    <Gird idKey={idKey}
                        fetchApi={getListOpportunityEmailTemplates}
                        query={query}
                        columns={columns}
                        defaultQuery={defaultQuery}
                        history={history}
                        isRedirectDetail={false}
                    />
                </Default>
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
