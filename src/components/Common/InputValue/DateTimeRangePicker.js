import React, {Component} from "react";
import moment from 'moment-timezone';
import DateRangePicker from "react-bootstrap-daterangepicker";
import classnames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import {connect} from "react-redux";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class DateTimeRangePicker extends Component {
    constructor(props) {
        super(props);
        let start_default = moment(moment().format("YYYY-MM-DD"));
        this.state = {
            lang: props.lang,
            start : start_default,
            end : start_default,
            placeholder: props.placeholder,
            isApply: false,
            value: null,
            flag_active: false,
            flag_error: false,
            msg: null,
            autoApply: props.autoApply
        };
        this.initDate = this._initDate.bind(this);
        this.onApply = this._onApply.bind(this);
        this.iconDeleteClick = this._iconDeleteClick.bind(this);
    }
    _onApply(event, picker) {
        let start = picker.startDate;
        let end = picker.endDate;
        let placeholder = moment(start).format("DD/MM/YYYY") + " - " + moment(end).format("DD/MM/YYYY");
        this.setState({start: start});
        this.setState({end: end});
        this.setState({placeholder: placeholder});
        this.setState({isApply: true});
        this.setState({flag_active: true});
        this.setState({flag_error: false});
        this.setState({msg: ""});
        let startDate = Math.round(new Date(start.format("YYYY-MM-DD")).getTime()/1000);
        let endDate = Math.round(new Date(end.format("YYYY-MM-DD")).getTime()/1000);
        this.props.onChange(startDate,endDate);
    }
    _iconDeleteClick(){
        let now = new Date();
        this.setState({placeholder: this.props.placeholder});
        this.setState({isApply: false});
        this.setState({start: moment(now)});
        this.setState({end: moment(now)});
        this.setState({flag_active: false});
        this.props.onChange(null,null);
    }
    _initDate(value){
        if (value && value.length && moment.unix(value[0]).isValid() && moment.unix(value[1]).isValid()) {
            this.setState({start: moment.unix(value[0])});
            this.setState({end: moment.unix(value[1])});
            let placeholder = moment.unix(value[0]).format("DD/MM/YYYY") + " - " + moment.unix(value[1]).format("DD/MM/YYYY");
            this.setState({placeholder: placeholder});
            this.setState({flag_active: true});
            this.setState({isApply: true});
            this.setState({flag_error: false});
            this.setState({msg: ""});
        }
    }
    componentWillMount(){
        let value = this.props.value;
        if (value && value.length && moment.unix(value[0]).isValid() && moment.unix(value[1]).isValid()){
            this.initDate(this.props.value);
        }else{
            if (this.props.valueDefault && this.props.valueDefault.length){
                this.initDate(this.props.valueDefault);
                this.props.onChange(this.props.valueDefault[0],this.props.valueDefault[1]);
            }
        }

    }
    componentWillReceiveProps(newProps) {
        if (!newProps.value || !newProps.value[0] || !newProps.value[1] || !moment.unix(newProps.value[0]).isValid() || !moment.unix(newProps.value[1]).isValid()){
            if (newProps.is_required){
                this.setState({flag_error: true});
                this.setState({msg: "Thông tin là bắt buộc"});
            }else{
                this.setState({flag_error: false});
                this.setState({msg: ""});
            }
            let now = new Date();
            this.setState({placeholder: this.props.placeholder});
            this.setState({isApply: false});
            this.setState({start: moment(now)});
            this.setState({end: moment(now)});
            this.setState({flag_active: false});
        }else{
            this.initDate(newProps.value);
        }
        if (newProps.error){
            this.setState({msg: newProps.error});
            this.setState({flag_error: true});
            this.setState({flag_active: true});
            this.setState({isApply: true});
        }
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let class_error = "v-input-control";
        let class_msg = "";
        if (this.state.flag_active){
            class_error = class_error + " flag-active";
        }
        if (this.state.flag_error){
            class_error = class_error + " flag-error";
            class_msg = "v-messages-error"
        }
        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        if (msg){
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            }else{
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let ranges = null;
        if (this.props.ranges){
            ranges = this.props.ranges;
        }
        return(
            <div className="v-input">
                <div className={class_error}>
                    {this.props.readOnly && (
                        <div className="flag-readonly">
                            <div className="v-input-slot v-date-picker">
                                <label className="v-label" htmlFor={this.props.name}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                                <input className={this.props.className} value={this.state.placeholder} ref={(input) => { this.Input = input; }} readOnly/>
                                {this.props.icon && (
                                    <i className="el-icon-input glyphicon glyphicon-calendar"/>
                                )}
                            </div>
                        </div>
                    )}
                    {!this.props.readOnly && ranges && (
                        <div className="v-input-slot v-date-picker">
                            <DateRangePicker showCustomRangeLabel={!!!this.props.hideCustom} startDate={this.state.start} endDate={this.state.end} onApply={this.onApply} showDropdowns ranges={ranges} linkedCalendars={false}>
                                <label className="v-label" htmlFor={this.props.name} onClick={this.focusInput}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                                {this.state.isApply && !this.props.readOnly && !this.props.defaultValue && !this.props.valueDefault && !this.props.noDelete &&(
                                    <IconButton style={{top: "-2px"}} aria-label="Delete" size="small" onClick={this.iconDeleteClick}>
                                        <i className="el-icon-input-delete glyphicon glyphicon-remove-circle pointer"/>
                                    </IconButton>
                                )}
                                <input type="text" name={this.props.name} id={this.props.name} placeholder={this.state.placeholder}
                                       disabled="disabled"
                                       ref={(input) => { this.Input = input; }}
                                />
                                {this.props.icon && !this.state.isApply && (
                                    <i className="el-icon-input glyphicon glyphicon-calendar"/>
                                )}
                            </DateRangePicker>
                        </div>
                    )}
                    {!this.props.readOnly && !ranges && (
                        <div className="v-input-slot v-date-picker">
                            <DateRangePicker autoApply={this.state.autoApply} startDate={this.state.start} endDate={this.state.end} onApply={this.onApply} showDropdowns linkedCalendars={false}>
                                <label className="v-label" htmlFor={this.props.name} onClick={this.focusInput}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                                {this.state.isApply && !this.props.noDelete &&(
                                    <IconButton style={{top: "-2px"}} aria-label="Delete" size="small" onClick={this.iconDeleteClick}>
                                        <i className="el-icon-input-delete glyphicon glyphicon-remove-circle pointer"/>
                                    </IconButton>
                                )}
                                <input type="text" name={this.props.name} id={this.props.name} placeholder={this.state.placeholder}
                                       disabled="disabled"
                                       ref={(input) => { this.Input = input; }}
                                />
                                {this.props.icon && !this.state.isApply && (
                                    <i className="el-icon-input glyphicon glyphicon-calendar"/>
                                )}
                            </DateRangePicker>
                        </div>
                    )}
                    <div className={classnames("v-messages", !class_msg && this.props.hidden_error_non ? "hidden" : class_msg)}>
                        {msg}
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.language
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(DateTimeRangePicker);
