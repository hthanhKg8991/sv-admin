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
import {publish} from "utils/event";
import {getListJob} from "api/employer";
import {getListJobBoxRunning, registrationEffectCheckJobBox, salesOrderChangeJob} from "api/saleOrder";
import _ from "lodash";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupChangeEffect extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            object: {},
            object_required: ['job_id', 'service_code'],
            object_error: {},
            object_effect: {},
            name_focus: "",
            listJob: [],
            listJobRunning: [],
            configForm: getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Popup"),
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getListJob = this._getListJob.bind(this);
        this.getListJobRunning = this._getListJobRunning.bind(this);
    }

    _onSave(data, required) {
        const {sub_item, uiAction} = this.props;
        const {configForm} = this.state;
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
        object.type = Constant.CHANGE_JOB_TYPE_EFFECT;

        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn thay hiệu ứng?',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                /**
                 * Kiểm tra hết hạn tin đối với gói hiệu ứng (channel MW)
                 */
                if (configForm.includes("effect_check_job_box")) {
                    const res = await registrationEffectCheckJobBox({
                        sub_id: object.id,
                        job_id: object.job_id,
                    });
                    if(res) {
                        uiAction.SmartMessageBox({
                            title: "Ngày hết hạn hiệu ứng lớn hơn ngày hết hạn tin, Xác nhận tiếp tục thao tác?",
                            content: "",
                            buttons: ['No', 'Yes']
                        }, async (ButtonPressed) => {
                            if (ButtonPressed === "Yes") {
                                await this._changeEfffect(object);
                            } else {
                                uiAction.hideSmartMessageBox();
                                return false;
                            }
                        });
                    } else {
                        await this._changeEfffect(object);
                    }
                } else {
                    await this._changeEfffect(object);
                }
            }
        });
    }

    async _changeEfffect(object) {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await salesOrderChangeJob(object);
        if (res.code === Constant.CODE_SUCCESS) {
            uiAction.putToastSuccess("Thay đổi tin thành công!");
            uiAction.deletePopup();
            publish(".refresh", {}, Constant.IDKEY_EFFECT_PACKAGE);
        }else{
            uiAction.putToastError(res.msg);
        }
        uiAction.hideSmartMessageBox();
        uiAction.hideLoading();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = {...this.state.object};
        object[name] = value;
        this.setState({object: object});
    }

    async _getListJobRunning() {
        const {branch} = this.props;
        const {channel_code} = branch.currentBranch;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        let args = {
            employer_id: this.props.sales_order.employer_id,
            // MW lấy tin phí, các site lại lấy tin cơ bản
            service_type: isMW ? Constant.SERVICE_TYPE_JOB_BOX : Constant.SERVICE_TYPE_JOB_BASIC,
            page: Constant.PAGE_DEFAULT,
            per_page: Constant.UN_LIMIT_PER_PAGE,
        };
        const res = await getListJobBoxRunning(args);
        if (res) {
            this.setState({listJobRunning: res?.items || []});
        }
    }

    async _getListJob() {
        // let {listJobRunning} = this.state;
        const args = {
            employer_id: this.props.sales_order.employer_id,
            premium_type: Constant.JOB_PREMIUM_VIP,
            job_status: Constant.STATUS_ACTIVED,
            execute: true
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
        this.getListJob();
        this.getListJobRunning();
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
        const {sys, branch} = this.props;
        let {object, object_error, object_required, name_focus, listJob, listJobRunning} = this.state;

        let box_code_list = [
            ...sys.service.items,
            ...sys.effect.items,
        ];

        // #CONFIG_BRANCH
        const {channel_code} = branch.currentBranch;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        if (isMW) {
            if (!object.job_id) {
                box_code_list = [];
            } else {
                const serviceCodeOfJob = listJobRunning?.filter(s => s.job_id === object.job_id).map(s => s.service_code);
                box_code_list = sys.service.items.filter(s =>
                    s.service_type === Constant.SERVICE_TYPE_JOB_BOX &&
                    s.object_type === Constant.OBJECT_TYPE_JOB &&
                    serviceCodeOfJob.includes(s.code)
                );
            }
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
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="job_id" label="Tin tuyển dụng" data={listJob}
                                         required={object_required.includes('job_id')}
                                         error={object_error.job_id} value={object.job_id} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="service_code" label="Gói dịch vụ"
                                             data={box_code_list} readOnly={!isMW}
                                             key_value="code" key_title="name"
                                             value={object.service_code}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeEffect);
