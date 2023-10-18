import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import InputTags from "components/Common/InputValue/InputTags";
import Dropbox from 'components/Common/InputValue/Dropbox';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {createSalesOrderRequestInvoices, getListAccountantCustomerFull, updateSalesOrderRequestInvoices, getDetailSalesOrderRequestInvoices} from "api/saleOrder";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";

class PopupCreateRequestInvoices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer_list: [],
            customer: {},
            custom_email_e_invoices: [],
            object: {
                email_e_invoices: props?.email_e_invoices || [],
                accountant_customer_id: props?.accountant_customer_id,
            },
            object_required: ['email_e_invoices', 'accountant_customer_id'],
            object_error: {},
            name_focus: ""
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getListAccountCustomer = this._getListAccountCustomer.bind(this)
        this.getListCustomer = this._getListCustomer.bind(this)
    }

    async _onSave(data) {
        const {uiAction} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        object.sales_order_id = this.props.sales_order_id;
        uiAction.showLoading();
        let res
        if(this.props.id){
            object.id = this.props.id
            res = await updateSalesOrderRequestInvoices(object)
        }else{
            res = await createSalesOrderRequestInvoices(object);
        }
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_DETAIL);
            publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
        }
        uiAction.hideLoading();
        uiAction.deletePopup();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object: object});
    }

    async _getListAccountCustomer(args) {
        const res = await getListAccountantCustomerFull(args);
        
        const {object} = this.state;
        if (Array.isArray(res?.data?.items)) {
            const customer_list = res?.data?.items?.map(item => {
                if (Number(object?.accountant_customer_id) === Number(item.id)) {
                    this.setState({customer: item});
                }
                return {
                    value: item.id,
                    title: item.tax_code + " - " + item.name + " - " + item.address,
                    item: item
                };
            });
            this.setState({customer_list: customer_list});
            this.setState({loading_getCustomer: false});
        }
    }

    async _getListCustomer(value) {
        this.setState({loading_getCustomer: true});
        const args = {
            tax_code: value,
            status: Constant.STATUS_ACTIVED,
            per_page: 1000,
            page: 1
        };
        this._getListAccountCustomer(args);
    }

    async componentDidMount() {
        await this.getListAccountCustomer({id: this.props.object?.accountant_customer_id})
        if(this.props.id){
            const detailRequestInvoices = await getDetailSalesOrderRequestInvoices({ id: this.props.id });
            const newObj = Object.assign({}, this.state.object);
            newObj["email_e_invoices"] = detailRequestInvoices?.email_e_invoices || []
            this.setState({object: newObj});
        }
    }

    render() {
        const {object, object_error, object_required, name_focus, customer_list, customer, loading_getCustomer} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox 
                                    name="accountant_customer_id"
                                    label="Mã số thuế"
                                    data={customer_list}
                                    value={customer.id}
                                    nameFocus={name_focus}
                                    required
                                    onChange={(value) => {
                                        const newObj = Object.assign({}, this.state.object);
                                        let customer_list = this.state.customer_list.filter(c => c.value === value);
                                        let customer = customer_list[0] ? customer_list[0].item : {};
                                        
                                        const filteredListEmail = this.state.object?.email_e_invoices?.filter((itmEmail) => !this.state.custom_email_e_invoices?.includes(itmEmail))
                                        const customEmails = customer?.email_e_invoices ? customer?.email_e_invoices : []
                                        newObj["email_e_invoices"] =  [...filteredListEmail, ...customEmails];
                                        newObj["accountant_customer_id"] =  customer?.id;
                                        this.setState({customer: customer, object: newObj, custom_email_e_invoices: customEmails});
                                    }}
                                    error={object_error.employer_id}
                                    timeOut={1000}
                                    loading={loading_getCustomer}
                                    onChangeTimeOut={this.getListCustomer}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="name" label="Tên công ty" value={customer.name}
                                        readOnly/>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="address" label="Địa chỉ" value={customer.address}
                                        readOnly/>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <InputTags type="text"
                                    name="email_e_invoices"
                                    label="Email nhận hóa đơn"
                                    required={object_required.includes('email_e_invoices')}
                                    keyPress={[',', 'Enter', 'Tab']}
                                    nameFocus={name_focus}
                                    value={object.email_e_invoices}
                                    error={object_error.email_e_invoices}
                                    onChange={this.onChange}
                                    isEmail
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Xác nhận</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupCreateRequestInvoices);
