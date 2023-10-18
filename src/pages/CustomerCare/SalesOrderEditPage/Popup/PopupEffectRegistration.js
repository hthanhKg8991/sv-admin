import React, { Component } from "react";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import DateTimeRangePicker from 'components/Common/InputValue/DateTimeRangePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import config from 'config';
import moment from 'moment-timezone';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import { getConfigForm } from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import { publish } from "utils/event";
import _ from "lodash";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupEffectRegistration extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            object: {},
            object_required: ['job_id', 'service_code', 'start_date', 'end_date'],
            object_error: {},
            object_effect: {},
            array_effect: [],
            total_effect: 0,
            name_focus: "",
            listJobRunning: [],
            listJob: [],
            sales_order_items: {},
            configForm: getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Popup"),
            object_create: {},
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeEffect = this._onChangeEffect.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getListJob = this._getListJob.bind(this);
        this.getSalesOrderItem = this._getSalesOrderItem.bind(this);

        this.getListJobRunning = this._getListJobRunning.bind(this);
    }

    async _onSave(data, required) {
        const { sales_order_items } = this.state;
        this.setState({ object_error: {} });
        this.setState({ name_focus: "" });

        let object = Object.assign({}, data);
        let object_effect = Object.assign({}, this.state.object_effect);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({ name_focus: check.field });
            this.setState({ object_error: check.fields });
            return;
        }
        let object_effect_length = Object.keys(object_effect).length;
        if (object_effect_length !== this.state.total_effect) {
            this.props.uiAction.putToastError("Số hiệu ứng cho phép chọn là: " + this.state.total_effect);
            return;
        }
        object.sales_order_id = this.props.sales_order.id;
        object.sales_order_items_id = this.props.sales_order_item.id;
        if (object_effect_length) {
            object.effects_info = object_effect;
        }

        // xác nhận ràng buộc TG đăng ký
        let confirm = true;
        if (Number(sales_order_items?.sales_order_expired_at) > 0 &&
            Number(sales_order_items?.sales_order_expired_at) <= Number(object?.end_date)) {
            confirm = window.confirm(Constant.MSG_NOTIFY_SALE_ORDER);
        }
        if (!confirm) {
            this.props.uiAction.deletePopup();
            this.props.uiAction.hideLoading();
            return;
        }

        /**
         * Kiểm tra hết hạn tin đối với gói hiệu ứng (channel MW)
         */
        this.setState({ loading: true });
        this._registrationEffect(object);

    }

    _registrationEffect(object) {
        this.setState({object_create: object});
        let list_job = this.state.listJob.filter(c => parseInt(c.value) === parseInt(object.job_id));
        if (list_job.length) {
            let job = list_job[0].job;
            if (parseInt(job.is_search_allowed) === parseInt(Constant.IS_SEARCH_ALLOWED_NO)) {
                this.props.uiAction.SmartMessageBox({
                    title: <span><i className='fa fa-warning' style={{ color: "yellow" }} /> Cảnh Báo !!!</span>,
                    content: "Tin tuyển dụng đang bị ẩn hiện thị. Bạn có muốn đăng ký gói phí cho tin?",
                    buttons: ['No', 'Yes']
                }, (ButtonPressed) => {
                    if (ButtonPressed === "Yes") {
                        this.props.uiAction.showLoading();
                        if (!object.id) {
                            this.props.apiAction.requestApi(apiFn.fnPost,
                                config.apiSalesOrderDomain,
                                ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_CREATE,
                                object, 0, false);
                        } else {
                            this.props.apiAction.requestApi(apiFn.fnPost,
                                config.apiSalesOrderDomain,
                                ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_EDIT,
                                object);
                        }
                    }
                });
            } else {
                this.props.uiAction.showLoading();
                if (!object.id) {
                    this.props.apiAction.requestApi(apiFn.fnPost,
                        config.apiSalesOrderDomain,
                        ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_CREATE,
                        object, 0, false);
                } else {
                    this.props.apiAction.requestApi(apiFn.fnPost,
                        config.apiSalesOrderDomain,
                        ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_EDIT,
                        object);
                }
            }
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = { ...this.state.object };
        object[name] = value;
        /**
        * Cập nhật số tuần khi chọn sub item
        */
        if (String(name) === "sales_order_items_sub_id") {
            if (value) {
                const { sales_order_items_subs } = this.state.sales_order_items;
                const dayQuantitySub = sales_order_items_subs?.find(sub => Number(sub.id) === Number(value))?.remaining_day;
                object.end_date = moment.unix(object.start_date).add(parseInt(dayQuantitySub) - 1, 'days').unix();
            } else {
                const { end_date_item } = this.state;
                object.end_date = end_date_item;
            }
        }
        this.setState({ object: object });
    }

    _onChangeEffect(value, name) {
        let object_effect = Object.assign({}, this.state.object_effect);
        if (value) {
            object_effect[name] = value;
        } else {
            delete object_effect[name];
        }
        this.setState({ object_effect: object_effect });
    }

    _getDetail(id) {
        let args = {
            id: id,
            sales_order_id: this.props.sales_order.id,
            sales_order_items_id: this.props.sales_order_item.id
        };
        this.setState({ loading: true });
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiSalesOrderDomain,
            ConstantURL.API_URL_GET_REGIS_EFFECT_PACKAGE_DETAIL,
            args);
    }

    _getListJobRunning() {
        const { branch } = this.props;
        const { channel_code } = branch.currentBranch;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        let args = {
            employer_id: this.props.sales_order.employer_id,
            // MW lấy tin phí, các site lại lấy tin cơ bản
            service_type: isMW ? Constant.SERVICE_TYPE_JOB_BOX : Constant.SERVICE_TYPE_JOB_BASIC,
            page: Constant.PAGE_DEFAULT,
            per_page: Constant.UN_LIMIT_PER_PAGE,
        };
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiSalesOrderDomain,
            ConstantURL.API_URL_GET_SALES_ORDER_RUNNING_JOB_BOX_LIST,
            args);
    }

    _getListJob() {
        let { listJobRunning } = this.state;
        let args = {
            employer_id: this.props.sales_order.employer_id,
            premium_type: Constant.JOB_PREMIUM_VIP,
            job_status: Constant.STATUS_ACTIVED,
            execute: true
        };
        let listJobIds = [];
        listJobRunning.forEach((item) => {
            listJobIds.push(item?.job_id)
        });

        if (listJobIds.length > 0) {
            args.job_ids = listJobIds;
            this.props.apiAction.requestApi(apiFn.fnGet,
                config.apiEmployerDomain,
                ConstantURL.API_URL_GET_LIST_JOB,
                args);
        } else {
            this.props.uiAction.putToastWarning("Không tồn tại tin thuộc box đăng ký.");
        }
    }

    _getSalesOrderItem() {
        let args = {
            id: this.props.sales_order_item.id,
            sales_order_id: this.props.sales_order.id,
        };
        this.setState({ loading: true });
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiSalesOrderDomain,
            ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL,
            args);
    }

    componentWillMount() {
        let { object } = this.props;
        if (object) {
            this.getDetail(object.id);
        } else {
            this.getSalesOrderItem();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_JOB]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_JOB];
            if (response.code === Constant.CODE_SUCCESS) {
                let listJob = [];
                response.data.forEach((item) => {
                    listJob.push({
                        value: item.id,
                        title: item.id + " - " + item.title,
                        job: item
                    })
                });
                this.setState({ listJob: listJob });
            }
            this.setState({ loading: false });
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_JOB);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                const { isEdit = false } = this.props;
                const { object_required } = this.state;
                this.setState({ sales_order_items: response.data });
                let curr = moment(moment().format("YYYY-MM-DD")).unix();
                let array_effect = [];
                let object_effect = {};
                let total_effect = parseInt(response.data.service_items_info.total_effect);
                this.setState({ total_effect: total_effect });
                let detail_part = response.data.service_items_info.detail_part;
                let total_day_quantity = parseInt(response.data.total_day_quantity);
                // let start_date = response.data.start_date < curr ? curr : response.data.start_date;
                if (Array.isArray(detail_part)) {
                    detail_part.forEach((item) => {
                        array_effect.push({
                            effect_code: item.trim(),
                            // start_date: start_date,
                            // end_date: moment.unix(start_date).add(total_day_quantity - 1, 'days').unix(),
                            start_date: curr,
                            end_date: moment.unix(curr).add(total_day_quantity - 1, 'days').unix(),
                        });
                        object_effect[item.trim()] = {
                            // start_date: start_date,
                            // end_date: moment.unix(start_date).add(total_day_quantity - 1, 'days').unix(),
                            start_date: curr,
                            end_date: moment.unix(curr).add(total_day_quantity - 1, 'days').unix(),
                        };
                    });
                }
                this.setState({ array_effect: array_effect });
                this.getListJobRunning();
                if (!this.props.object) {
                    let object = {};
                    object.service_code = response.data.service_items_info.parent_service_code;
                    object.displayed_area = response.data.service_items_info.displayed_area;
                    // object.start_date = start_date;
                    object.start_date = curr;
                    object.end_date = moment.unix(object.start_date)
                        .add(parseInt(response.data.total_day_quantity) - 1, 'days')
                        .unix();
                    this.setState({ object: object });
                    this.setState({ object_effect: array_effect.length === total_effect ? object_effect : [] });

                    /* Nếu là create thì required field chọn subItem */
                    if (!isEdit) {
                        this.setState({ object_required: [...object_required, 'sales_order_items_sub_id'] });
                    }
                }
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_REGIS_EFFECT_PACKAGE_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_REGIS_EFFECT_PACKAGE_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {};
                object.id = response.data.id;
                object.service_code = response.data.jobbox_service_code;
                object.job_id = response.data.job_id;
                object.start_date = response.data.start_date;
                object.end_date = response.data.end_date;
                object.displayed_area = response.data.displayed_area;
                object.job_occupation_id = this.props.object.job_occupation_id;
                this.setState({ object: object });
                if (response.data.detail_part) {
                    let object_effect = {};
                    response.data.detail_part.forEach((item) => {
                        object_effect[item] = {
                            start_date: response.data.start_date,
                            end_date: response.data.end_date,
                        }
                    });
                    this.setState({ object_effect: object_effect });
                }
                this.getSalesOrderItem();
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_REGIS_EFFECT_PACKAGE_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_EFFECT_PACKAGE);
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_CREATE);
            } else if (this.state.configForm.includes("effect_check_job_box") && response.code === Constant.CODE_RES_CONFIRM) {
                this.props.uiAction.SmartMessageBox({
                    title: response.msg,
                    content: "",
                    buttons: ['Hủy', 'Xác nhận']
                }, async (ButtonPressed) => {
                    if (ButtonPressed === "Xác nhận") {
                        await this._registrationEffect({...this.state.object_create, allowed_continue: true});
                    }
                    if (ButtonPressed === "Hủy") {
                        this.props.uiAction.hideSmartMessageBox();
                        this.props.uiAction.hideLoading();
                        this.props.uiAction.deletePopup();
                        this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_CREATE);
                    }
                });
            } else {
                this.props.uiAction.putToastError(response.msg);
                this.setState({ object_error: Object.assign({}, response.data), loading: false });
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_CREATE);
            }

        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_EDIT]) {
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_EFFECT_PACKAGE);
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideSmartMessageBox();
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_EFFECT_PACKAGE_EDIT);
        }

        // list job running
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_RUNNING_JOB_BOX_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_RUNNING_JOB_BOX_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ listJobRunning: response.data.items }, () => {
                    this.getListJob();
                });
            }
            this.setState({ loading: false });
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_RUNNING_JOB_BOX_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        const { sys, branch, isEdit = false } = this.props;
        let { object, object_error, object_required, name_focus, listJob, array_effect, object_effect, sales_order_items, listJobRunning } = this.state;
        let day_quantity = utils.convertNumberToWeekDay(moment.unix(object.end_date).diff(moment.unix(object.start_date), 'day') + 1);
        let effect_list = this.props.sys.effect.items;
        let effect_list_object = utils.convertArrayToObject(effect_list, 'code');
        let box_code_list = [
            ...sys.service.items,
            ...sys.effect.items,
        ];
        let area = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_area)?.filter(item => item?.value !== 3);
        let list_job = listJob.filter(c => parseInt(c.value) === parseInt(object.job_id));
        let jobOccupation = [];
        let field_list = [];
        if (list_job.length) {
            let job = list_job[0].job;
            field_list = job.occupation_ids_main || [];
            jobOccupation = this.props.sys.occupations.items.filter(c => field_list.includes(parseInt(c.id)))
        }

        // #CONFIG_BRANCH
        const { channel_code } = branch.currentBranch;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        // Đối với MW, tin lấy theo gói dịch vụ
        if (isMW) {
            if (!object.job_id) {
                box_code_list = [];
            } else {
                const serviceCodeOfJob = listJobRunning.filter(s => s.job_id === object.job_id).map(s => s.service_code);
                box_code_list = sys.service.items.filter(s =>
                    s.service_type === Constant.SERVICE_TYPE_JOB_BOX &&
                    s.object_type === Constant.OBJECT_TYPE_JOB &&
                    serviceCodeOfJob.includes(s.code)
                );
            }
        }

        let subItemsOption = [];
        if (Array.isArray(sales_order_items?.sales_order_items_subs)) {
            subItemsOption = sales_order_items.sales_order_items_subs
                .filter(sub => [Constant.STATUS_SALES_ORDER_ITEM_NEW].includes(Number(sub.status)))
                .map(sub => {
                    return {
                        title: `ID ${sub?.id} - ${sub?.remaining_day} ngày`,
                        value: sub.id
                    }
                });
        }

        
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Hiệu ứng</span>
                            </div>
                            {
                                !isEdit && (
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="sales_order_items_sub_id"
                                            label="Chọn SubItem"
                                            data={subItemsOption}
                                            required={object_required.includes('sales_order_items_sub_id')}
                                            error={object_error.sales_order_items_sub_id}
                                            value={object.sales_order_items_sub_id}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}

                                        />
                                    </div>
                                )
                            }
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="job_id" label="Tin tuyển dụng" data={listJob}
                                    required={object_required.includes('job_id')}
                                    error={object_error.job_id} value={object.job_id}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}
                                />
                            </div>
                            {jobOccupation.length > 0 && [Constant.VL24H_UU_TIEN_NGANH, Constant.TVN_UU_TIEN_NGANH, Constant.VTN_UU_TIEN_NGANH].includes(
                                object.service_code) && (
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="job_occupation_id" label="Ngành nghề"
                                            data={jobOccupation}
                                            required={object_required.includes('job_occupation_id')}
                                            key_value="id" key_title="name"
                                            error={object_error.job_occupation_id} value={object?.job_occupation_id} nameFocus={name_focus}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="service_code" label="Gói dịch vụ"
                                        data={box_code_list} readOnly={!isMW}
                                        key_value="code" key_title="name"
                                        value={object.service_code}
                                        onChange={this.onChange}
                                    />
                                </div>
                                {object.displayed_area !== 3  && object.displayed_area !== null && object.displayed_area !== null && <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="displayed_area" label="Khu vực hiển thị"
                                        data={area} 
                                        value={object.displayed_area}
                                        onChange={this.onChange}
                                    />
                                </div>}
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu" readOnly
                                        required={object_required.includes('start_date')}
                                        value={object.start_date} nameFocus={name_focus}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="end_date" label="Ngày kết thúc" readOnly
                                        required={object_required.includes('end_date')}
                                        value={object.end_date} nameFocus={name_focus}
                                    />
                                    {day_quantity && (
                                        <div className="end-date"><span>{day_quantity}</span></div>
                                    )}
                                </div>
                            </div>
                            {array_effect.length > 0 && (
                                <React.Fragment>
                                    <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                        <span>Hiệu ứng</span>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="effect_service_code" label="Gói hiệu ứng"
                                            data={effect_list} readOnly
                                            key_value="code" key_title="name"
                                            value={sales_order_items.service_code}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </React.Fragment>
                            )}
                            {array_effect.map((item, key) => {
                                let checked = !!object_effect[item.effect_code];
                                return (
                                    <div className="col-sm-4 col-xs-6 mb10 smart-form" key={key}>
                                        <label className="checkbox mb15">
                                            <input type="checkbox" name="checkbox" checked={checked}
                                                onChange={() => {
                                                    let value = checked ? null : {
                                                        start_date: item.start_date,
                                                        end_date: item.end_date
                                                    };
                                                    this.onChangeEffect(value, item.effect_code);
                                                }} />
                                            <i />{effect_list_object[item.effect_code] ? effect_list_object[item.effect_code].name : item.effect_code}
                                        </label>
                                        {checked && (
                                            <DateTimeRangePicker
                                                name={item.effect_code + "_start_end_date"}
                                                label="Thời gian hiệu lực" readOnly
                                                value={[item.start_date, item.end_date]}
                                                onChange={() => {
                                                }} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit"
                            className="el-button el-button-success el-button-small">
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupEffectRegistration);
