import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import { getDetailProductGroupList, getListBundle } from "api/saleOrder";
import { publish } from "utils/event";
import * as Constant from "utils/Constant";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from "moment";
import config from 'config';
import { activatedTrial } from "api/saleOrder";

class PopupActivatedTrial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['bundles_id', 'job_id'],
            object_error: {},
            name_focus: "",
            items_groups: [],
            listJob: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getListItemsGroup = this._getListItemsGroup.bind(this);
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
        object.bundles_id = this.state.object?.bundles_id;
        object.job_id = this.state.object?.job_id;

        const fnApi = activatedTrial;
        const res = await fnApi(object);
        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.props.uiAction.deletePopup();
            publish(".refresh", {}, Constant.IDKEY_EMPLOYER_TRIAL_LIST);
            // publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
        } else {
            this.setState({ object_error: Object.assign({}, res), loading: false });
        }
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({ object: object });
    }

    async _getDetail(id) {
        const res = await getDetailProductGroupList({ id });
        if (res) {
            this.setState({ object: res });
        }
    }

    async _getListItemsGroup() {
        const res = await getListBundle({ status: Constant.STATUS_ACTIVED, per_page: 100, type: 2 });
        if (res && Array.isArray(res?.items)) {
            const items = res.items.map(item => {
                return {
                    title: `${item.code} - ${item.name}`,
                    value: item.id,
                }
            });
            this.setState({ items_groups: items });
        }
    }

    _getListJob() {
        let args = {
            employer_id: this.props?.employer?.employer_id,
            job_status: Constant.STATUS_ACTIVED,
            premium_type: Constant.JOB_PREMIUM_NORMAL,
            'resume_apply_expired[from]': moment().add(2, 'days').unix(),
            execute: true
        };
        this.setState({ loading: true });
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, args);
    }

    componentDidMount() {
        let { object } = this.props;
        if (object) {
            this.getDetail(object.id);
        }
        this.getListItemsGroup();
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
                this.setState({ listJob: listJob });
            }
            this.setState({ loading: false });
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
        const { object, object_required, object_error, items_groups, name_focus, listJob } = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="bundles_id"
                                    label="Chọn bundle"
                                    data={items_groups}
                                    required={object_required.includes('bundles_id')}
                                    error={object_error.bundles_id}
                                    value={object.bundles_id}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}

                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="job_id"
                                    label="Chọn tin trial"
                                    data={listJob}
                                    required={object_required.includes('job_id')}
                                    error={object_error.job_id}
                                    value={object.job_id}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}

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
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupActivatedTrial);
