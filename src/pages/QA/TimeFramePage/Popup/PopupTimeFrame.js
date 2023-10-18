import React,{Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import TimePicker from 'components/Common/InputValue/TimePicker';
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

class PopupTimeFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['name', 'from_time', 'end_time', 'call_require', 'time_frame_type'],
            object_error: {},
            name_focus: ""
        };
        this.onSave = this._onSave.bind(this);
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
        object.from_time = moment(object.from_time).format("HHmm");
        object.end_time = moment(object.end_time).format("HHmm");
        object.status = Constant.STATUS_ACTIVED;
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_TIME_FRAME_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_TIME_FRAME_UPDATE, object);
        }
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
        this.props.uiAction.hideLoading();
        if (newProps.api[ConstantURL.API_URL_CALL_TIME_FRAME_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_CALL_TIME_FRAME_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('TimeFramePage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_TIME_FRAME_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_CALL_TIME_FRAME_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_CALL_TIME_FRAME_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('TimeFramePage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_TIME_FRAME_UPDATE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {object, object_error, object_required, name_focus} = this.state;
        let time_frame_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_time_frame_type);

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="name" label="Tiêu đề" required={object_required.includes('name')}
                                        error={object_error.name} value={object.name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <TimePicker name="from_time" label="Thời gian bắt đầu" Step={5} required={object_required.includes('from_time')}
                                            error={object_error.from_time} value={object.from_time} nameFocus={name_focus}
                                            onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <TimePicker name="end_time" label="Thời gian kết thúc" Step={5} required={object_required.includes('end_time')}
                                            error={object_error.end_time} value={object.end_time} nameFocus={name_focus}
                                            onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="call_require" label="Yêu cầu (cuộc)" isNumber required={object_required.includes('call_require')}
                                        error={object_error.call_require} value={object.call_require} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="time_frame_type" label="Loại" data={time_frame_type} required={object_required.includes('time_frame_type')}
                                         error={object_error.time_frame_type} value={object.time_frame_type} nameFocus={name_focus}
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupTimeFrame);
