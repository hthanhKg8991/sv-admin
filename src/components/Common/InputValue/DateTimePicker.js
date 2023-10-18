import React, { Component } from "react";
import moment from 'moment-timezone';
import DateRangePicker from "react-bootstrap-daterangepicker";
import IconButton from '@material-ui/core/IconButton';
import { connect } from "react-redux";
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class DateTimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            isApply: false,
            value: "",
            value_timestamp: null,
            flag_active: false,
            flag_error: false,
            msg: null,
            rollback: false,
            icon_rollback: false,
            value_tmp: null
        };
        this.onApply = this._onApply.bind(this);
        this.iconDeleteClick = this._iconDeleteClick.bind(this);
        this.onFocus = this._onFocus.bind(this);
        this.onBlur = this._onBlur.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onChange(event) {
        this.setState({ value: this.state.value });
    }
    _onApply(event, picker) {
        let date = picker.startDate;
        let value = null;
        this.setState({ isApply: true });
        this.setState({ flag_active: true });
        this.setState({ flag_error: false });
        this.setState({ msg: null });
        value = date.format("DD/MM/YYYY");
        let value_timestamp = Math.round(new Date(date.format("YYYY-MM-DD")).getTime() / 1000);

        /* props show popup thông báo, task VHCRMV2-845 */
        if (this.props.beforeApply
            && typeof this.props.beforeApply === 'object'
            && Object.keys(this.props.beforeApply).length > 0
        ) {
            const { title, content } = this.props.beforeApply;
            this.props.uiAction.SmartMessageBox({
                title: title(value_timestamp),
                content,
                buttons: ['Hủy', 'Xác nhận']
            }, async (ButtonPressed) => {
                if (ButtonPressed === "Xác nhận") {
                    this.setState({ value_timestamp: value_timestamp });
                    this.props.onChange(value_timestamp, this.props.name);
                    this.setState({ value: value });
                }
                this.props.uiAction.hideSmartMessageBox();
            });
        } else {
            this.setState({ value_timestamp: value_timestamp });
            this.props.onChange(value_timestamp, this.props.name);
            this.setState({ value: value });
        }
    }
    _onFocus(event) {
        this.setState({ flag_active: true });
        this.Input.focus();
    }
    _onBlur(event) {
        if (this.props.required) {
            if (!this.state.value) {
                this.setState({ flag_error: true });
                this.setState({ msg: "Thông tin là bắt buộc" });
                this.setState({ flag_active: false });
            } else {
                this.setState({ flag_error: false });
                this.setState({ msg: null });
                this.setState({ flag_active: true });
            }
        } else {
            this.setState({ flag_active: !!this.state.value });
        }
    }
    _iconDeleteClick() {
        this.setState({ isApply: false });
        this.setState({ flag_active: false });
        this.setState({ value: "" });
        this.props.onChange(null, this.props.name);
        if (this.props.required) {
            this.setState({ flag_error: true });
            this.setState({ msg: "Thông tin là bắt buộc" });
        }
    }
    componentWillMount() {
        let value = this.props.value;
        let is_value = !(value === "" || value === null || value === undefined);
        if (is_value) {
            this.setState({ value_timestamp: this.props.value });
            this.setState({ value: moment.unix(this.props.value).format("DD/MM/YYYY") });
            this.setState({ flag_active: true });
            this.setState({ isApply: true });
        }
        let old_value = this.props.old_value;
        if (old_value !== undefined && old_value !== value && value !== undefined && value !== null) {
            this.setState({ icon_rollback: true });
            this.setState({ value_tmp: this.props.value });
        }
    }
    componentWillReceiveProps(newProps) {
        let value = newProps.value;
        let is_value = !(value === "" || value === null || value === undefined);

        if (newProps.error) {
            this.setState({ msg: newProps.error });
            this.setState({ flag_error: true });
        }
        if (is_value) {
            this.setState({ value_timestamp: newProps.value });
            this.setState({ value: moment.unix(newProps.value).format("DD/MM/YYYY") });
            this.setState({ flag_active: true });
            this.setState({ isApply: true });
        } else {
            this.setState({ isApply: false });
            this.setState({ flag_active: false });
            this.setState({ value: "" });
            this.setState({ value_timestamp: null });
        }
        let old_value = newProps.old_value;
        if (old_value !== undefined && value !== undefined && value !== null) {
            if (old_value !== value) {
                this.setState({ icon_rollback: true });
                this.setState({ value_tmp: newProps.value });
            } else {
                // this.setState({icon_rollback: false});
            }
        }
        if (newProps.nameFocus === this.props.name) {
            this.onFocus();
        }
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))) {
            this.setState({ lang: newProps.lang });
        }
    }

    render() {
        let class_error = "";
        let class_msg = "";
        if (this.state.flag_active) {
            class_error = "flag-active";
        }
        if (this.state.flag_error) {
            class_error = class_error + " flag-error";
            class_msg = "v-messages-error"
        }
        class_error = this.state.icon_rollback && !this.state.rollback ? class_error + " flag-warning" : class_error;

        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        if (msg) {
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            } else {
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let startDate = moment();
        if (this.state.value) {
            startDate = moment.unix(this.state.value_timestamp);
        }
        let minDate = moment().startOf('year').subtract(60, 'years');
        if (this.props.minDate) {
            minDate = this.props.minDate;
        }
        let maxDate = moment().startOf('year').add(5, 'years');
        if (this.props.maxDate) {
            maxDate = this.props.maxDate;
        }

        let old_value = this.state.value_tmp === this.props.value ? this.props.old_value : this.state.value_tmp;

        return (
            <div className="v-input">
                <div className={"v-input-control " + class_error}>
                    {!this.props.readOnly && (
                        <div className="v-input-slot v-date-picker">
                            <DateRangePicker startDate={startDate} endDate={startDate} onApply={this.onApply} minDate={minDate} maxDate={maxDate} showDropdowns singleDatePicker>
                                <label className="v-label" onClick={this.onFocus}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                                {this.props.icon && (
                                    <i className="el-icon-input glyphicon glyphicon-calendar" />
                                )}
                                {this.state.isApply && (
                                    <IconButton style={{ top: "-2px" }} aria-label="Delete" size="small" onClick={this.iconDeleteClick}>
                                        <i className="el-icon-input-delete glyphicon glyphicon-remove-circle pointer" />
                                    </IconButton>
                                )}
                                <input type="text" name={this.props.name} id={this.props.name} className={this.props.className} placeholder={this.props.placeholder}
                                    value={this.state.value}
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                    autoFocus={this.props.autoFocus}
                                    ref={(input) => { this.Input = input; }}
                                    disabled={this.props.disabled}
                                    onChange={this.onChange}
                                    autoComplete="off"
                                />
                            </DateRangePicker>
                            {this.state.icon_rollback && (
                                <OverlayTrigger placement="top" shouldUpdatePosition={true} overlay={
                                    <Popover id={`${this.props.name}-popover`}>{moment.unix(old_value).format("DD/MM/YYYY")}</Popover>
                                }>
                                    <IconButton aria-label="rollback" size="small" className="right0" style={{ position: "absolute", bottom: "25px" }} onClick={() => {
                                        let value = this.state.rollback ? this.state.value_tmp : this.props.old_value;
                                        this.props.onChange(value, this.props.name);
                                        this.setState({ rollback: !this.state.rollback });
                                    }}>
                                        <i className="fs18 pointer icon-transform material-icons">redo</i>
                                    </IconButton>
                                </OverlayTrigger>
                            )}
                        </div>
                    )}
                    {this.props.readOnly && (
                        <div className="flag-readonly">
                            <div className="v-input-slot v-date-picker">
                                <label className="v-label">{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                                {this.props.icon && (
                                    <i className="el-icon-input glyphicon glyphicon-calendar" />
                                )}
                                <input value={this.state.value} className={this.props.className} placeholder={this.state.placeholder} readOnly />
                            </div>
                        </div>
                    )}
                    <div className={"v-messages " + class_msg}>
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
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DateTimePicker);
