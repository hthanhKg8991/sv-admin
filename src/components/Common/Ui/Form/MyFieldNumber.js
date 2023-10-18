import React from "react";
import {Field} from 'formik';
import PropTypes from "prop-types";
import _ from "lodash";
import classnames from 'classnames';
import MyTextField from "./Core/MyTextField";
import NumberFormat from 'react-number-format';

function NumberFormatCustom(props) {
    const {inputRef, onChange, prefix, suffix, ...other} = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            allowNegative={false}
            prefix={prefix}
            suffix={suffix}
        />
    );
}

class MyField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this._onChange.bind(this);
    }

    _onChange(value, setFieldValue) {
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
        const {
            label,
            name,
            type,
            multiline,
            rows,
            showLabelRequired,
            isWarning,
            isArrayField,
            disabled,
            InputProps
        } = this.props;
        let labelField = label;
        if (showLabelRequired) {
            labelField = (
                <React.Fragment>
                    {label}
                    <span className="textRed">*</span>
                </React.Fragment>
            )
        }

        return (
            <div className={classnames("v-textfield", {"flag-warning": isWarning})}>
                <Field>
                    {({field, form}) => {
                        const {errors, values, touched, setFieldValue} = form;
                        const error = _.get(errors, name, null);
                        const value = _.get(values, name);
                        const isTouched = _.get(touched, name);
                        const isError = !!error && (isTouched || isArrayField);
                        const valueField = (value || value === 0) ? value : '';

                        return (
                            <MyTextField name={name}
                                         type={type}
                                         errors={errors}
                                         values={values}
                                         submitting={_.get(form, 'isSubmitting').toString()}
                                         onChange={e => this.onChange(e.target.value, setFieldValue)}
                                         onBlur={field.onBlur}
                                         value={valueField}
                                         error={isError}
                                         helperText={isError && error.replace(":attr_name", label)}
                                         multiline={multiline}
                                         rows={rows}
                                         label={labelField}
                                         disabled={disabled}
                                         InputProps={{
                                             inputComponent: NumberFormatCustom,
                                             ...InputProps,
                                         }}
                            />
                        );
                    }}
                </Field>
            </div>
        )
    }
}

MyField.defaultProps = {
    type: 'text',
    multiline: false,
    isWarning: false,
    InputProps: {style: {lineHeight: "16px"}}
};

MyField.propTypes = {
    isArrayField: PropTypes.bool,
    type: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    multiline: PropTypes.bool,
    showLabelRequired: PropTypes.bool,
    isWarning: PropTypes.bool,
    rows: PropTypes.number,
    InputProps: PropTypes.object,
    onChange: PropTypes.func
};

export default MyField;
