import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/System/PaymentRequestPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {deletePaymentRequest, getListPaymentRequest} from "api/saleOrder";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "PaymentRequestList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    accessor: "id"
                },
                {
                    title: "Miền",
                    width: 160,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_branch_name}
                                             value={row?.branch_code} notStyle/>
                },
                {
                    title: "Tiêu đề",
                    width: 160,
                    accessor: "title"
                },
                {
                    title: "Hành động",
                    width: 120,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.system_payment_request_update}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.system_payment_request_delete}>
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
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SYSTEM_PAYMENT_REQUEST,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SYSTEM_PAYMENT_REQUEST,
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
                const res = await deletePaymentRequest({id});
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
                title="Template Đề Nghị Thanh Toán"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.system_payment_request_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListPaymentRequest}
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