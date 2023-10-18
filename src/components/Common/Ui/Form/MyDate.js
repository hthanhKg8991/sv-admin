import React from "react";
import _ from "lodash";
import {Field} from "formik";
import PropTypes from "prop-types";
import classnames from "classnames";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import IconButton from "@material-ui/core/IconButton";

class MyDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocusing: false
        };
        this.onShow = this._onShow.bind(this);
        this.onHide = this._onHide.bind(this);
        this.onApply = this._onApply.bind(this);
        this.onClear = this._onClear.bind(this);
    }

    _onShow(setFieldTouched) {
        const {name} = this.props;
        setFieldTouched(name, true);
        this.setState({
            isFocusing: true
        });
    }

    _onHide() {
        this.setState({
            isFocusing: false
        });
    }

    _onApply(picker, setFieldValue) {
        this._setValue(setFieldValue, picker.endDate.unix());
    }

    _onClear(setFieldValue) {
        this._setValue(setFieldValue, '');
    }

    _setValue(setFieldValue, value) {
        const {name, onChange} = this.props;

        setFieldValue(name, value);
        if (onChange) {
            onChange(value);
        }
    }

    render() {
        const {isFocusing} = this.state;
        const {label, name, format, time, showLabelRequired, showDropdowns, minDate, maxDate} = this.props;
        return (
            <div className="v-input">
                <Field>
                    {({
                          form: {setFieldValue, setFieldTouched, errors, values, touched}
                      }) => {
                        const error = _.get(errors, name, null);
                        const value = _.get(values, name, null);
                        const isTouched = _.get(touched, name);
                        const isError = !!error && isTouched;
                        let valueDisplay;
                        if(value){
                            valueDisplay = moment.unix(value).format(format);
                        }

                        return (
                            <div className={classnames("v-input-control", {
                                "flag-active": isFocusing || !!value,
                                "flag-error": isError
                            })}>
                                <div className="v-input-slot v-date-picker">
                                    <DateRangePicker singleDatePicker
                                                     timePicker={time}
                                                     timePicker24Hour={time}
                                                     timePickerSeconds={time}
                                                     containerStyles={{}}
                                                     showDropdowns={showDropdowns}
                                                     onApply={(ev, pickser) => this.onApply(pickser, setFieldValue)}
                                                     onShow={() => this.onShow(setFieldTouched)}
                                                     onHide={this.onHide}
                                                     minDate={minDate}
                                                     maxDate={maxDate}
                                    >
                                        {value && (
                                            <IconButton style={{top: "-2px"}} aria-label="Delete" size="small"
                                                        onClick={() => this.onClear(setFieldValue)}>
                                                <i className="el-icon-input-delete glyphicon glyphicon-remove-circle pointer"/>
                                            </IconButton>
                                        )}
                                        {label && (
                                            <label className="v-label" htmlFor={name}>
                                                {label}
                                                {showLabelRequired && <span className="textRed">*</span>}
                                            </label>
                                        )}
                                        <input type="text" value={valueDisplay || ''} readOnly/>
                                        <i className="el-icon-input glyphicon glyphicon-calendar"/>
                                    </DateRangePicker>
                                </div>
                                {isError && (
                                    <div className={classnames("v-messages", {"v-messages-error": isError})}>
                                        {error && error.replace(":attr_name", label)}
                                    </div>
                                )}
                            </div>
                        )
                    }}
                </Field>
            </div>
        )
    }
}

MyDate.defaultProps = {
    format: "DD/MM/YYYY",
    time: false,
    showDropdowns: true,
};

MyDate.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    format: PropTypes.string,
    minDate: PropTypes.any,
    showLabelRequired: PropTypes.bool,
    time: PropTypes.bool,
    showDropdowns: PropTypes.bool,
};

export default MyDate;
