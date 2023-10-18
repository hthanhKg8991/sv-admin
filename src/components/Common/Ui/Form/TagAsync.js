import React from "react";
import { Field } from "formik";
import _ from "lodash";
import classnames from "classnames";
import CreatableSelect from 'react-select/creatable';
import PropTypes from "prop-types";

class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocusing: false,
            inputValue: '',
            listOption: []
        };
        this.onFocus = this._onFocus.bind(this);
        this.onFocusOut = this._onFocusOut.bind(this);
        this.onInputChange = this._onInputChange.bind(this);
        this.onKeyDown = this._onKeyDown.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onFetchData = this._onFetchData.bind(this);
    }

    _onFocus(setFieldTouched) {
        const { name } = this.props;
        setFieldTouched(name, true);
        this.setState({
            isFocusing: true,
            listOption: []
        });

    }

    _onFocusOut() {
        this.setState({ isFocusing: false });
    }

    _onChange(valueOptions, setFieldValue) {
        const value = _.map(valueOptions, item => item?.value?.trim());
        this._setValue(setFieldValue, value);
        this.setState({
            isFocusing: true,
            listOption: []
        });
    }

    async _onInputChange(value) {
        this.setState({ inputValue: value });
        this.onFetchData(value)
    }

    _onFetchData = _.debounce(async (value) => {
        if (value.length > 0) {
            const { apiRequest } = this.props
            const res = await apiRequest({ name: value, per_page: 10 });
            // console.log(res)
            this.setState({
                listOption: res?.items.map(item => {
                    return ({ value: item.name, label: item.name })
                })
            })
        }
    }, 300)

    _onKeyDown(e, valueOptions, setFieldValue, setFieldError) {
        let { inputValue } = this.state;
        const { name } = this.props;
        if (!inputValue) return;
        setFieldError(name, undefined);
        switch (e.key) {
            case 'Enter':
            case ',':
            case 'Tab':
                e.preventDefault();
                const check = _.find(valueOptions, { 'value': inputValue });
                if (check) {
                    setFieldError(name, "Từ khóa đã tồn tại.");
                    return;
                }
                inputValue = inputValue.trim().replace(/\,/g, "");
                if (inputValue.length < 2) {
                    return
                }
                const valueOption = this._createOption(inputValue);
                let newValueOptions = [];
                if (_.isEmpty(valueOptions)) {
                    newValueOptions = [{ ...valueOption }];
                } else {
                    newValueOptions = [
                        ...valueOptions,
                        { ...valueOption }
                    ];
                }

                this._setValue(setFieldValue, _.map(newValueOptions, item => item?.value?.trim()));
                this.setState({
                    inputValue: '',
                    listOption: []
                });
                break;
            default:
                break;
        }
    }

    _setValue(setFieldValue, value) {
        const { name, onChange } = this.props;

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
        const { label, name, showLabelRequired, max } = this.props;
        const { isFocusing, inputValue, listOption } = this.state;

        return (
            <div className="v-input">
                <Field>
                    {({
                        form: { setFieldValue, setFieldTouched, setFieldError, errors, values, touched }
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
                                        isClearable
                                        inputValue={inputValue}
                                        onFocus={() => this.onFocus(setFieldTouched)}
                                        onMenuClose={this.onFocusOut}
                                        isMulti
                                        placeholder=""
                                        onInputChange={valueOptions?.length < max && this.onInputChange}
                                        onKeyDown={(e) => valueOptions?.length < max && this.onKeyDown(e, valueOptions, setFieldValue, setFieldError)}
                                        onChange={(valueOptions) => this.onChange(valueOptions, setFieldValue)}
                                        value={valueOptions}
                                        options={listOption}
                                        createOptionPosition="first"
                                        formatCreateLabel={(inputValue) =>
                                            valueOptions?.length >= max ? `Chỉ được tối đa ${max} kỹ năng` : `Thêm kỹ năng: ${inputValue}`
                                        }
                                        noOptionsMessage={() => {
                                            return valueOptions?.length >= max ? `Chỉ được tối đa ${max} kỹ năng` : "Tạo kỹ năng";
                                        }}
                                    />
                                </div>
                                {isError && (
                                    <div className={classnames("v-messages", { "v-messages-error": isError })}>
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
