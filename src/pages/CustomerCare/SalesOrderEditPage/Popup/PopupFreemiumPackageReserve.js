import React, {Component} from "react";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import {publish} from "utils/event";
import {reserveRegistrationJobOpen} from "api/saleOrder";

class PopupFreemiumPackageReserve extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: this.props.branch.currentBranch.channel_code  === Constant.CHANNEL_CODE_MW ? ['sales_order_items_sub_id', 'job_id', 'start_date', 'end_date'] : ['sales_order_items_sub_id', 'start_date', 'end_date'],
            object_error: {},
            name_focus: "",
            listJob: [],
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getListJob = this._getListJob.bind(this);
    }

    async _onSave(event) {
        event.preventDefault();
        const {uiAction} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.setState({loading: true});
        const res = await reserveRegistrationJobOpen({
            id: object?.sales_order_items_sub_id,
            job_id: object.job_id
        });
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            uiAction.deletePopup();
            publish(".refresh", {}, Constant.IDKEY_JOB_BASIC_PACKAGE);
        }else{
            uiAction.deletePopup();
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
            }
        }
        this.setState({object: object});
    }

    _getListJob() {
        let args = {
            employer_id: this.props.sales_order.employer_id,
            job_status: Constant.STATUS_ACTIVED,
            premium_type: Constant.JOB_PREMIUM_NORMAL,
            'resume_apply_expired[from]': moment().add(2, 'days').unix(),
            execute: true
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, args);
    }

    componentWillMount() {
        this.getListJob();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_JOB]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_JOB];
            if (response.code === Constant.CODE_SUCCESS) {
                let listJob = [];
                response.data.forEach((item) => {
                    listJob.push({
                        value: item.id,
                        title: item.id + " - " + item.title
                    })
                });
                this.setState({listJob: listJob});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_JOB);
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
        const {sub_item, branch} = this.props;
        let {object, object_error, object_required, name_focus, listJob} = this.state;
        let day_quantity = moment.unix(object.end_date).diff(moment.unix(object.start_date), 'day') + 1;

        /**
         * Chọn subItem khi mở bảo lưu
         */
        const subItemsOption = [
            {
                title: `ID ${sub_item?.id} - ${sub_item?.remaining_day} ngày`,
                value: sub_item.id
            }
        ];
        const {channel_code} = branch.currentBranch;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;

        return (
            <form onSubmit={this.onSave}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Tin cơ bản</span>
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
                            {isMW && <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="job_id" label="Tin tuyển dụng" data={listJob}
                                         required={object_required.includes('job_id')}
                                         error={object_error.job_id} value={object.job_id} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>}
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu" readOnly
                                                    required={object_required.includes('start_date')}
                                                    value={object?.start_date} nameFocus={name_focus}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="end_date" label="Ngày kết thúc" readOnly
                                                    required={object_required.includes('end_date')}
                                                    value={object?.end_date} nameFocus={name_focus}
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
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupFreemiumPackageReserve);
