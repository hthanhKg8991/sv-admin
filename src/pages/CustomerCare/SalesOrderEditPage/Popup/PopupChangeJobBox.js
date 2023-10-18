import React, {Component} from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import _ from "lodash";
import {publish} from "utils/event";
import {salesOrderChangeJob} from "api/saleOrder";
import {getListJob} from "api/employer";
import DropboxMulti from "components/Common/InputValue/DropboxMulti";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupChangeJobBox extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Popup");
        this.state = {
            object: {},
            object_required: ['gate', 'job_id'],
            object_error: {},
            name_focus: "",
            listJob: [],
            // listJobRunning: [],
            configForm: configForm,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeGate = this._onChangeGate.bind(this);
        this.getListJob = this._getListJob.bind(this);
        // this.getListJobRunning = this._getListJobRunning.bind(this);
    }

    async _onSave(data, required) {
        const {sub_item, uiAction} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        object.id = sub_item?.id;
        object.type = Constant.CHANGE_JOB_TYPE_JOB;

        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn thay tin?',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await salesOrderChangeJob(object);
                if (res.code === Constant.CODE_SUCCESS) {
                    uiAction.putToastSuccess("Thay đổi tin thành công!");
                    uiAction.deletePopup();
                    publish(".refresh", {}, Constant.IDKEY_JOB_PACKAGE);
                    uiAction.hideSmartMessageBox();
                }else{
                    uiAction.SmartMessageBox({
                        title: "Thông báo nhắc nhở",
                        content: res.msg,
                        buttons: ['Xác nhận']
                    }, () => {
                        uiAction.hideSmartMessageBox();
                    })
                }
                uiAction.hideLoading();
            }
        });
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

    _onChangeGate(value, name) {
        this.onChange(value, name);
        this.getListJob(value);
    }

    // async _getListJobRunning() {
    //     // Lấy hết k theo gate code + service_code
    //     let args = {
    //         employer_id: this.props.sales_order.employer_id,
    //         service_type: Constant.SERVICE_TYPE_JOB_BASIC,
    //         page: Constant.PAGE_DEFAULT,
    //         per_page: Constant.UN_LIMIT_PER_PAGE,
    //         execute: true,
    //         // gate_code: gate
    //     };
    //     const res = await getListJobBoxRunning(args);
    //     if (res) {
    //         this.setState({listJobRunning: res?.items || []});
    //     }
    // }

    async _getListJob(gate) {
        // let {listJobRunning} = this.state;
        const args = {
            employer_id: this.props.sales_order.employer_id,
            job_status: Constant.STATUS_ACTIVED,
            // premium_type: Constant.JOB_PREMIUM_VIP,
            'resume_apply_expired[from]': moment().add(2, 'days').unix(),
            execute: true,
            gate_code: gate
        };
        // const listJobIds = listJobRunning?.map(item => item?.job_id);
        // args.job_ids = listJobIds; // Đổi cơ chế load tất cả tin --> lúc trước chỉ lấy tin đang chạy
        const res = await getListJob(args);
        if (res) {
            const listJob = res.map(item => {
                return {
                    value: item.id,
                    title: item.id + " - " + item.title,
                    job: item
                }
            });
            this.setState({listJob: listJob});
        }
    }

    componentDidMount() {
        // MW deploy: Api yều cầu sửa params gửi lên không cần check tin đang chạy --> off các list job running
        // this.getListJobRunning();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
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
        let {object, object_error, object_required, name_focus, listJob, configForm} = this.state;
        const {sales_order_item} = this.props;
        let gateList = this.props.sys.gate.items;
        let box_code_list = this.props.sys.service.items;
        let jobField = [];
        let type_field = false;
        box_code_list.forEach((item) => {
            if (item.code === sales_order_item.service_code && parseInt(item.page_type) === Constant.SERVICE_PAGE_TYPE_FIELD){
                type_field = true;
                object_required.push('job_field_id');
                let list_job = listJob.filter(c => parseInt(c.value) === parseInt(object.job_id));
                let field_list = [];
                if (list_job.length){
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
                                <Dropbox name="gate"
                                         label="Chọn cổng"
                                         data={gateList}
                                         required={object_required.includes('gate')}
                                         error={object_error.gate}
                                         key_value="code" key_title="full_name"
                                         value={object.gate}
                                         nameFocus={name_focus}
                                         onChange={this.onChangeGate}

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

export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeJobBox);
