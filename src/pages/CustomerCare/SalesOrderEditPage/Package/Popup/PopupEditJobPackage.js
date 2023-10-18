import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";
import moment from 'moment-timezone';
import {publish} from "utils/event";
import {getListPriceRunning} from "api/saleOrder";
import {getDetailSKU} from "api/system";
import Checkbox from '@material-ui/core/Checkbox';
import ROLES from "utils/ConstantActionCode";
import {CanRender} from "components/Common/Ui";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupJobPackage extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Popup");
        this.state = {
            checked: false,
            object: {},
            object_split: [
                {
                    quantity: 1,
                    week_quantity: null,
                }
            ],
            object_required: ['service_code', 'job_quantity', 'displayed_area', 'displayed_method', 'start_date', 'week_quantity', 'sku_code_service'],
            object_error: {},
            name_focus: "",
            package_running: [],
            configForm: configForm,
            splitNumber: 1
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeSplit = this._onChangeSplit.bind(this);
        this.onChangeService = this._onChangeService.bind(this);
        this.onChangeEffect = this._onChangeEffect.bind(this);
        this.onAddSplit = this._onAddSplit.bind(this);
        this.removeSplit = this._removeSplit.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }
    _onSave(data){
        const {uiAction, is_duplicate = false} = this.props;
        const {object_split, configForm} = this.state;
        this.setState({object_error: {},loading: true, name_focus: ""});

        let sales_order = this.props.sales_order;
        let object = Object.assign({}, data);
        let object_required = this.state.object_required;
        if (object.effect_code){
            object_required = object_required.concat(['effect_start_date','effect_week_quantity']);
        }

        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field,loading: false,object_error: check.fields});

            if(check.fields.sku_code_service) {
                uiAction.putToastError("Mã SKU tin là thông tin bắt buộc")
            }

            if(check.fields.sku_code_effect) {
                uiAction.putToastError("Mã SKU hiệu ứng là thông tin bắt buộc")
            }

            return;
        }
        let error = {};
        let ordered_on = moment(moment.unix(sales_order.ordered_on).format("YYYY-MM-DD")).unix();
        if (parseInt(object.job_quantity) <= 0){
            error['job_quantity'] = ":attr_name không hợp lệ.";
        }
        if (moment(moment.unix(object.start_date).format("YYYY-MM-DD")).unix() < ordered_on){
            error['start_date'] = ":attr_name phải lớn hơn ngày ghi nhận phiếu.";

        }

        // Check nếu k check thì bỏ chiết khấu
        if (!this.state.checked) {
            object.discount_rate = null;
            object.promotion_rate = null;
        }
        // if (object.effect_code){
        //     if (moment(moment.unix(object.effect_start_date).format("YYYY-MM-DD")).unix() < ordered_on){
        //         error['effect_start_date'] = ":attr_name phải lớn hơn ngày ghi nhận phiếu.";
        //     }
        //     if (object.effect_start_date < object.start_date){
        //         error['effect_start_date'] = ":attr_name phải lớn hơn thời gian hiệu lực của gói phí.";
        //     }
        // }
        if (!(Object.entries(error).length === 0)){
            this.setState({object_error: error, loading: false});
            return;
        }
        object.sales_order_id = this.props.sales_order.id;
        object.type_campaign = this.props.type_campaign;

        if(configForm.includes("is_split_package")) {
            // Kiểm tra tách số tuần
            const totalWeek = object_split.reduce((c, i) => {c += i.week_quantity; return c;}, 0);
            if(totalWeek !== Number(object.week_quantity)) {
                uiAction.putToastError("Chia số tuần không hợp lệ");
                this.setState({loading: false});
                return false;
            }
            object.split_details = object_split;
        }
        if(this.props?.items_group_id){
            object.items_group_id = this.props.items_group_id;
        }

        // Nếu là sao chép thì xóa id của item
        if(is_duplicate) {
            delete object.id;
        }

        this.props.uiAction.showLoading();
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_JOB_PACKAGE_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_JOB_PACKAGE_EDIT, object);
        }
    }

    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        if(name === 'effect_code' && !value){
            delete object.effect_code;
            delete object.effect_start_date;
            delete object.effect_week_quantity;
            delete object.effect_day_quantity;
        }else{
            object[name] = value;
        }
        this.setState({object: object});
    }

    _onChangeSplit(value, name, index) {
        const {object_split} = this.state;
        let newObjectSplit = [...object_split];
        let valueChange = newObjectSplit[index];
        if(valueChange) {
            valueChange[name] = Number(value);
        } else {
            valueChange = {[name]: Number(value)};
        }
        newObjectSplit[index] = valueChange;
        this.setState({object_split: newObjectSplit});
    }

    _removeSplit(index) {
        const {object_split} = this.state;
        const newObjectSplit = object_split.filter((e, i) => Number(i) !== Number(index));
        this.setState({object_split: newObjectSplit});
    }

    async _onChangeService(value, name) {
        const {object} = this.state;
        if (value) {
            // sku_code_service
            const resService = await getDetailSKU({service_code: value});
            const resEffect = await getDetailSKU({service_code: value, effect_code: object.effect_code});
            this.setState({
                object: {
                    ...object,
                    sku_code_service: resService?.sku_code,
                    sku_code_effect: object.effect_code ? resEffect?.sku_code : null
                }
            });
        } else {
            object.sku_code_service = null;
            object.sku_code_effect = null;
            this.setState({object: object});
        }
        this.onChange(value, name);
    }

    async _onChangeEffect(value, name) {
        const {object, object_required} = this.state;
        if (value && object.service_code) {
            const res = await getDetailSKU({service_code: object.service_code, effect_code: value});
            if (res) {
                this.setState({
                    object: {...object, sku_code_effect: res?.sku_code},
                    object_required: [...object_required, "sku_code_effect"]
                });
            }
        } else {
            object.sku_code_effect = null;
            this.setState({object: object, object_required: object_required.filter(obj => obj !== "sku_code_effect")});
        }
        this.onChange(value, name);
    }

    _onAddSplit() {
        const {object_split} = this.state;
        this.setState({
            object_split: [...object_split, {
                quantity: 1,
                week_quantity: null,
            }]
        });
    }

    _getDetail(id) {
        let args = {
            id: id,
            sales_order_id: this.props.sales_order.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL, args);
    }

    async _getPackageRunning() {
        const res = await getListPriceRunning({service_type : [Constant.SERVICE_TYPE_JOB_BOX]});
        if (res &&  Array.isArray(res)) {
            const packages = res.map(p => p?.service_code);
            this.setState({package_running: packages});
        }
    }

    componentDidMount() {
        const {object} = this.props;
        if (object){
            this.getDetail(object.id);
        }
        this._getPackageRunning();
    }

    componentWillReceiveProps(newProps) {
        const keyRefresh = this.props?.items_group_id ? `JobProductGroupPackage${this.props?.items_group_id}` :"JobPackage";
        if (newProps.api[ConstantURL.API_URL_POST_JOB_PACKAGE_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_JOB_PACKAGE_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList(keyRefresh);
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
                publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_JOB_PACKAGE_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_JOB_PACKAGE_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_JOB_PACKAGE_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList(keyRefresh);
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_JOB_PACKAGE);
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
                publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_JOB_PACKAGE_EDIT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {};
                object.id = response.data.id;
                object.service_code = response.data.service_code;
                object.job_quantity = response.data.service_items_info.quantity;
                object.displayed_area = response.data.service_items_info.displayed_area;
                object.displayed_method = response.data.service_items_info.displayed_method;
                object.start_date = response.data.start_date;
                object.week_quantity = response.data.week_quantity;
                object.day_quantity = response.data.day_quantity;
                object.sku_code_service = response.data.sku_code_service;
                object.promotion_rate = response.data.promotion_rate;
                object.discount_rate = response.data.discount_rate;
                if (response.data.items) {
                    object.effect_code = response.data.items.service_code;
                    object.effect_start_date = response.data.items.start_date;
                    object.effect_week_quantity = response.data.items.week_quantity;
                    object.effect_day_quantity = response.data.items.day_quantity;
                    object.sku_code_effect = response.data.items.sku_code_effect;
                }
                this.setState({object: object});
                if(response.data.service_items_info) {
                    this.setState({object_split: response.data.service_items_info.split_details})
                }
                if(object.promotion_rate || object.discount_rate) {
                    this.setState({checked: true});
                }
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
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
        let {object, object_error, object_required, name_focus, package_running, configForm, object_split} = this.state;
        let channel_code = this.props.branch.currentBranch.channel_code;
        let box_code_list = this.props.sys.service.items.filter(c =>
            c.channel_code === channel_code &&
            c.service_type === Constant.SERVICE_TYPE_JOB_BOX &&
            package_running.includes(c.code) // kiểm tra các gói đang chạy trong bảng giá
        );
        let effect_list = this.props.sys.effect.items.filter(c =>
            c.channel_code === channel_code &&
            c.detail_part.indexOf(Constant.EFFECT_TYPE_REFRESH_HOUR) < 0 && c.detail_part.indexOf(Constant.EFFECT_TYPE_REFRESH_DAY) < 0
        );

        let area = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_area);
        let display_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_display_method);

        let end_date = utils.calcDate(object.start_date, object.week_quantity, object.day_quantity, "DD/MM/YYYY");
        let end_date_effect = utils.calcDate(object.effect_start_date, object.effect_week_quantity, object.effect_day_quantity, "DD/MM/YYYY");

        /*Kiểm tra điều kiện hiển thị form cho MW*/
        // #CONFIG_BRANCH
        if(channel_code === Constant.CHANNEL_CODE_MW) {
            object.job_quantity = Constant.DEFAULT_VALUE_FORM_JOBBOX[channel_code].job_quantity;
            object.displayed_area = Constant.DEFAULT_VALUE_FORM_JOBBOX[channel_code].displayed_area;
            object.displayed_method = Constant.DEFAULT_VALUE_FORM_JOBBOX[channel_code].displayed_method;
        }
        
        const isEffectPackage = configForm.includes("is_effect_package");
        const isSplitPackage = configForm.includes("is_split_package");

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Tin tính phí</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="service_code" label="Gói dịch vụ" data={box_code_list} required={object_required.includes('service_code')}
                                         key_value="code" key_title="name"
                                         readOnly
                                         error={object_error.service_code} value={object.service_code} nameFocus={name_focus}
                                         onChange={this.onChangeService}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-4 col-xs-12 mb10">
                                    <Input2 type="text" name="job_quantity" label="Số tin" isNumber required={object_required.includes('job_quantity')}
                                            error={object_error.job_quantity} value={object.job_quantity} nameFocus={name_focus}
                                            readOnly
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-4 col-xs-12 mb10">
                                    <Dropbox name="displayed_area" label="Khu vực hiển thị" data={area} required={object_required.includes('displayed_area')}
                                             error={object_error.displayed_area} value={object.displayed_area} nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-4 col-xs-12 mb10">
                                    <Dropbox name="displayed_method" label="Hình thức hiển thị" data={display_method} required={object_required.includes('displayed_method')}
                                             error={object_error.displayed_method} value={object.displayed_method} nameFocus={name_focus}
                                             readOnly
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu" required={object_required.includes('start_date')} minDate={moment()}
                                                    error={object_error.start_date} value={object.start_date} nameFocus={name_focus}
                                                    onChange={this.onChange}
                                                    readOnly
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="week_quantity" label="TG DV (tuần)" isNumber required={object_required.includes('week_quantity')}
                                            error={object_error.week_quantity} value={object.week_quantity} nameFocus={name_focus}
                                            onChange={this.onChange}
                                            readOnly
                                    />
                                    {end_date && (
                                        <div className="end-date"><span>ngày kết thúc: {end_date}</span></div>
                                    )}
                                </div>
                                {/*<div className="col-sm-4 col-xs-12 mb10">*/}
                                    {/*<Input2 type="text" name="day_quantity" label="TG DV (ngày)" isNumber required={object_required.includes('day_quantity')}*/}
                                            {/*error={object_error.day_quantity} value={object.day_quantity} nameFocus={name_focus}*/}
                                            {/*onChange={this.onChange}*/}
                                    {/*/>*/}
                                {/*</div>*/}
                                <div className="col-sm-12 col-xs-12 padding0">
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Input2 type="text" name="sku_code_service" label="Mã SKU"
                                                required={object_required.includes('sku_code_service')}
                                                value={object.sku_code_service} readOnly/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xs-12 padding0">
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Checkbox
                                            checked={this.state.checked}
                                            color="primary"
                                            classes={{root: 'custom-checkbox-root'}}
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                            disabled
                                            onChange={() => this.setState({checked: !this.state.checked})}
                                        />
                                        <span>Điều chỉnh tỷ lệ chiết khấu, khuyến mãi ngoại lệ</span>
                                    </div>
                                </div>
                                {this.state.checked && (
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Input2 type="text" name="discount_rate" label="Chiết Khấu (%)" isNumber
                                                    suffix=" %"
                                                    readOnly
                                                    error={object_error.discount_rate} value={object.discount_rate}
                                                    nameFocus={name_focus}
                                                    onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Input2 type="text" name="promotion_rate" label="Khuyến mãi (%)" isNumber
                                                    suffix=" %"
                                                    readOnly
                                                    error={object_error.promotion_rate} value={object.promotion_rate}
                                                    nameFocus={name_focus}
                                                    onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            {isEffectPackage && (
                                <>
                                    <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                        <span>Hiệu ứng</span>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="effect_code" label="Hiệu ứng" data={effect_list} required={object_required.includes('effect_code')}
                                                 key_value="code" key_title="name"
                                                 readOnly
                                                 error={object_error.effect_code} value={object.effect_code} nameFocus={name_focus}
                                                 onChange={this.onChangeEffect}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <DateTimePicker name="effect_start_date" label="Ngày bắt đầu" required={!!object.effect_code} minDate={moment()}
                                                            error={object_error.effect_start_date} value={object.effect_start_date} nameFocus={name_focus}
                                                            onChange={this.onChange}
                                                            readOnly
                                            />
                                        </div>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Input2 type="text" name="effect_week_quantity" label="TG DV (tuần)" isNumber required={!!object.effect_code}
                                                    error={object_error.effect_week_quantity} value={object.effect_week_quantity} nameFocus={name_focus}
                                                    onChange={this.onChange}
                                                    readOnly
                                            />
                                            {end_date_effect && (
                                                <div className="end-date"><span>ngày kết thúc: {end_date_effect}</span></div>
                                            )}
                                        </div>
                                        {/*<div className="col-sm-4 col-xs-12 mb10">*/}
                                            {/*<Input2 type="text" name="effect_day_quantity" label="TG DV (ngày)" isNumber*/}
                                                    {/*error={object_error.effect_day_quantity} value={object.effect_day_quantity} nameFocus={name_focus}*/}
                                                    {/*onChange={this.onChange}*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Input2 type="text" name="sku_code_effect" label="Mã SKU"
                                                    required={object_required.includes('sku_code_effect')}
                                                    value={object.sku_code_effect} readOnly/>
                                        </div>
                                    </div>
                                </>
                                )
                            }
                            {isSplitPackage && (
                                <>
                                    <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                        <span>Chia nhỏ số tin - số tuần</span>
                                    </div>
                                    {object_split.map((item, idx) => (
                                        <React.Fragment key={idx.toString()}>
                                            <div className="col-sm-5 col-xs-12 mb10">
                                                <Input2 type="text" name="quantity" label="Số tin" isNumber
                                                        required={true}
                                                        nameFocus={name_focus}
                                                        value={1}
                                                        readOnly
                                                />
                                            </div>
                                            <div className="col-sm-5 col-xs-12 mb10">
                                                <Input2 type="text" name="week_quantity" label="Số tuần" isNumber
                                                        required={true}
                                                        nameFocus={name_focus}
                                                        readOnly
                                                        value={item?.week_quantity}
                                                        onChange={(value, name) => this.onChangeSplit(value, name, idx)}
                                                />
                                            </div>
                                            <div className="col-sm-2 col-xs-12 mb10">
                                                {idx > 0 &&
                                                <button className="btn btn-sm btn-danger" type="button"
                                                        onClick={() => this.removeSplit(idx)}>Xóa</button>}
                                            </div>
                                      </React.Fragment>
                                    ))}

                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <button className="btn btn-sm btn-primary" type="button" onClick={this.onAddSplit}>Thêm</button>
                                    </div>
                                </>
                            )
                            }
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupJobPackage);
