import React, {Component} from "react";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import InputImg from 'components/Common/InputValue/InputImg';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from 'moment-timezone';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {compare, getBannerType} from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";
import Ckeditor from 'components/Common/InputValue/Ckeditor';
import {publish} from "utils/event";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupBannerPackageRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['gate', 'field_id', 'url', 'title', 'object_type', 'displayed_area', 'start_date', 'end_date'],
            object_error: {},
            name_focus: "",
            gate: null,
            sales_order_items: {},
            gateFieldList: [],
            gateList: this.props.sys.gate.items
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeGate = this._onChangeGate.bind(this);
        // this.onChangeEffect = this._onChangeEffect.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getSalesOrderItem = this._getSalesOrderItem.bind(this);
    }

    _onSave(data, required) {
        const {channel_code} = this.props.branch.currentBranch;
        const {uiAction} = this.props;
        const {sales_order_items} = this.state;

        this.setState({object_error: {}, name_focus: "", loading: true});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({object_error: check.fields, loading: false, name_focus: check.field});
            return;
        }
        this.props.uiAction.showLoading();
        object.sales_order_id = this.props.sales_order.id;
        object.sales_order_items_id = this.props.sales_order_item.id;

      //   // ràng buộc đường dẫn đối với gói banner trung tâm
      //   if(!(object.url.includes(Constant.LINK_INTERNAL[channel_code])) &&
      //       Constant.SERVICE_LINK_INTERNAL[channel_code].includes(String(sales_order_items.service_code))) {
      //       uiAction.putToastError(`Đường dẫn không thuộc link nội bộ của ${Constant.LINK_INTERNAL[channel_code]}`);
      //       uiAction.hideLoading();
      //       return;
      //   }

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
        this.setState({loading: true});
        if (!object.id) {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_BANNER_CREATE, object);
        } else {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_BANNER_EDIT, object);
            this.setState({ loading: false });
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = {...this.state.object};

        // Ràng buộc thay đổi cổng
        if (name === "gate") {
            object.field_id = null;
            object[name] = value;
        } else {
            object[name] = value;
        }

        this.setState({object: object});
    }

    _onChangeGate(value, name) {
        this.onChange(value, name);
        this.fetchFields(value);
    }

    fetchFields(selectedGate = null) {
        if (selectedGate) {
            let gateFieldId = _.filter(this.props.sys?.gateJobField.items, function (o) {
                return o.gate_code === selectedGate
            }).map((_) => (_.job_field_id));
            let gateFieldList = _.filter(this.props.sys?.jobField.items, function (o) {
                return _.includes(gateFieldId, o.id)
            });
            this.setState({gateFieldList: gateFieldList});
        }
    }

    _onChangeEffect(value, name) {
        let object_effect = Object.assign({}, this.state.object_effect);
        if (value) {
            object_effect[name] = value;
        } else {
            delete object_effect[name];
        }
        this.setState({object_effect: object_effect});
    }

    _getDetail(id) {
        let args = {
            id: id,
            sales_order_id: this.props.sales_order.id,
            sales_order_items_id: this.props.sales_order_item.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_REGIS_BANNER_DETAIL, args);
    }

    _getSalesOrderItem() {
        let args = {
            id: this.props.sales_order_item.id,
            sales_order_id: this.props.sales_order.id,
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL, args);
    }

    componentDidMount() {
        let {object} = this.props;
        if (object) {
            this.getDetail(object.id);
        }
        this.getSalesOrderItem();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // return !(JSON.stringify(nextState) === JSON.stringify(this.state));
        return compare(nextState, this.state);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({sales_order_items: response.data});
                if (!this.props.object) {
                    let curr = moment(moment().format("YYYY-MM-DD")).unix();
                    let object = {...this.state.object};
                    object.displayed_area = response.data.service_items_info.displayed_area;
                    object.displayed_method = response.data.service_items_info.displayed_method;
                    // object.pc_image = null;
                    object.mobile_image = null;
                    object.start_date = curr;
                    object.end_date = moment.unix(object.start_date).add(parseInt(response.data.total_day_quantity) - 1, 'days').unix();
                    this.setState({object: object}, () => this.fetchFields(object?.gate));
                }
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_REGIS_BANNER_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_REGIS_BANNER_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {...this.state.object};
                object.id = response.data.id;
                object.start_date = response.data.start_date;
                object.end_date = response.data.end_date;
                object.object_type = response.data.object_type;
                object.displayed_area = response.data.displayed_area;
                object.displayed_method = response.data.displayed_method;
                object.url = response.data.url;
                object.field_id = response.data.field_id;
                object.gate = response.data.gate;
                object.title = response.data.title;
                // object.pc_image = response.data.pc_image;
                object.mobile_image = response.data.mobile_image;
                this.setState({object: object}, () => this.fetchFields(object?.gate));
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_REGIS_BANNER_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_BANNER_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_BANNER_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_BANNER_PACKAGE);
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideSmartMessageBox();
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_BANNER_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_BANNER_EDIT]) {
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_BANNER_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_BANNER_PACKAGE);
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideSmartMessageBox();
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_BANNER_EDIT);
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        let {object, object_error, object_required, name_focus, gateList, gateFieldList} = this.state;
        const type = getBannerType(this.props.sales_order_item?.service_code);
        let day_quantity = utils.convertNumberToWeekDay(moment.unix(object.end_date).diff(moment.unix(object.start_date), 'day') + 1);
        let object_type_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_object_type);
        let area = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_area);
        let serviceInfo = _.find(this.props.sys.service.items, {code: this.props.sales_order_item.service_code});
        // if (_.includes([Constant.BANNER_HANG_DAU, Constant.BANNER_LOGO_NOI_BAT_TRANG_CHU], type)) {
        //     delete object_required.pc_image; //NTD hàng đầu mặc định lấy logo NTD không up hình
        // }
        // check bỏ required field_id
        if (_.includes([Constant.SERVICE_PAGE_TYPE_FIELD_PAGE, Constant.SERVICE_PAGE_TYPE_GATE_PAGE], parseInt(serviceInfo.page_type))) {
            object_required.push('gate');
            if (_.includes([Constant.SERVICE_PAGE_TYPE_FIELD_PAGE], parseInt(serviceInfo.page_type))) {
                object_required.push('field_id');
            } else {
                object_required = object_required.filter(c => c !== 'field_id');
            }
        } else {
            object_required = object_required.filter(c => (c !== 'gate' && c !== 'field_id'));
        }
        // if (!_.includes([Constant.BANNER_HANG_DAU, Constant.BANNER_LOGO_NOI_BAT_TRANG_CHU], type)) {
        //     object_required.push('pc_image');
        // }
        const {channel_code} = this.props.branch.currentBranch;
        // #CONFIG_BRANCH
        if (_.includes([Constant.BANNER_PHAI_TRANG_NGANH], type) && channel_code === Constant.CHANNEL_CODE_TVN) {
            object["gate"] = Constant.GATE_DEFAULT[channel_code];
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
                                <span>{serviceInfo.name}</span>
                            </div>
                            {_.includes([Constant.SERVICE_PAGE_TYPE_FIELD_PAGE, Constant.SERVICE_PAGE_TYPE_GATE_PAGE], parseInt(serviceInfo.page_type)) && (
                                <div className="col-sm-12 col-xs-12 padding0">
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Dropbox name="gate"
                                                 label="Cổng"
                                                 data={gateList}
                                                 required={object_required.includes('gate')}
                                                 error={object_error.gate}
                                                 value={object.gate}
                                                 key_title="full_name"
                                                 key_value="code"
                                                 nameFocus={name_focus}
                                                 onChange={this.onChangeGate}
                                                 noDelete
                                        />
                                    </div>
                                    {_.includes([Constant.SERVICE_PAGE_TYPE_FIELD_PAGE], parseInt(serviceInfo.page_type)) && (
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Dropbox name="field_id"
                                                     label="Ngành"
                                                     data={gateFieldList}
                                                     required={object_required.includes('field_id')}
                                                     error={object_error.field_id}
                                                     value={object.field_id}
                                                     key_title="name"
                                                     key_value="id"
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                                     noDelete
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 name="url" label="URL" required={object_required.includes('url')}
                                            value={object.url} error={object_error.url} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 name="title" label="Tên viết tắt công ty"
                                            required={object_required.includes('title')}
                                            value={object.title} error={object_error.title} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="object_type" label="Đối tượng" data={object_type_list}
                                             required={object_required.includes('object_type')}
                                             error={object_error.object_type} value={object.object_type}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="displayed_area" label="Khu vực hiển thị" data={area}
                                             required={object_required.includes('displayed_area')} readOnly
                                             value={object.displayed_area}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 name="booking_code" label="Mã đặt chổ"
                                            required={object_required.includes('booking_code')}
                                            error={object_error.booking_code} value={object.booking_code}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu" readOnly
                                                    required={object_required.includes('start_date')}
                                                    value={object.start_date} nameFocus={name_focus}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <DateTimePicker name="end_date" label="Ngày kết thúc" readOnly
                                                    required={object_required.includes('end_date')}
                                                    value={object.end_date} nameFocus={name_focus}
                                    />
                                    {day_quantity && (
                                        <div className="end-date"><span>{day_quantity}</span></div>
                                    )}
                                </div>
                            </div>
                            {_.includes([Constant.BANNER_COVER_TRANG_CHU], type) && (
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Ckeditor name="title_show_with_logo"
                                              label="Text hiển thị cùng logo"
                                              height={100}
                                              value={object?.title_show_with_logo}
                                              required={object_required.includes('title_show_with_logo')}
                                              toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['Link'], ['Source'], ['TextColor', 'BGColor']]}
                                              error={object_error.title_show_with_logo}
                                              onChange={this.onChange}
                                    />
                                </div>
                            )}
                            {/* {!_.includes([Constant.BANNER_HANG_DAU, Constant.BANNER_LOGO_NOI_BAT_TRANG_CHU], type) && (
                                <div className="col-sm-12 col-xs-12 mt15">
                                    <InputImg name="pc_image"
                                              label="Ảnh banner PC"
                                              required={object_required.includes('pc_image')}
                                              nameFocus={name_focus}
                                              folder="banner" width={300} height={250} maxSize={2}
                                              error={object_error.pc_image} value={object.pc_image}
                                              onChange={this.onChange}
                                              validate={{
                                                  mustWidth: _.get(serviceInfo, 'rules.width', null),
                                                  mustHeight: _.get(serviceInfo, 'rules.height', null),
                                              }}
                                              style={{
                                                  height: _.get(serviceInfo, 'rules.height', null),
                                                  width: _.get(serviceInfo, 'rules.width', null),
                                              }}
                                    />
                                </div>
                            )} */}
                            {/*Chi có TVN mới có banner trung tâm moblie*/}
                            {_.includes([Constant.BANNER_TRUNG_TAM], type) && (
                                <div className="col-sm-12 col-xs-12 mt15">
                                    <InputImg name="mobile_image"
                                              label="Ảnh banner Mobile"
                                              required={false}
                                              nameFocus={name_focus}
                                              folder="banner"
                                              width={300}
                                              height={250}
                                              maxSize={2}
                                              error={object_error.mobile_image} value={object.mobile_image}
                                              onChange={this.onChange}
                                              validate={{
                                                  mustWidth: 300,
                                                  mustHeight: 250,
                                              }}
                                              style={{
                                                  height: 250,
                                                  width: "auto",
                                              }}
                                    />
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupBannerPackageRegistration);
