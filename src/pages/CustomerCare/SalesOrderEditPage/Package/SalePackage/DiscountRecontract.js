import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {subscribe} from "utils/event";

class DiscountRecontract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            show_detail: true,
            discount_recontract: {},
            sales_order: props.sales_order
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.refreshList();
            });
        }, Constant.IDKEY_DISCOUNT_RECONTRACT));

        this.refreshList = this._refreshList.bind(this);
        this.showHide = this._showHide.bind(this);
    }
    _showHide(){
        this.setState({show_detail: !this.state.show_detail});
    }
    _refreshList(delay = 0){
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_DISCOUNT_RECONTRACT_DETAIL, {sales_order_id: this.state.sales_order.id}, delay);
    }

    componentWillMount(){
        // if (parseInt(this.props.sales_order.recontract_status) === Constant.RECONTRACT_STATUS_ACTIVE){
            this.refreshList();
        // }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DISCOUNT_RECONTRACT_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_DISCOUNT_RECONTRACT_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({discount_recontract: response.data})
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DISCOUNT_RECONTRACT_DETAIL);
        }
        if (newProps.refresh['DiscountRecontract']){
            let delay = newProps.refresh['DiscountRecontract'].delay ? newProps.refresh['DiscountRecontract'].delay : 0;
            // if (parseInt(newProps.sales_order.recontract_status) === Constant.RECONTRACT_STATUS_ACTIVE) {
                this.refreshList(delay);
            // }
            this.props.uiAction.deleteRefreshList('DiscountRecontract');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {discount_recontract, loading} = this.state;
        return (
            <React.Fragment>
                <div className="sub-title-form mb15">
                    <div className={classnames("pointer inline-block",this.state.show_detail?"active":"not-active")} onClick={this.showHide}>
                        <span>Giảm giá tái ký ({discount_recontract.recontract_discount_amount ? utils.formatNumber(discount_recontract.recontract_discount_amount,0,".","đ") : <span className="textRed">Không</span>})</span>
                        <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                    <div className="inline-block">
                        <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                            <i className="fa fa-refresh"/>
                        </button>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        {loading ? (
                            <div className="text-center">
                                <LoadingSmall />
                            </div>
                        ):(
                            <>
                                {discount_recontract.recontract_discount_amount > 0 && (
                                    <div className="row">
                                        <div className="col-sm-4">Tên chương trình</div>
                                        <div className="col-sm-8 text-bold">{discount_recontract.recontract.title}</div>
                                        <div className="col-sm-4">Mô tả</div>
                                        <div className="col-sm-8 text-bold">{discount_recontract.recontract_detail.description}</div>
                                        <div className="col-sm-4">Tỉ lệ</div>
                                        <div className="col-sm-8 text-bold">{utils.formatNumber(discount_recontract.recontract_detail.discount_percent,0,".","%")}</div>
                                        <div className="col-sm-4">Tiền mặt</div>
                                        <div className="col-sm-8 text-bold">{utils.formatNumber(discount_recontract.recontract_detail.discount_cash,0,".","đ")}</div>
                                        <div className="col-sm-4">Thành tiền giảm giá</div>
                                        <div className="col-sm-8 text-bold">{utils.formatNumber(discount_recontract.recontract_discount_amount,0,".","đ")}</div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Collapse>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(DiscountRecontract);
