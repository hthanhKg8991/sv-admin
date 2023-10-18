import React, {Component} from "react";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from 'moment-timezone';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";
import DropboxMulti from "components/Common/InputValue/DropboxMulti";
import {reserveRegistrationJobOpen} from "api/saleOrder";
import {publish} from "utils/event";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupJobPackageReserve extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Popup");
        this.state = {
            object: props.sales_order_item,
            object_required: ['job_id', 'service_code', 'displayed_area', 'start_date', 'end_date', 'object_type', 'sales_order_items_sub_id'],
            object_error: {},
            name_focus: "",
            listJob: [],
            configForm: configForm,
            channelCodeCurrent: channelCodeCurrent
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeGate = this._onChangeGate.bind(this);
        this.getListJob = this._getListJob.bind(this);
    }

    async _onSave(data, required) {
        const {uiAction} = this.props;
        const {channelCodeCurrent} = this.state;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, {...data, gate : `${channelCodeCurrent}.default` });
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.setState({loading: true});
        const res = await reserveRegistrationJobOpen({
            id: object?.sales_order_items_sub_id,
            job_id: object.job_id,
            job_field_id: object?.job_field_id
        });
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            uiAction.deletePopup();
            publish(".refresh", {}, Constant.IDKEY_JOB_PACKAGE);
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        /**
         * Cập nhật thông tin khi chọn sub item
         */
        if (String(name) === "sales_order_items_sub_id") {
            if (value) {
                const {sub_item} = this.props;
                const [registrationNew] = sub_item?.registration_info;
                delete registrationNew?.job_id;
                this._getListJob(registrationNew.gate_code);
                object = {...object, ...registrationNew};
                object.start_date = moment().unix();
                object.end_date = moment.unix(object.start_date).add(parseInt(sub_item?.remaining_day) - 1, 'days').unix();
            } else {
                const {sales_order_item} = this.props;
                object = sales_order_item;
                object.end_date = moment.unix(object.start_date).add(parseInt(sales_order_item?.remaining_day), 'days').unix();
                this._getListJob(null);
            }
        }
        this.setState({object: object});
    }

    _onChangeGate(value, name) {
        this.onChange(value, name);
        this.getListJob(value);
    }

    _getListJob() {
        const args = {
            employer_id: this.props.sales_order.employer_id,
            job_status: Constant.STATUS_ACTIVED,
            execute: true,
            // gate_code: gate,
            'resume_apply_expired[from]': moment().add(2, 'days').unix()
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, args);
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
                this.setState({listJob: listJob});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_JOB);
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
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        const {sub_item} = this.props;
        let {object, object_error, object_required, name_focus, listJob, configForm} = this.state;
        let day_quantity = moment.unix(object.end_date).diff(moment.unix(object.start_date), 'day') + 1;
        let box_code_list = this.props.sys.service.items;
        let area = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_area);
        let object_type_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_object_type);

        let jobField = [];
        let type_field = false;
        box_code_list.forEach((item) => {
            if (item.code === object.service_code && parseInt(item.page_type) === Constant.SERVICE_PAGE_TYPE_FIELD) {
                type_field = true;
                object_required.push('job_field_id');
                let list_job = listJob.filter(c => parseInt(c.value) === parseInt(object.job_id));
                let field_list = [];
                if (list_job.length) {
                    let job = list_job[0].job;
                    field_list = job.field_ids_sub ? job.field_ids_sub : [];
                    field_list.push(job.field_ids_main);
                    jobField = this.props.sys.jobField.items.filter(c => field_list.includes(parseInt(c.id)))
                }
            }
        });

        /**
         * Cấu hình cho phép chọn nhiều ngành
         */
        const isFieldMulti = configForm.includes("is_field_multi");

        /**
         * Chọn subItem khi mở bảo lưu
         */
        const subItemsOption = [
            {
                title: `ID ${sub_item?.id} - ${sub_item?.remaining_day} ngày`,
                value: sub_item.id
            }
        ];

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Tin tính phí</span>
                            </div>
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
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="job_id" label="Tin tuyển dụng" data={listJob}
                                         required={object_required.includes('job_id')}
                                         error={object_error.job_id} value={object.job_id} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            {type_field && (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    {isFieldMulti ? (
                                        <DropboxMulti name="job_field_id" label="Ngành nghề" data={jobField}
                                                      required={object_required.includes('job_field_id')}
                                                      key_value="id" key_title="name"
                                                      error={object_error.job_field_id} value={object.job_field_id}
                                                      nameFocus={name_focus}
                                                      onChange={this.onChange}
                                        />
                                    ) : (
                                        <Dropbox name="job_field_id" label="Ngành nghề" data={jobField}
                                                 required={object_required.includes('job_field_id')}
                                                 key_value="id" key_title="name"
                                                 error={object_error.job_field_id} value={object.job_field_id}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChange}
                                        />
                                    )}
                                </div>
                            )}
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="service_code" label="Gói dịch vụ" data={box_code_list}
                                             required={object_required.includes('service_code')} readOnly
                                             key_value="code" key_title="name"
                                             value={object.service_code}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="displayed_area" label="Khu vực hiển thị" data={area}
                                             required={object_required.includes('displayed_area')} readOnly
                                             value={object.displayed_area}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="object_type" label="Đối tượng" readOnly
                                             data={object_type_list}
                                             required={object_required.includes('object_type')}
                                             error={object_error.object_type} value={object.object_type}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 name="booking_code" label="Mã đặt chổ" readOnly
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
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="end_date" label="Ngày kết thúc" readOnly
                                                    required={object_required.includes('end_date')}
                                                    value={object.end_date} nameFocus={name_focus}
                                    />
                                    {day_quantity >= 0 && (
                                        <div className="end-date"><span>{day_quantity} ngày</span></div>
                                    )}
                                </div>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupJobPackageReserve);
