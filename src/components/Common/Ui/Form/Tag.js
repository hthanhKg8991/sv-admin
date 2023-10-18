import React from "react";
import {Field} from "formik";
import _ from "lodash";
import classnames from "classnames";
import CreatableSelect from 'react-select/creatable';
import PropTypes from "prop-types";

class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocusing: false,
            inputValue: ''
        };
        this.onFocus = this._onFocus.bind(this);
        this.onFocusOut = this._onFocusOut.bind(this);
        this.onInputChange = this._onInputChange.bind(this);
        this.onKeyDown = this._onKeyDown.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    _onFocus(setFieldTouched) {
        const {name} = this.props;
        setFieldTouched(name, true);
        this.setState({
            isFocusing: true
        });
    }

    _onFocusOut() {
        this.setState({isFocusing: false});
    }

    _onChange(valueOptions, setFieldValue) {
        const value = _.map(valueOptions, 'value');
        this._setValue(setFieldValue, value);
    }

    _onInputChange(value) {
        this.setState({inputValue: value});
    }

    _onKeyDown(e, valueOptions, setFieldValue, setFieldError) {
        const {inputValue} = this.state;
        const {name} = this.props;
        if (!inputValue) return;
        setFieldError(name, undefined);
        switch (e.key) {
            case 'Enter':
            case 'Tab':
                e.preventDefault();
                const check = _.find(valueOptions, {'value': inputValue});
                if (check) {
                    setFieldError(name, "Từ khóa đã tồn tại.");
                    return;
                }

                const valueOption = this._createOption(inputValue);
                let valueOptionAddeds = [];
                if (_.isEmpty(valueOptions)) {
                    valueOptionAddeds = [{...valueOption}];
                } else {
                    valueOptionAddeds = [
                        ...valueOptions,
                        {...valueOption}
                    ];
                }

                this._setValue(setFieldValue, _.map(valueOptionAddeds, 'value'));
                this.setState({
                    inputValue: ''
                });
                break;
            default:
                break;
        }
    }

    _setValue(setFieldValue, value) {
        const {name, onChange} = this.props;

        setFieldValue(name, value);
        if (onChange) {
            onChange(value);
        }
    }

    _createOption(value) {
        return {
            label: value,
            value: value
        };
    }

    render() {
        const {label, name, showLabelRequired} = this.props;
        const {isFocusing, inputValue} = this.state;

        return (
            <div className="v-input">
                <Field>
                    {({
                          form: {setFieldValue, setFieldTouched, setFieldError, errors, values, touched}
                      }) => {
                        const error = _.get(errors, name, null);
                        const value = _.get(values, name, null);
                        const isTouched = _.get(touched, name);
                        const isError = !!error && isTouched;
                        const valueOptions = _.map(value, (item) => {
                            return this._createOption(item);
                        });

                        return (
                            <div className={classnames("v-input-control", {
                                "flag-active": isFocusing || !!value,
                                "flag-error": isError
                            })}>
                                <div className="v-input-slot">
                                    {label && (
                                        <label className="v-label" htmlFor={name}>
                                            {label}
                                            {showLabelRequired && <span className="textRed">*</span>}
                                        </label>
                                    )}
                                    <CreatableSelect
                                        components={{
                                            DropdownIndicator: () => null,
                                            IndicatorSeparator: () => null
                                        }}
                                        inputValue={inputValue}
                                        onFocus={() => this.onFocus(setFieldTouched)}
                                        onMenuClose={this.onFocusOut}
                                        isMulti
                                        menuIsOpen={false}
                                        placeholder=""
                                        onInputChange={this.onInputChange}
                                        onKeyDown={(e) => this.onKeyDown(e, valueOptions, setFieldValue, setFieldError)}
                                        onChange={(valueOptions) => this.onChange(valueOptions, setFieldValue)}
                                        value={valueOptions}
                                    />
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
        );
    }
}

Tag.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    showLabelRequired: PropTypes.bool,
};

export default Tag;
