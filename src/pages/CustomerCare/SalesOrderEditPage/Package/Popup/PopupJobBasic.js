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
import moment from 'moment-timezone';
import _ from 'lodash';
import {publish} from "utils/event";
import {getDetailSKU} from "api/system";
import Checkbox from '@material-ui/core/Checkbox';

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupJobBasic extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.PackageJobBasic");

        const isGift = props.type_campaign === Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift;
        const weekQuantity = (isGift || configForm.includes("empty_week_quantity")) ? null : Constant.JOB_BASIC_WEEK_QUANTITY_DEFAULT;
        this.state = {
            checked: false,
            object: {
                week_quantity: weekQuantity,
            },
            object_required: ['service_code', 'job_quantity', 'start_date', 'week_quantity', 'sku_code_service'],
            object_error: {},
            name_focus: "",
            configForm: configForm,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeService = this._onChangeService.bind(this);
        this.onChangeEffect = this._onChangeEffect.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }

    _onSave(data) {
        this.setState({object_error: {}, loading: true, name_focus: ""});
        const {uiAction, is_duplicate = false} = this.props;
        const channel_code = this.props.branch.currentBranch.channel_code;

        let sales_order = this.props.sales_order;
        let object = Object.assign({}, data);
        let object_required = this.state.object_required;
        if (object.effect_code) {
            object_required = object_required.concat(['effect_start_date', 'effect_week_quantity']);
        }

        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field,loading: false,object_error: check.fields});

            if (check.fields.sku_code_service) {
                uiAction.putToastError("Mã SKU tin là thông tin bắt buộc")
            }

            if (check.fields.sku_code_effect) {
                uiAction.putToastError("Mã SKU hiệu ứng là thông tin bắt buộc")
            }

            return;
        }
        let error = {};
        let ordered_on = moment(moment.unix(sales_order.ordered_on).format("YYYY-MM-DD")).unix();

        /**
         * Validate dữ liệu form
         */
        if (parseInt(object.week_quantity) <= 0) {
            error['week_quantity'] = ":attr_name phải lớn hơn 0.";
        }
        if (parseInt(object.week_quantity) > Constant.WEEK_QUANTITY_MAX_JOB_BASIC[channel_code]) {
            error['week_quantity'] = `:attr_name quá gới hạn (${Constant.WEEK_QUANTITY_MAX_JOB_BASIC[channel_code]} tuần).`;
        }
        if (parseInt(object.job_quantity) <= 0) {
            error['job_quantity'] = ":attr_name không hợp lệ.";
        }
        if (moment(moment.unix(object.start_date).format("YYYY-MM-DD")).unix() < ordered_on) {
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

        if (!(Object.entries(error).length === 0)) {
            this.setState({object_error: error,loading: false});
            return;
        }
        if(this.props?.items_group_id){
            object.items_group_id = this.props.items_group_id;
        }
        this.props.uiAction.showLoading();
        object.sales_order_id = this.props.sales_order.id;
        object.type_campaign = this.props.type_campaign;

        // Nếu là sao chép thì xóa id của item
        if(is_duplicate) {
            delete object.id;
        }

        if (!object.id) {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_JOB_BASIC_CREATE, object);
        } else {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_JOB_BASIC_EDIT, object);
            this.setState({loading: false});
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        if (name === 'effect_code' && !value) {
            delete object.effect_code;
            delete object.effect_start_date;
            delete object.effect_week_quantity;
            delete object.effect_day_quantity;
        } else {
            object[name] = value;
        }
        this.setState({object: object});
    }

    async _onChangeService(value, name) {
        const {object} = this.state;
        if (value) {
            const res = await getDetailSKU({service_code: value});
            if (res) {
                this.setState({object: {...object, sku_code_service: res?.sku_code}});
            }
        } else {
            object.sku_code_service = null;
            this.setState({object: object});
        }
        this.onChange(value, name);
    }

    async _onChangeEffect(value, name) {
        const {object, object_required} = this.state;
        if (value) {
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

    _getDetail(id) {
        let args = {
            id: id,
            sales_order_id: this.props.sales_order.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL, args);
    }

    componentDidMount() {
        const {object} = this.props;
        const box_code_list = this.props.sys.service.items.filter(c =>
            c.service_type === Constant.SERVICE_TYPE_JOB_BASIC
        );
        if (object) {
            this.getDetail(object.id);
        } else {
            // Mặc định trigger onChange gói tin cơ bản
            const [serviceInit] = box_code_list;
            this.onChangeService(serviceInit["code"], "service_code");
        }
    }

    componentWillReceiveProps(newProps) {
        const keyRefresh = this.props?.items_group_id ? `JobBasicProductGroupPackage${this.props?.items_group_id}`:"JobBasicPackage";
        if (newProps.api[ConstantURL.API_URL_POST_JOB_BASIC_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_JOB_BASIC_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList(keyRefresh);
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_JOB_BASIC_CREATE);
            this.setState({ loading: false });
        }
        if (newProps.api[ConstantURL.API_URL_POST_JOB_BASIC_EDIT]) {
            let response = newProps.api[ConstantURL.API_URL_POST_JOB_BASIC_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList(keyRefresh);
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_JOB_BASIC_EDIT);
            this.setState({ loading: false });
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {};
                object.id = response.data.id;
                object.service_code = response.data.service_code;
                object.job_quantity = response.data.service_items_info.quantity;
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
                if(object.promotion_rate || object.discount_rate) {
                    this.setState({checked: true});
                }
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        const {type_campaign, sys} = this.props;
        const listService = sys?.service?.items;
        const detailService = listService?.find(_=>_?.service_type === "jobbox_basic");
        let {object, object_error, object_required, name_focus, configForm} = this.state;
        let channel_code = this.props.branch.currentBranch.channel_code;
        let box_code_list = this.props.sys.service.items.filter(c =>
            c.channel_code === channel_code &&
            c.service_type === Constant.SERVICE_TYPE_JOB_BASIC
        );
        let effect_list = this.props.sys.effect.items.filter(c =>
            c.channel_code === channel_code &&
            (c.code.indexOf(Constant.EFFECT_TYPE_REFRESH_HOUR) >= 0 || c.code.indexOf(Constant.EFFECT_TYPE_REFRESH_DAY) >= 0)
        );
        let end_date = utils.calcDate(object.start_date, object.week_quantity, object.day_quantity, "DD/MM/YYYY");
        let end_date_effect = utils.calcDate(object.effect_start_date, object.effect_week_quantity, object.effect_day_quantity, "DD/MM/YYYY");

        object.service_code = _.head(box_code_list)['code'];
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        /**
         * Cho phép chỉnh sửa week_quantity đối với gói tặng
         **/
        const isGift = type_campaign === Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift;
        const isReadyOnlyWQ = !((isGift && configForm.includes("edit_week_quantity")) || configForm.includes("edit_week_quantity_no_gift"));
        //thêm chiết khấu
        if (this.state.checked) {
            object_required.push("promotion_rate");
            object_required.push("discount_rate");
        }
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                {
                    this.state.loading&&<div className="dialog-popup-body" style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: "0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "99999"
                    }}>
                        <div className="form-container">
                            <div className="popupContainer text-center">
                                <LoadingSmall />
                            </div>
                        </div>
                    </div>
                }
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>{detailService?.display_name_frontend || detailService?.display_name_contract}</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="service_code"
                                         label="Gói dịch vụ"
                                         data={box_code_list}
                                         required={object_required.includes('service_code')}
                                         key_value="code"
                                         key_title="name"
                                         error={object_error.service_code}
                                         value={object.service_code}
                                         nameFocus={name_focus}
                                         onChange={this.onChangeService}
                                         readOnly
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="job_quantity" label="Số tin" isNumber
                                        required={object_required.includes('job_quantity')}
                                        error={object_error.job_quantity} value={object.job_quantity}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu"
                                                    required={object_required.includes('start_date')} minDate={moment()}
                                                    error={object_error.start_date} value={object.start_date}
                                                    nameFocus={name_focus}
                                                    onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="week_quantity" label="TG DV (tuần)" isNumber
                                            required={object_required.includes('week_quantity')}
                                            error={object_error.week_quantity}
                                            value={object.week_quantity}
                                            nameFocus={name_focus}
                                            readOnly={isReadyOnlyWQ}
                                            onChange={this.onChange}
                                    />
                                    {end_date && (
                                        <div className="end-date"><span>ngày kết thúc: {end_date}</span></div>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="sku_code_service" label="Mã SKU"
                                            value={object.sku_code_service}
                                            error={object_error.sku_code_service}
                                            required={object_required.includes('sku_code_service')} readOnly/>
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Checkbox
                                        checked={this.state.checked}
                                        color="primary"
                                        classes={{root: 'custom-checkbox-root'}}
                                        inputProps={{'aria-label': 'secondary checkbox'}}
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
                                                error={object_error.discount_rate} value={object.discount_rate}
                                                nameFocus={name_focus}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Input2 type="text" name="promotion_rate" label="Khuyến mãi (%)" isNumber
                                                suffix=" %"
                                                error={object_error.promotion_rate} value={object.promotion_rate}
                                                nameFocus={name_focus}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                            )}
                            {!isMW && (
                                <>
                                    <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                        <span>Hiệu ứng</span>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="effect_code" label="Hiệu ứng" data={effect_list}
                                                 required={object_required.includes('effect_code')}
                                                 key_value="code" key_title="name"
                                                 error={object_error.effect_code} value={object.effect_code}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChangeEffect}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <DateTimePicker name="effect_start_date" label="Ngày bắt đầu"
                                                            required={!!object.effect_code} minDate={moment()}
                                                            error={object_error.effect_start_date}
                                                            value={object.effect_start_date} nameFocus={name_focus}
                                                            onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Input2 type="text" name="effect_week_quantity" label="TG DV (tuần)"
                                                    isNumber required={!!object.effect_code}
                                                    error={object_error.effect_week_quantity}
                                                    value={object.effect_week_quantity} nameFocus={name_focus}
                                                    onChange={this.onChange}
                                            />
                                            {end_date_effect && (
                                                <div className="end-date"><span>ngày kết thúc: {end_date_effect}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Input2 type="text" name="sku_code_effect" label="Mã SKU"
                                                    value={object.sku_code_effect}
                                                    error={object_error.sku_code_effect}
                                                    required={object_required.includes('sku_code_effect')} readOnly/>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupJobBasic);
