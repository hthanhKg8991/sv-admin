import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import {publish} from "utils/event";

class PopupSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {
                cash_amount: '0'
            },
            object_required: ['description'],
            object_error: {},
            name_focus: ""
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }
    _onSave(data){
        this.setState({object_error: {}, name_focus:  "", loading: false});

        let object = Object.assign({}, data);
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({object_error: check.fields, name_focus:  check.field, loading: false});
            return;
        }
        this.props.uiAction.showLoading();
        object.sales_order_id = this.props.sales_order.id;
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALE_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALE_EDIT, object);
            this.setState({loading: false});
        }
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object});
    }
    _getDetail(id){
        let args = {
            id: id,
            sales_order_id: this.props.sales_order.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALE_DETAIL, args);
    }
    componentWillMount(){
        let {object} = this.props;
        if (object){
            this.getDetail(object.id);
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_SALE_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_SALE_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('DiscountNonPolicy');
                publish(".refresh", {}, 'SalesOrderEditPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALE_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SALE_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_SALE_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('DiscountNonPolicy');
                publish(".refresh", {}, 'SalesOrderEditPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALE_EDIT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALE_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_SALE_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({object: response.data});
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALE_DETAIL);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        let {object, object_error, object_required, name_focus} = this.state;
        let {sales_order} = this.props;
        let total = 0;
        total = object.cash_amount ?  total + parseInt(object.cash_amount) : total;
        total = object.percent_rate ? total + (parseInt(sales_order.total_amount) * (parseInt(object.percent_rate) / 100)) : total;

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Giảm giá</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="description" label="Lý do giảm giá" required={object_required.includes('description')}
                                        error={object_error.description} value={object.description} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="percent_rate" label="Tỉ lệ (%)" isNumber suffix=" %" required={object_required.includes('percent_rate')}
                                            error={object_error.percent_rate} value={object.percent_rate} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="cash_amount" label="Tiền mặt" isNumber suffix=" đ" required={object_required.includes('cash_amount')}
                                            error={object_error.cash_amount} value={object.cash_amount} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 sub-title-form">
                                <span>Tổng tiền giảm: </span>
                                <span className="number-money">{utils.formatNumber(total,0,".","đ")}</span>
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupSale);
