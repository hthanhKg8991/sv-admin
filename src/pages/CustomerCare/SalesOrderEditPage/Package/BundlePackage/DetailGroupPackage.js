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
import * as Constant from "utils/Constant";

class detailGroupPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            show_detail: true,
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
        let {sales_order, items, btnDelete, isChangeArea} = this.props;
        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package-bundle" onClick={this.showHide}>
                        <div className="left">
                            <div className="margin-top-10">
                                <span>{`ID ${items.id} - Nhóm bundle: ${items.name} `}</span>
                            </div>
                        </div>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                        {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(sales_order?.status)) && (
                            <button type="button"
                                className="el-button el-button-bricky el-button-small mt5"
                                onClick={() => btnDelete(items.id)}>
                                <span>Xóa</span>
                            </button>
                        )}
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={show_detail}>
                        <div>
                            {!this.state.loading ? (
                                <div className="text-center">
                                    <LoadingSmall/>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="crm-section">
                                        <div className="body-table el-table">
                                            <JobBasicPackage bundle={items} sales_order={sales_order} is_action={false}/>
                                            <JobPackage isChangeArea={isChangeArea} bundle={items} sales_order={sales_order} is_action={false}/>
                                            <EffectPackage isChangeArea={isChangeArea} bundle={items} sales_order={sales_order} is_action={false}/>
                                            <EmployerPackage bundle={items} sales_order={sales_order} is_action={false}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Collapse>
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
