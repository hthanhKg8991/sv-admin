import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input2 from 'components/Common/InputValue/Input2';
import Dropbox from 'components/Common/InputValue/Dropbox';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class PopupChangeCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            object: {},
            object_required: ['accountant_customer_new_id','note'],
            object_error: {},
            name_focus: "",
            customer_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.getListCustomer = this._getListCustomer.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(data){
        let object = Object.assign({}, data);
        if (object.id !== this.props.sales_order.accountant_customer_id){
            let object_required = this.state.object_required;
            let check = utils.checkOnSaveRequired(object, object_required);
            if (check.error) {
                this.setState({name_focus: check.field});
                this.setState({object_error: check.fields});
                return;
            }
            if(object.note  && object.note.length < 8){
                this.setState({object_error: {...this.state.object_error, note: `Giá trị lý do không được dưới 8 kí tự!`}});
                return;
            }
            this.props.uiAction.showLoading();
            let args = {
                sales_order_id: this.props.sales_order.id,
                accountant_customer_new_id: object.id,
                note: object.note
            };
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_CHANGE_ACCOUNTANT_CUSTOMER, args);
            this.setState({object_error: {}});
            this.setState({name_focus: ""});
        }else{
            this.props.uiAction.putToastError("Không có thông tin nào thay đổi !!!");
        }
    }
    _getListCustomer(value) {
        this.setState({loading_getCustomer: true});
        let args = {
            tax_code: value,
            status_not: Constant.STATUS_DELETED,
            per_page: 10,
            page: 1
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST, args);
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        if(name === 'note' && value && value.length < 8){
            this.setState({object_error: {[name]: `Giá trị lý do không được dưới 8 kí tự`}})
        }
        if(name === 'accountant_customer_new_id' && value){
            let customer = this.state.customer_list.filter(c => c.value === value);
            object = customer[0] ? customer[0].item : object;
        }
        object[name] = value;
        this.setState({object: object});
    }
    componentWillMount(){
        let {sales_order} = this.props;
        if (sales_order?.accountant_customer_id){
            this.setState({loading: true});
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST, {id: sales_order.accountant_customer_id});
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let customer_list = [];
                let object = {};
                response.data.items.forEach((item) => {
                    if (response.info?.args?.id === item.id){
                        object = item;
                        object.accountant_customer_new_id = item.id;
                    }
                    customer_list.push({
                        value: item.id,
                        title: item.tax_code + " - " + item.name + " - " + item.address,
                        item: item
                    });
                });
                this.setState({object: object});
                this.setState({customer_list: customer_list});
            }
            this.setState({loading_getCustomer: false});
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_CHANGE_ACCOUNTANT_CUSTOMER]){
            let response = newProps.api[ConstantURL.API_URL_POST_CHANGE_ACCOUNTANT_CUSTOMER];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList(this.props.refresh_page, {type: 'Customer', id: response.id});
            }else{
                this.setState({error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CHANGE_ACCOUNTANT_CUSTOMER);
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    //             JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    // }
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
        let {object, object_error, object_required, name_focus, customer_list, loading_getCustomer} = this.state;
        let province_list = this.props.sys.province.items;
        let district_list = this.props.sys.district.items;
        let province = province_list.filter(c => c.id === object.province_id);
        if (province.length) {
            district_list = district_list.filter(c => c.province_code === province[0].code);
        }
        let seeker_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Thông tin khách hàng kế toán</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="accountant_customer_new_id" label="Mã số thuế" data={customer_list} required={object_required.includes('accountant_customer_new_id')} noDelete
                                         value={object.accountant_customer_new_id} error={object_error.accountant_customer_new_id} nameFocus={name_focus}
                                         onChange={this.onChange}
                                         timeOut={1000} loading={loading_getCustomer}
                                         onChangeTimeOut={this.getListCustomer}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="note" label="Lý do đổi" required={object_required.includes('note')}
                                        error={object_error.note} value={object.note} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="name" label="Tên khách hàng" required={object_required.includes('name')} readOnly
                                        error={object_error.name} value={object.name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="province_id" label="Tỉnh/Thành phố" data={province_list} required={object_required.includes('province_id')} readOnly
                                             key_value="id" key_title="name"
                                             value={object.province_id} error={object_error.province_id} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="district_id" label="Quận/Huyện" data={district_list} required={object_required.includes('district_id')} readOnly
                                             key_value="id" key_title="name"
                                             value={object.district_id} error={object_error.district_id} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="address" label="Địa chỉ" required={object_required.includes('address')} readOnly
                                        error={object_error.address} value={object.address} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="vat_percent" label="Thế xuất" isNumber suffix=" %" required={object_required.includes('vat_percent')} readOnly
                                            error={object_error.vat_percent} value={object.vat_percent} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="status" label="Trạng thái hoạt động" data={seeker_status} required={object_required.includes('status')} readOnly
                                             value={object.status} error={object_error.status} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12">
                                <FormControlLabel control={
                                                    <Checkbox checked={parseInt(object.internal) === 1} color="primary"
                                                              icon={<CheckBoxOutlineBlankIcon fontSize="large"/>}
                                                              checkedIcon={<CheckBoxIcon fontSize="large"/>}
                                                              onChange={(event) => {
                                                                  let internal = parseInt(object.internal) === 1 ? 2 : 1;
                                                                  this.onChange(internal, 'internal');
                                                              }}/>
                                                    }
                                                  label={<label className="v-label">Nội bộ</label>}
                                />
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
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupChangeCustomer);
