import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import PopupProductGroupPackage from 'pages/CustomerCare/SalesOrderEditPage/Package/Popup/PopupProductGroupPackage';
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {publish, subscribe} from "utils/event";
import DetailPackage from "pages/CustomerCare/SalesOrderEditPage/Package/GroupPackage/DetailGroupPackage";
import {deleteProductGroup, getProductGroupList} from "api/saleOrder";

const idKey = Constant.IDKEY_PRODUCT_GROUP_PACKAGE;

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data_list: [],
            show_detail: false,
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.refreshList();
        }, idKey));
        this.refreshList = this._refreshList.bind(this);
        this.btnAddGroup = this._btnAddGroup.bind(this);
        // this.btnGift = this._btnGift.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.showHide = this._showHide.bind(this);
    }

    async _refreshList(delay = 0) {
        let args = {
            service_type: Constant.SERVICE_TYPE_JOB_BOX,
            sales_order_id: this.props.sales_order.id
        };
        const res = await getProductGroupList(args);
        if (res) {
            this.setState({data_list: res})
        }
    }

    _btnAddGroup() {
        this.props.uiAction.createPopup(PopupProductGroupPackage, "Thêm Nhóm sản phẩm", {
            sales_order: this.props.sales_order,
        });
    }

    _btnEdit(object) {
        this.props.uiAction.createPopup(PopupProductGroupPackage, "Chỉnh Sửa Nhóm sản phẩm", {
            sales_order: this.props.sales_order,
            object: object,
        });
    }

    _btnDelete(id) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa gói phí ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteProductGroup(id);
                if(res){
                    this.props.uiAction.putToastSuccess("Xóa thành công!");
                }
                this.props.uiAction.hideSmartMessageBox();
                this._refreshList();
                publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
            }
        });
    }

    componentWillMount() {
        this.refreshList();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state)) || !(JSON.stringify(nextProps) === JSON.stringify(this.props));
    }
    
    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }

    render() {
        let {data_list, show_detail} = this.state;
        let {sales_order, isChangeArea} = this.props;
        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-card-group box-full">
                    <div className="box-card-title pointer box-package-group" onClick={this.showHide}>
                        <span className="title left">Nhóm sản phẩm</span>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    {show_detail ? <Collapse in={show_detail}>
                        <div>
                            {this.state.loading ? (
                                <div className="text-center">
                                    <LoadingSmall/>
                                </div>
                            ) : (
                                <div className="card-body">
                                    {![
                                        Constant.SALE_ORDER_DELETED,
                                        Constant.SALE_ORDER_ACTIVED,
                                        Constant.SALE_ORDER_INACTIVE,
                                        Constant.SALE_ORDER_EXPIRED,
                                        Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                        Constant.SALE_ORDER_CANCEL,
                                    ].includes(parseInt(sales_order.status)) && (
                                        <div className="left">
                                            <button type="button"
                                                    className="el-button el-button-primary el-button-small"
                                                    onClick={this.btnAddGroup}>
                                                    <span>Thêm Nhóm sản phẩm<i
                                                        className="glyphicon glyphicon-plus ml10"/></span>
                                            </button>
                                        </div>
                                    )}
                                    <div className="right">
                                        <button type="button" className="bt-refresh el-button" onClick={() => {
                                            this.refreshList()
                                        }}>
                                            <i className="fa fa-refresh"/>
                                        </button>
                                    </div>
                                    <div className="crm-section">
                                        <div className="body-table el-table">
                                            {data_list.map(_ => (
                                                <DetailPackage isChangeArea={isChangeArea} btnDelete={this.btnDelete} btnEdit={this.btnEdit} items={_} key={_.id} sales_order={sales_order}/>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Collapse> : <></>}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
