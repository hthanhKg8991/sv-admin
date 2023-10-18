import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import DiscountNonPolicy from "./DiscountNonPolicy";
import DiscountRecontract from "./DiscountRecontract";
import * as utils from "utils/utils";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_detail: true,
            sales_order: props.sales_order
        };
        this.showHide = this._showHide.bind(this);
    }
    _showHide(){
        this.setState({show_detail: !this.state.show_detail});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        this.setState({sales_order: newProps.sales_order})
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {sales_order} = this.state;
        let sale_amount = 0;
        if (this.props.sales_order.recontract_discount_amount){
            sale_amount += parseInt(sales_order.recontract_discount_amount);
        }
        if (this.props.sales_order.non_policy_discount_amount){
            sale_amount += parseInt(sales_order.non_policy_discount_amount);
        }
        if (sale_amount){
            sale_amount = utils.formatNumber(sale_amount,0,".","đ")
        }
        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Giảm giá ({sale_amount ? sale_amount : <span className="textRed">Không</span>})</span>
                        <div className={classnames("right", this.state.show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={this.state.show_detail}>
                        <div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-5 col-xs-12">
                                        <DiscountRecontract sales_order={sales_order}/>
                                    </div>
                                    <div className="col-sm-7 col-xs-12">
                                        <DiscountNonPolicy sales_order={sales_order}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
