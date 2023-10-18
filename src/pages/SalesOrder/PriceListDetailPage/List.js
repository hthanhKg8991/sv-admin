import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/SalesOrder/PriceListDetailPage/ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupAddPriceList from "pages/SalesOrder/PriceListDetailPage/Popup/AddPriceList";
import {bindActionCreators} from 'redux';
import * as uiAction from "actions/uiAction";
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import {
    deleteSkuPrice,
    getListFullSku,
    getListSkuPrice,
    postActiveSkuPrice,
    postInActiveSkuPrice
} from "api/saleOrderV2";
import ROLES from "utils/ConstantActionCode";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import moment from "moment";
import queryString from 'query-string';
import {getListPriceList} from "api/saleOrderV2";

const idKey = "PriceListDetailV2";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên bảng giá",
                    width: 120,
                    accessor: "price_list_title"
                },
                {
                    title: "SKU Code",
                    width: 120,
                    accessor: "sku_code"
                },
                {
                    title: "SKU Name",
                    width: 120,
                    accessor: "sku_name"
                },
                {
                    title: "Đơn giá",
                    width: 70,
                    cell: row => (
                        <div>
                            {utils.formatNumber(row.price, 0, ".", "đ")}
                        </div>
                    )
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
                            <CanRender actionCode={ROLES.sales_order_pricing_detail_change_status}>
                                {row.status === Constant.SKU_PRICE_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-warning font-bold"
                                          onClick={() => this.onInActive(row?.id)}>
                                       Ngừng hoạt động
                                    </span>
                                )}
                                {row.status !== Constant.SKU_PRICE_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-success font-bold"
                                          onClick={() => this.onActive(row?.id)}>
                                        Hoạt động
                                    </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.sales_order_pricing_detail_update}>
                                {row.status !== Constant.SKU_PRICE_STATUS_ACTIVE && (
                                    <span className="text-link text-blue font-bold ml10"
                                          onClick={() => this.onClickEdit(row?.id)}>
                                        Chỉnh sửa
                                    </span>
                                )}
                            </CanRender>
                        </div>
                    ),
                },
            ],
            loading: false,
            list_sku: [],
            price_list: [],
            firstValue: undefined,
            isFinding: true,
        };
        this.onActive = this._onActive.bind(this);
        this.onInActive = this._onInActive.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.getDefaultFilter = this._getDefaultFilter.bind(this);
    }

    _onClickAdd() {
        this.props.actions.createPopup(PopupAddPriceList, "Thêm đơn giá SKU", {idKey, list_sku: this.state.list_sku});
    }

    _onClickEdit(id) {
        this.props.actions.createPopup(PopupAddPriceList, "Chỉnh sửa đơn giá SKU", {
            idKey,
            id,
            list_sku: this.state.list_sku
        });
    }

    async _onActive(id) {
        const res = await postActiveSkuPrice({id});
        if (res) {
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
    }

    async _onInActive(id) {
        const res = await postInActiveSkuPrice({id});
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
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteSkuPrice({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey)
            }
        });
    }

    async _asyncData() {
        const res = await getListFullSku({status: Constant.SKU_STATUS_ACTIVE});
        if (res) {
            const resMapName = res.map(i => ({...i, name: `${i.code} - ${i.name}`}))
            this.setState({list_sku: resMapName});
        }
        
    }

    async _getDefaultFilter() {
        const query = queryString.parse(window.location.search);
        
        const res = await getListPriceList({
            per_page: 999
        });

        if (res && Array.isArray(res?.items)) {
            const firstValueFound = res?.items?.find((item) => Number(item?.status) === Constant.SKU_PRICE_STATUS_ACTIVE)?.id
            this.setState({firstValue: firstValueFound, isFinding: false}, () => {
                if(!query?.price_list_id){
                    query.price_list_id = firstValueFound;
                    this.props.history.push(`?${queryString.stringify(query)}`);
                }
            });
        }else{
            this.setState({isFinding: false})
        }
    }

    componentDidMount() {
        this.asyncData()
        this.getDefaultFilter();
    }

    render() {
        const {columns,firstValue, price_list, isFinding} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter price_list={price_list} firstValue={firstValue} history={history} idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Đơn giá SKU"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.sales_order_pricing_detail_create}>
                            <div className="left">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                {!isFinding && <Gird idKey={idKey}
                      fetchApi={getListSkuPrice}
                      query={{...query,price_list_id: firstValue}}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />}
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
         uiAction: bindActionCreators(uiAction, dispatch),
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
