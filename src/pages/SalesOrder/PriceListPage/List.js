import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/SalesOrder/PriceListPage/ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {
    activePriceList,
    deletePriceList,
    duplicatePriceList,
    getListPriceList,
    inactivePriceList,
} from "api/saleOrderV2";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupAddPriceList from "pages/SalesOrder/PriceListPage/Popup/AddPriceList";
import moment from "moment";

const idKey = "PriceListV2";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên bảng giá",
                    width: 120,
                    accessor: "title"
                },
                {
                    title: "Ngày bắt đầu",
                    width: 70,
                    cell: row => (
                        <div>
                            {moment.unix(row.start_date).format("D/M/Y")}
                        </div>
                    )
                },
                {
                    title: "Ngày kết thúc",
                    width: 70,
                    cell: row => (
                        <div>
                            {moment.unix(row.end_date).format("D/M/Y")}
                        </div>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_price_list_status_v2}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 120,
                    time: true,
                    onClick: _ => {
                    },
                    cell: row => (
                        <div>
                            <CanRender actionCode={ROLES.sales_order_pricing_change_status}>
                                {Number(row.status) === Constant.SKU_PRICE_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-warning font-bold"
                                          onClick={() => this.onInActive(row?.id)}>
                                       Ngừng hoạt động
                                    </span>
                                )}
                                {Number(row.status) !== Constant.SKU_PRICE_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-success font-bold"
                                          onClick={() => this.onActive(row?.id)}>
                                        Hoạt động
                                    </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.sales_order_pricing_update}>
                                {Number(row.status) !== Constant.SKU_PRICE_STATUS_ACTIVE && (
                                    <span className="text-link text-blue font-bold ml10"
                                          onClick={() => this.onClickEdit(row)}>
                                        Chỉnh sửa
                                    </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.sales_order_pricing_duplicate}>
                                <span className="text-link text-blue font-bold ml10"
                                        onClick={() => this.onClickDuplicate(row.id)}>
                                    Sao chép
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.sales_order_pricing_delete}>
                                {Number(row.status) !== Constant.SKU_PRICE_STATUS_ACTIVE && (
                                    <span className="text-link text-blue font-bold ml10"
                                          onClick={() => this.onDelete(row?.id)}>
                                        Xóa
                                    </span>
                                )}
                            </CanRender>
                        </div>
                    ),
                },
            ],
            loading: false,
        };

        this.onActive = this._onActive.bind(this);
        this.onInActive = this._onInActive.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.onClickDuplicate = this._onClickDuplicate.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        this.props.actions.createPopup(PopupAddPriceList, "Thêm bảng giá", {idKey, object: {}});
    }

    _onClickEdit(object) {
        this.props.actions.createPopup(PopupAddPriceList, "Chỉnh sửa bảng giá", {idKey, object});
    }
    _onClickDuplicate(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn sao chép ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await duplicatePriceList({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    async _onActive(id) {
        const res = await activePriceList({id});
        if (res) {
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
    }

    async _onInActive(id) {
        const res = await inactivePriceList({id});
        if (res) {
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deletePriceList({id});
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
                title="Bảng giá"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.sales_order_pricing_create}>
                            <div className="left">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListPriceList}
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
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
