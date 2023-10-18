import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Input2 from "components/Common/InputValue/Input2";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import TimePicker from "components/Common/InputValue/TimePicker";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";
import moment from "moment";

class PopupGetCall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['day', 'time', 'range'],
            object_error: {},
            name_focus: "",
            data_list: [],
            input_list: {},

        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    _onSave(object_input, object_required) {
        // this.setState({object_error: {}});
        const {object_error} = this.state;
        this.setState({name_focus: ""});
        let object = Object.assign({}, object_input);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error || object_error?.range) {
            this.setState({name_focus: object_error?.range ? "range" : check.field});
            this.setState({object_error: object_error?.range ? {...object_error, range: object_error?.range} : check.fields});
            return;
        }
        // this.props.uiAction.showLoading();
        let data = {
            day: moment.unix(object.day).format("YYYY-MM-DD"),
            time: object.time.format("HH:mm:ss"),
            range: object.range,
            type: 2,
        }
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_POST_CALL_SYN_CALL_HISTORY, data);
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];

        if (name === 'range' && Number(value) > 120) {
            object_error[name] = "Nhập khoảng thời gian không quá 120 phút."
        }

        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object: object});
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_CALL_SYN_CALL_HISTORY]) {
            let response = newProps.api[ConstantURL.API_URL_POST_CALL_SYN_CALL_HISTORY];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công");
            }
            this.props.uiAction.deletePopup();
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CALL_SYN_CALL_HISTORY);
            this.props.refreshList();
        }
    }

    render() {
        let {object, object_error, object_required, name_focus} = this.state;
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container">
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            this.onSave(object, object_required);
                        }}>
                            <div className="crm-section row">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="day" label="Ngày gọi"
                                                    required={object_required.includes('day')}
                                                    error={object_error.day} value={object.day} nameFocus={name_focus}
                                                    onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-6 mb10">
                                    <TimePicker name="time" label="Thời gian"
                                                required={object_required.includes('time')}
                                                error={object_error.time} value={object.time} nameFocus={name_focus}
                                                onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-6 mb10">
                                    <Input2 name="range" label="Khoảng thời gian (phút)"
                                            required={object_required.includes('range')}
                                            error={object_error.range} value={object.range} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12">
                                    <button type="submit" className="el-button el-button-success el-button-small">
                                        <span>Thực hiện</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupGetCall);
