import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "./GirdCustom";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/HeadhuntPage/CustomerPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {deleteHeadhuntCustomer, getListHeadhuntCustomer} from "api/headhunt";
import Detail from "pages/HeadhuntPage/CustomerPage/Detail";
import PopupCheckVAT from "pages/HeadhuntPage/CustomerPage/Popup/PopupCheckVAT";
import PopupImportFile from "pages/HeadhuntPage/CustomerPage/Popup/PopupImportFile";
import {SpanCommon} from "components/Common/Ui";
import PopupCheckMultiMST from "pages/HeadhuntPage/CustomerPage/Popup/PopupCheckMultiMST";

const idKey = "CustomerList";

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
                    title: "Mã số thuế",
                    width: 100,
                    accessor: "tax_code"
                },
                {
                    title: "Tên công ty",
                    width: 120,
                    accessor: "company_name"
                },
                {
                    title: "Nguồn",
                    width: 50,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_customer_source} value={row.created_source} notStyle />,
                },
                {
                    title: "Lead",
                    width: 120,
                    cell: row => <span>{row?.customer_staff_info?.customer_headhunt_lead?.map((v, i) => (
                        <div key={i}>{v}</div>))}</span>,
                },
                {
                    title: "Sale",
                    width: 120,
                    cell: row => <span>{row?.customer_staff_info?.customer_headhunt_sale?.map((v, i) => (
                        <div key={i}>{v}</div>))}</span>,
                },
                {
                    title: "Hành động",
                    width: 80,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.headhunt_customer_update}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_customer_delete}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickCheckVAT = this._onClickCheckVAT.bind(this);
        this.onClickImport = this._onClickImport.bind(this);
        this.onClickImportContact = this._onClickImportContact.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onClickCheckMultiMST = this._onClickCheckMultiMST.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_CUSTOMER,
            search: '?action=edit&id=0'
        });
    }

    _onClickCheckVAT() {
        const {actions} = this.props;
        actions.createPopup(PopupCheckVAT, "Kiểm tra mã số thuế");
    }

    _onClickImport() {
        const {actions} = this.props;
        actions.createPopup(PopupImportFile, "Import khách hàng", {
            type: Constant.IMPORT_HISTORY_TYPE_CUSTOMER,
            link_sample: Constant.HEADHUNT_FILE_IMPORT_CUSTOMER_SAMPLE
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_CUSTOMER,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa KH ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteHeadhuntCustomer({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    _onClickImportContact() {
        const {actions} = this.props;
        actions.createPopup(PopupImportFile, "Import liên hệ", {
            type: Constant.IMPORT_HISTORY_TYPE_CONTACT,
            link_sample: Constant.HEADHUNT_FILE_IMPORT_CONTACT_SAMPLE
        });
    }

    _onClickCheckMultiMST() {
        const {actions} = this.props;
        actions.createPopup(PopupCheckMultiMST, "Kiểm tra nhiều MST");
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Quản Lý Khách Hàng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.headhunt_customer_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                        <CanRender actionCode={ROLES.headhunt_customer_import}>
                            <button type="button" className="el-button el-button-warning el-button-small"
                                    onClick={this.onClickImport}>
                                <span>Import khách hàng <i className="glyphicon glyphicon-upload"/></span>
                            </button>
                        </CanRender>
                        <CanRender actionCode={ROLES.headhunt_customer_import_contact}>
                            <button type="button" className="el-button el-button-warning el-button-small"
                                    onClick={this.onClickImportContact}>
                                <span>Import contact <i className="glyphicon glyphicon-upload"/></span>
                            </button>
                        </CanRender>
                        <CanRender actionCode={ROLES.headhunt_customer_detail_by_tax_code}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickCheckVAT}>
                                <span>Kiểm tra MST đã tồn tại</span>
                            </button>
                        </CanRender>
                        <CanRender actionCode={ROLES.headhunt_customer_check_multi_contact}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickCheckMultiMST}>
                                <span>Kiểm tra nhiều MST</span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntCustomer}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      expandRow={row => <Detail {...row} history={history}/>}
                />
            </Default>
        )
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

export default connect(null, mapDispatchToProps)(List);
