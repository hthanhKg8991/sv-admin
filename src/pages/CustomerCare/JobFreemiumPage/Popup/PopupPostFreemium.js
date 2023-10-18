import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Dropbox from "components/Common/InputValue/Dropbox";
import config from 'config';
import Input2 from "components/Common/InputValue/Input2";
import { publish } from "utils/event";
import { createEmployerFreemium } from "api/employer";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import {API_URL_GET_LIST_JOB} from "utils/ConstantURL";
import {
    IDKEY_JOB_FREEMIUM_LIST,
    STATUS_ACTIVED,
    STATUS_COMPLETE,
    STATUS_DELETED,
    STATUS_DISABLED,
    STATUS_INACTIVED,
    STATUS_LOCKED
} from "utils/Constant";
import {activeJobFreemium} from "api/saleOrder";
class PopupPostFreemium extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['employer_id', 'job_id'],
            object_error: {},
            name_focus: "",
            employer_list: [],
            job_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getListEmployer = this._getListEmployer.bind(this);
        this.getListJob = this._getListJob.bind(this);
    }

    async _onSave(data) {
        this.setState({ object_error: {}, loading: true, name_focus: "" });
        let object = Object.assign({}, data);
        let object_required = this.state.object_required;

        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({ name_focus: check.field, loading: false, object_error: check.fields });
            return;
        }

        const fnApi = activeJobFreemium;
        const res = await fnApi(object);
        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.props.uiAction.deletePopup();
            publish(".refresh", {}, Constant.IDKEY_JOB_FREEMIUM_LIST);
        } else {
            this.setState({ object_error: Object.assign({}, res), loading: false });
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({ object: object });
    }

    _getListEmployer(value) {
        this.setState({ loading_getEmployer: true });
        let args = {
            q: value,
            status_not: [Constant.STATUS_DISABLED,Constant.STATUS_LOCKED,Constant.STATUS_DELETED],
            not_include_inactive_freemium: 1,
            per_page: 10,
            page: 1,
            is_freemium: 1,
        };
        this.setState({ loading: false });
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, args);
    }

    _getListJob(value) {
        if(this.state.object['employer_id']){
            this.setState({ loading_getJob: true });
            let args = {
                employer_q: this.state.object['employer_id'],
                job_q: value,
                per_page: 10,
                page: 1,
                status_not: `${Constant.STATUS_DISABLED},${Constant.STATUS_LOCKED},${Constant.STATUS_DELETED}`
            };
            this.setState({ loading: false });
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, args);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let employer_list = [];
                response.data.items.forEach((item) => {
                    employer_list.push({
                        value: item.id,
                        title: item.id + " - " + item.name,
                        item: item
                    });
                });
                this.setState({ employer_list: employer_list });
            }
            this.setState({ loading_getEmployer: false });
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_LIST_JOB]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_JOB];
            if (response.code === Constant.CODE_SUCCESS) {
                let job_list = [];
                response.data.items.forEach((item) => {
                    job_list.push({
                        value: item.id,
                        title: item.id + ' - ' + item.title,
                        item: item
                    });
                });
                this.setState({ job_list: job_list });
            }
            this.setState({ loading_getJob: false });
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
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        const { object, object_required, object_error, employer_list, job_list, name_focus, loading_getEmployer, loading_getJob } = this.state;

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="employer_id"
                                         label="Nhà tuyển dụng"
                                         data={employer_list}
                                         required={object_required.includes('employer_id')}
                                         error={object_error.employer_id}
                                         value={object.employer_id}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
                                         timeOut={1000} loading={loading_getEmployer}
                                         onChangeTimeOut={this.getListEmployer}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="job_id"
                                         label="Tin tuyển dụng"
                                         data={job_list}
                                         required={object_required.includes('job_id')}
                                         error={object_error.job_id}
                                         value={object.job_id}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
                                         timeOut={1000} loading={loading_getJob}
                                         onChangeTimeOut={this.getListJob}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Đăng tin</span>
                        </button>
                        <button type="button" className="el-button el-button-primary el-button-small" onClick={() => this.props.uiAction.deletePopup()}>
                            <span>Đóng</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupPostFreemium);
