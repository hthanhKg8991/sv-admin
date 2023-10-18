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
    getListProductPackage,
} from "api/saleOrderV2";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupAddProductPackage from "./Popup/AddProductPackage";
import Detail from "pages/SalesOrder/ProductPackagePage/Detail";
import {getListAllProduct} from "api/system";

const idKey = "ProductPackageList";

class List extends Component {
    constructor(props) {
        super(props);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.state = {
            columns: [
                {
                    title: "Package Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Package Name",
                    width: 120,
                    accessor: "name"
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_product_package_status}
                                    value={row?.status} />,
                },
            ],
            loading: false,
            productAll: []

        };
    }
    _onClickAdd(){
        this.props.actions.createPopup(PopupAddProductPackage, "Thêm mới Product Package",{idKey});
    }
    _onClickEdit(id){
        this.props.actions.createPopup(PopupAddProductPackage, "Chỉnh sửa Product Package",{idKey, id});
    }
    async _asyncData(){
        const res = await getListAllProduct();
        if (res){
            this.setState({productAll: res.items})
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {columns, productAll} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Cấu hình Product Package"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.sales_order_product_package_create}>
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
                      fetchApi={getListProductPackage}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                      expandRow={row => <Detail object={row} productAll={productAll} {...this.props}
                        onClickEditPackage={this.onClickEdit} idKeyList={idKey} />}
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
