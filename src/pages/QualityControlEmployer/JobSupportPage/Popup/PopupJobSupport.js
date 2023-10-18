import React,{Component} from "react";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from "moment";

class PopupJobSupport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['job_id', 'date_from', 'date_to', 'frequency'],
            object_error: {},
            name_focus: "",
            job_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.getListJob = this._getListJob.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(data){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        object.type = Constant.JOB_SUPPORT_TYPE_USER;
        object.status = Constant.STATUS_ACTIVED;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_JOB_SUPPORT_CREATE, object);
    }
    _getListJob(job_id){
        this.setState({loading: true});
        let args = {
            job_q: job_id,
            execute: true
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, args);
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object});
    }
    componentWillMount(){
        let {object} = this.props;
        if (object){
            object.from_time = moment(object.from_time,"HHmm");
            object.end_time = moment(object.end_time,"HHmm");
            this.setState({object: object});
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_JOB]){
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_JOB];
            if (response.code === Constant.CODE_SUCCESS) {
                let job_list = [];
                response.data.forEach((item) => {
                    job_list.push({title: item.id + " - " + item.title, value: item.id});
                });
                this.setState({job_list: job_list});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_JOB);
        }
        if (newProps.api[ConstantURL.API_URL_JOB_SUPPORT_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_JOB_SUPPORT_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('JobSupportPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_JOB_SUPPORT_CREATE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {object, object_error, object_required, name_focus, job_list, loading} = this.state;
        let job_support_frequency = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_support_frequency);

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="job_id" label="Tin tuyển dụng" data={job_list} timeOut={1000} loading={loading} required={object_required.includes('job_id')}
                                         error={object_error.job_id} value={object.job_id} nameFocus={name_focus}
                                         onChange={this.onChange}
                                         onChangeTimeOut={this.getListJob}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <DateTimePicker name="date_from" label="Từ ngày" required={object_required.includes('date_from')}
                                                error={object_error.date_from} value={object.date_from} nameFocus={this.state.name_focus}
                                                onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <DateTimePicker name="date_to" label="Từ ngày" required={object_required.includes('date_to')}
                                                error={object_error.date_to} value={object.date_to} nameFocus={this.state.name_focus}
                                                onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="frequency" label="Tần suất" data={job_support_frequency} required={object_required.includes('frequency')}
                                         error={object_error.frequency} value={object.frequency} nameFocus={name_focus}
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
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupJobSupport);
