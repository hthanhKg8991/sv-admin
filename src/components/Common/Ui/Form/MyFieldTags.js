import React from "react";
import {Field} from 'formik';
import PropTypes from "prop-types";
import _ from "lodash";
import classnames from 'classnames';
import MyTextField from "./Core/MyTextField";
import * as utils from "utils/utils";
import InputAdornment from '@material-ui/core/InputAdornment';

class MyFieldTags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valuesArr: this.props?.defaultValue ? [...this.props?.defaultValue] : [],
            keyPress: [',', 'Enter', 'Tab'],
            valueInput: "",
        };
        this.onChange = this._onChange.bind(this);
        this.onAddValue = this._onAddValue.bind(this);
        this.focusInput = this._focusInput.bind(this);
        this.onDelete = this._onDelete.bind(this);
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

    _focusInput(){
        this.Input.focus();
    }

    _onAddValue(event, setFieldValue, setFieldError, onBlur = false){
        let {valuesArr, keyPress, valueInput} = this.state;
        const {name} = this.props;
        let value_input = valueInput;
        let newValue = [...valuesArr];
        if (keyPress.includes(event.key) || onBlur) {
            event.preventDefault();
            event.stopPropagation();
            if(this.props.isEmail && !utils.validateEmailV2(value_input) && value_input !== ""){
                setFieldError(name, "Định dạnh email không hợp lệ")
                // this.setState({flag_error: true, msg: "Định dạnh email không hợp lệ"});
                return
            }
            if (!valuesArr.includes(value_input) && value_input !== ""){
                newValue.push(value_input);
            }
            this.onChange(newValue, setFieldValue);
            value_input = ''
        }
        if (event.key === 'Backspace' && value_input === "" && valuesArr.length){
            newValue = newValue.filter(c => c !== newValue[newValue.length - 1]);
            this.onChange(newValue, setFieldValue);
        }
        this.setState({
            valuesArr: newValue,
            valueInput: value_input
        });
    }

    _onDelete(item, setFieldValue){
        let valuesArr = [...this.state.valuesArr];
        valuesArr = valuesArr.filter(c => c !== item);
        this.setState({valuesArr: valuesArr});
        this.onChange(valuesArr, setFieldValue);
    }

    render() {
        const {label, name, type, InputProps, multiline, rows, showLabelRequired, isWarning, isArrayField, disabled, isEmail} = this.props;
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
                        const {errors, values, touched, setFieldValue, setFieldError, setFieldTouched} = form;
                        const error = _.get(errors, name, null);
                        // const value = _.get(values, name);
                        const isTouched = _.get(touched, name);
                        const isError = !!error && (isTouched || isArrayField || isEmail);

                        return (
                            <div className="d-flex flex-wrap align-items-stretch">
                                <div className="divInput flex-1" style={{minWidth: '280px'}}>
                                    <MyTextField 
                                        name={name}
                                        type={type}
                                        errors={errors}
                                        values={values}
                                        submitting={_.get(form, 'isSubmitting').toString()}
                                        // onChange={e => this.onChange(e.target.value, setFieldValue)}
                                        onChange={(e) => this.setState({valueInput: e.target.value})}
                                        onBlur={(e) => {
                                            this.onAddValue(e, setFieldValue, setFieldError, true)
                                            return field.onBlur
                                        }}
                                        // value={valueField}
                                        value={this.state.valueInput}
                                        error={!!isError}
                                        helperText={isError && Array.isArray(error) ? error[0] : error}
                                        multiline={multiline}
                                        rows={rows}
                                        label={labelField}
                                        disabled={disabled}
                                        onKeyDown={e => this.onAddValue(e, setFieldValue, setFieldError)}
                                        InputProps={{
                                            ...InputProps,
                                            style: { lineHeight: "16px", flexWrap: "wrap", display: "flex"},
                                            startAdornment: <>
                                                {this.state.valuesArr.map((item, key) => {
                                                    return(
                                                        <div className="divTags" style={{
                                                            width:"100%",
                                                            maxWidth:"fit-content",
                                                            fontSize:"14px"
                                                        }} key={key}>
                                                            <div className="divTags-content" style={{}}>{item}</div>
                                                            <div className="divTags-delete" style={{cursor: "pointer"}} onClick={()=>{this.onDelete(item, setFieldValue)}}>
                                                                <svg height="14" width="14" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-tj5bde-Svg">
                                                                    <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>,
                                        }}
                                        inputProps={{
                                            style: {
                                                flex: 1,
                                                minWidth: "280px"
                                            },
                                        }}
                                        ref={(input) => { this.Input = input; }}
                                    />
                                </div>
                            </div>
                        );
                    }}
                </Field>
            </div>
        )
    }
}

MyFieldTags.defaultProps = {
    type: 'text',
    multiline: false,
    isWarning: false,
    InputProps: { style: { lineHeight: "16px" } }
};

MyFieldTags.propTypes = {
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

export default MyFieldTags;
