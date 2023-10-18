import React from "react";
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
        this.onChangeValue = this._onChangeValue.bind(this);
        this.onFetchData = this._onFetchData.bind(this);
    }

    _onFocus() {
        this.setState({
            isFocusing: true,
            listOption: []
        });

    }

    _onFocusOut() {
        this.setState({ isFocusing: false });
    }

    _onChangeValue(valueOptions) {
        const { onChange, name } = this.props;
        const value = _.map(valueOptions, item => item?.value?.trim());

        onChange(value, name);
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
            this.setState({
                listOption: res?.items.map(item => {
                    return ({ value: item.name, label: item.name })
                })
            })
        }
    }, 300)

    _onKeyDown(e, valueOptions) {
        let { inputValue } = this.state;
        const { name, onChange } = this.props;
        if (!inputValue) return;

        switch (e.key) {
            case 'Enter':
            case ',':
            case 'Tab':
                e.preventDefault();
                const check = _.find(valueOptions, { 'value': inputValue });
                if (check) {

                    return;
                }
                inputValue = inputValue.trim().replace(/\,/g, "");
                if (inputValue.trim().replace(/\,/, "").length < 2) {
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

                onChange(newValueOptions.map(item => item?.value?.trim()), name);

                this.setState({
                    inputValue: '',
                    listOption: []
                });
                break;
            default:
                break;
        }
    }

    _createOption(value) {
        return {
            label: value,
            value: value
        };
    }


    render() {
        const { label, name, showLabelRequired, max, value } = this.props;
        const { isFocusing, inputValue, listOption } = this.state;

        const valueOptions = _.map(value || [], (item) => {
            return this._createOption(item);
        });

        return (
            <div className="v-input">

                <div className={classnames("v-input-control", {
                    "flag-active": isFocusing || !!value,
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
                            onFocus={() => this.onFocus()}
                            onMenuClose={this.onFocusOut}
                            isMulti
                            placeholder=""
                            onInputChange={valueOptions?.length < max && this.onInputChange}
                            onKeyDown={(e) => this.onKeyDown(e, valueOptions)}
                            onChange={(valueOptions) => this.onChangeValue(valueOptions)}
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

                </div>

            </div>
        );
    }
}

Tag.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
};

export default Tag;
