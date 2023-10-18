import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
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
    getListProductDetailPackage,
    postActiveProductPackage,
    postDeleteProductDetailPackage,
    postInActiveProductPackage,
} from "api/saleOrderV2";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupAddProductDetailPackage from "pages/SalesOrder/ProductPackagePage/Popup/AddProductDetailPackage";

const idKey = "ProductPackageDetailList";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.onActive = this._onActive.bind(this);
        this.onInActive = this._onInActive.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.onClickDelete = this._onClickDelete.bind(this);
        this.state = {
            columns: [
                {
                    title: "Product Code",
                    width: 120,
                    accessor: "product_code"
                },
                {
                    title: "Product Type",
                    width: 120,
                    accessor: "product_package_code"
                },
                {
                    title: "Quantity",
                    width: 70,
                    accessor: "quantity"
                },
                {
                    title: "Đơn vị",
                    width: 70,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_product_unit}
                                    value={row?.unit} notStyle/>,
                },
                {
                    title: "Miền",
                    width: 70,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_region}
                                    value={row?.region} notStyle/>,
                },
                {
                    title: "Trọng số",
                    width: 70,
                    accessor: "proportion"
                },
                {
                    title: "Ngày hết hạn",
                    width: 70,
                    cell: row => (<span>{row.expired} ngày</span>)
                },
                {
                    title: "Thời gian sử dụng",
                    width: 70,
                    cell: row => (<span>{row.duration} ngày</span>)
                },
                {
                    title: "Hành động",
                    width: 70,
                    time: true,
                    onClick: _ => {
                    },
                    cell: row => (
                        <div>
                            <CanRender actionCode={ROLES.sales_order_product_package_update}>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onClickEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.sales_order_product_package_delete}>
                                <span className="text-link text-danger font-bold ml10"
                                      onClick={() => this.onClickDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </div>
                    ),
                },
            ],
            loading: false,
        };
    }

    _onClickAdd() {
        this.props.actions.createPopup(PopupAddProductDetailPackage, "Thêm mới",
            {
                idKey,
                product_package_code: this.props.object.code,
                productAll: this.props.productAll

            });
    }

    _onClickEdit(id) {
        this.props.actions.createPopup(PopupAddProductDetailPackage, "Chỉnh sửa", {
            idKey,
            id,
            product_package_code: this.props.object.code,
            productAll: this.props.productAll
        });
    }

    _onClickDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn xóa product?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                actions.showLoading();
                const res = await postDeleteProductDetailPackage({id});
                if (res) {
                    actions.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, idKey);
                }
                actions.hideLoading();
            }
        });
    }

    async _onActive(id) {
        const res = await postActiveProductPackage({id});
        if (res) {
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, this.props.idKeyList)
        }
    }

    async _onInActive(id) {
        const res = await postInActiveProductPackage({id});
        if (res) {
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, this.props.idKeyList)
        }
    }

    render() {
        const {columns} = this.state;
        const {object, history, onClickEditPackage} = this.props;

        return (
            <div>
                <CanRender actionCode={ROLES.sales_order_product_package_create}>
                    <div className="left">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </div>
                </CanRender>
                <Gird idKey={idKey}
                      fetchApi={getListProductDetailPackage}
                      query={{product_package_code: object.code}}
                      columns={columns}
                      defaultQuery={{product_package_code: object.code}}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                      isPagination={false}
                />
                <div className="pt-6">
                    <CanRender actionCode={ROLES.sales_order_product_package_update}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={() => onClickEditPackage(object.id)}>
                            Chỉnh sửa
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.sales_order_product_package_change_status}>
                        {object.status === Constant.PRODUCT_PACKAGE_STATUS_ACTIVE && (
                            <button type="button" className="el-button el-button-bricky el-button-small"
                                    onClick={() => this.onInActive(object.id)}>
                                Ngừng hoạt động
                            </button>
                        )}
                        {object.status !== Constant.PRODUCT_PACKAGE_STATUS_ACTIVE && (
                            <button type="button" className="el-button el-button-success el-button-small"
                                    onClick={() => this.onActive(object.id)}>
                                Hoạt động
                            </button>
                        )}
                    </CanRender>
                </div>
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
