import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import JobBasicPackage from "pages/CustomerCare/SalesOrderEditPage/Package/JobBasicPackage";
import JobPackage from "pages/CustomerCare/SalesOrderEditPage/Package/JobPackage";
import EffectPackage from "pages/CustomerCare/SalesOrderEditPage/Package/EffectPackage";
import EmployerPackage from "pages/CustomerCare/SalesOrderEditPage/Package/EmployerPackage";
import RecruiterAssistantPackage from "pages/CustomerCare/SalesOrderEditPage/Package/RecruiterAssistantPackage";
import BannerPackage from "pages/CustomerCare/SalesOrderEditPage/Package/BannerPackage";
import FreemiumPackage from "pages/CustomerCare/SalesOrderEditPage/Package/FreemiumPackage";
import * as Constant from "utils/Constant";
import {SpanCommon} from "components/Common/Ui";
import moment from "moment";
import {CanRender} from "components/Common/Ui";
import ROLES from "utils/ConstantActionCode";

class detailGroupPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            show_detail: false,
            total_item: {},
            itemActive: {}
        };
        this.showHide = this._showHide.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }


    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }

    _activeItem(key) {
        let itemActive = Object.assign({}, this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state)) || !(JSON.stringify(nextProps) === JSON.stringify(this.props));
    }

    render() {
        let {show_detail} = this.state;
        let {sales_order, items, btnDelete, isChangeArea, btnEdit} = this.props;
        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package-combo" onClick={this.showHide}>
                        <div className="margin-top-10 w-40 left">
                            <span>{`ID ${items.id} - Nhóm Combo: ${items.name} `}</span>
                        </div>
                        {items.status === Constant.STATUS_ACTIVED && (
                            <div className="font-bold text-primary left mt10">Trạng thái: <SpanCommon notStyle idKey={Constant.COMMON_DATA_KEY_combo_items_group_status} value={items.status}/></div>
                        )}
                        <div className={classnames("right", show_detail ? "active" : "")}>
                        {items.status === Constant.STATUS_ACTIVED && items.expired_at && (
                            <span className="font-bold text-danger mr5">{`Expired: ${moment.unix(items.expired_at).format("DD-MM-YYYY")}`}</span>
                        )}
                        {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(sales_order?.status)) && (
                            <CanRender actionCode={ROLES.customer_care_sales_order_combo_post_items_group_update} >
                                <button type="button"
                                        className="el-button el-button-primary el-button-small mt5"
                                        onClick={() => btnEdit(items)}>
                                    <span>Chỉnh sửa</span>
                                </button>
                            </CanRender>
                        )}
                        {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(sales_order?.status)) && (
                            <button type="button"
                                className="el-button el-button-bricky el-button-small mt5"
                                onClick={() => btnDelete(items?.id)}>
                                <span>Xóa</span>
                            </button>
                        )}
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    {show_detail ? <Collapse in={show_detail}>
                        <div>
                            {!this.state.loading ? (
                                <div className="text-center">
                                    <LoadingSmall/>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="crm-section">
                                        <div className="body-table el-table">
                                            <JobBasicPackage combo={items} sales_order={sales_order} is_action={false}/>
                                            <JobPackage isChangeArea={isChangeArea} combo={items} sales_order={sales_order} is_action={false}/>
                                            <EffectPackage isChangeArea={isChangeArea} combo={items} sales_order={sales_order} is_action={false}/>
                                            <EmployerPackage combo={items} sales_order={sales_order} is_action={false}/>
                                            {/*Pharse sau sẽ mở*/}
                                            {/*<ServicePointPackage sales_order={sales_order} isChangeArea={isChangeArea} combo={items} is_action={false} />*/}
                                            <RecruiterAssistantPackage combo={items} sales_order={sales_order} is_action={false}/>
                                            <FreemiumPackage combo={items} sales_order={sales_order} is_action={false}/>
                                            <BannerPackage combo={items} sales_order={sales_order} is_action={false}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(detailGroupPackage);
