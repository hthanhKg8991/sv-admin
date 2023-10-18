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
import {getListCategory, postActiveCategory, postInActiveCategory} from "api/saleOrderV2";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupAddCategory from "pages/SalesOrder/CategoryPage/Popup/AddCategory";

const idKey = "CategoryList";

class List extends Component {
    constructor(props) {
        super(props);
        this.onActive = this._onActive.bind(this);
        this.onInActive = this._onInActive.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.state = {
            columns: [
                {
                    title: "Category Code",
                    width: 120,
                    accessor: "code"
                },
                {
                    title: "Category Name",
                    width: 120,
                    accessor: "name"
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_category_status}
                                    value={row?.status} />,
                },
                {
                    title: "Hành động",
                    width: 120,
                    time: true,
                    onClick: _ => {},
                    cell: row => (
                        <div>
                            <CanRender actionCode={ROLES.sales_order_category_change_status}>
                                {row.status === Constant.CATEGORY_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-warning font-bold"
                                          onClick={() => this.onInActive(row?.id)}>
                                       Ngừng hoạt động
                                    </span>
                                )}
                                {row.status !== Constant.CATEGORY_STATUS_ACTIVE && (
                                    <span className="text-underline cursor-pointer text-success font-bold"
                                          onClick={() => this.onActive(row?.id)}>
                                        Hoạt động
                                    </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.sales_order_category_update}>
                                <span className="text-link text-blue font-bold ml10"
                                      onClick={() => this.onClickEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                        </div>
                    ),
                },
            ],
            loading: false,
        };
    }
    _onClickAdd(){
        this.props.actions.createPopup(PopupAddCategory, "Thêm loại sản phẩm",{idKey});
    }
    _onClickEdit(id){
        this.props.actions.createPopup(PopupAddCategory, "Chỉnh sửa loại sản phẩm",{idKey, id});
    }
    async _onActive(id) {
        const res = await postActiveCategory({id});
        if (res){
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
    }
    async _onInActive(id) {
        const res = await postInActiveCategory({id});
        if (res){
            this.props.actions.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey)
        }
    }
    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Loại sản phẩm"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.sales_order_category_create}>
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
                      fetchApi={getListCategory}
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
