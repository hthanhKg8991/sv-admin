import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/SalesOrder/CategoryPage/ComponentFilter";
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
    getListFullCategory,
    getListFullProductPackage, getListFullSku,
    getListSku,
    postActiveSku,
    postInActiveSku
} from "api/saleOrderV2";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupAddSku from "./Popup/AddSku";
import PopupAddBundle from "pages/SalesOrder/SkuPage/Popup/AddBundle";

const idKey = "SkuList";

class List extends Component {
    constructor(props) {
        super(props);
        this.onActive = this._onActive.bind(this);
        this.onInActive = this._onInActive.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickAddBundle = this._onClickAddBundle.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.state = {
            columns: [
                {
                    title: "Sku Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Sku Name",
                    width: 120,
                    accessor: "name"
                },
                {
                    title: "Loại sản phẩm",
                    width: 120,
                    accessor: "service_category_code"
                },
                {
                    title: "Đơn vị",
                    width: 70,
                    cell: row =>
                        <>
                            {row?.unit === Constant.TYPE_BUNDLE_UNIT ? (
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_bundle_quantity}
                                            value={row?.unit} notStyle/>
                            ) : (
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_sku_quantity}
                                            value={row?.unit} notStyle/>
                            )}
                        </>

                },
                {
                    title: "Package Code",
                    width: 120,
                    accessor: "product_package_code"
                },
                {
                    title: "Trạng thái",
                    width: 90,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_sku_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 150,
                    time: true,
                    onClick: _ => {
                    },
                    cell: row => (
                        <div>
                            <CanRender actionCode={ROLES.sales_order_sku_change_status}>
                                {row.status === Constant.SKU_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-warning font-bold"
                                          onClick={() => this.onInActive(row?.id)}>
                                       Ngừng hoạt động
                                    </span>
                                )}
                                {row.status !== Constant.SKU_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-success font-bold"
                                          onClick={() => this.onActive(row?.id)}>
                                        Hoạt động
                                    </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.sales_order_sku_update}>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onClickEdit(row?.id, row?.unit)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                        </div>
                    ),
                },
            ],
            loading: false,
            category: [],
            products: [],
            sku: [],
        };
    }

    _onClickAddBundle() {
        const {products, category, sku} = this.state;
        this.props.actions.createPopup(PopupAddBundle, "Thêm mới Bundle", {idKey, products, category, sku});
    }

    _onClickAdd() {
        const {products, category} = this.state;
        this.props.actions.createPopup(PopupAddSku, "Thêm mới SKU", {idKey, products, category});
    }

    _onClickEdit(id, unit) {
        const {products, category, sku} = this.state;
        if (unit === Constant.TYPE_BUNDLE_UNIT) {
            this.props.actions.createPopup(PopupAddBundle, "Thêm mới Bundle", {id,idKey, products, category, sku});
        } else {
            this.props.actions.createPopup(PopupAddSku, "Chỉnh sửa SKU", {idKey, id, products, category});
        }

    }

    async _onActive(id) {
        const res = await postActiveSku({id});
        if (res) {
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
    }

    async _onInActive(id) {
        const res = await postInActiveSku({id});
        if (res) {
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
    }

    async _asyncData() {
        const [resCategory, resProduct, resSkuFull] = await Promise.all([
            getListFullCategory({status: Constant.CATEGORY_STATUS_ACTIVE}),
            getListFullProductPackage({status: Constant.PRODUCT_PACKAGE_STATUS_ACTIVE}),
            getListFullSku({status: Constant.SKU_STATUS_ACTIVE})
        ]);
        if (resCategory) {
            this.setState({category: resCategory});
        }
        if (resProduct) {
            this.setState({products: resProduct});
        }
        if (resSkuFull) {
            this.setState({sku: resSkuFull});
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách sku"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.sales_order_sku_create}>
                            <div className="left">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                                <button type="button" className="el-button el-button-primary el-button-small ml15"
                                        onClick={this.onClickAddBundle}>
                                   <span>Thêm Bundle <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListSku}
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
