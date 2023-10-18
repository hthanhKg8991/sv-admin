import React from "react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import classnames from "classnames";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import _ from "lodash";
import {Field} from "formik";
import PropTypes from "prop-types";

class MyDateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocusing: false
        };
        this.onClear = this._onClear.bind(this);
        this.onApply = this._onApply.bind(this);
        this.onShow = this._onShow.bind(this);
        this.onHide = this._onHide.bind(this);
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

    _onClear(setFieldValue) {
        this._setValue(setFieldValue, '');
    }

    _onApply(picker, setFieldValue) {
        const value = {
            from: picker.startDate.unix(),
            to: picker.endDate.unix(),
        };
        this._setValue(setFieldValue, value);
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
        const {label, name, showLabelRequired} = this.props;

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
                            valueDisplay = moment.unix(value.from).format("DD/MM/YYYY") + " - " + moment.unix(value.to).format("DD/MM/YYYY");
                        }

                        return (
                            <div className={classnames("v-input-control", {
                                "flag-active": isFocusing || !!value,
                                "flag-error": isError
                            })}>
                                <div className="v-input-slot v-date-picker">
                                    <DateRangePicker startDate="06/01/2020" endDate="06/06/2020"
                                                     containerStyles={{}}
                                                     onApply={(ev, pickser) => this.onApply(pickser, setFieldValue)}
                                                     onShow={() => this.onShow(setFieldTouched)}
                                                     onHide={this.onHide}>
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

MyDateRange.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    showLabelRequired: PropTypes.bool,
};

export default MyDateRange;
