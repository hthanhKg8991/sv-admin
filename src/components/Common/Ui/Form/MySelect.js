import React from "react";
import { Field } from "formik";
import _ from "lodash";
import classnames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import { components } from "react-select";
import MySelectCore from "components/Common/Ui/Form/Core/MySelectCore";

class MySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocusing: false,
    };
    this.onFocus = this._onFocus.bind(this);
    this.onFocusOut = this._onFocusOut.bind(this);
    this.handleChange = this._handleChange.bind(this);
    this.onInputChange = this._onInputChange.bind(this);
    this.clearValue = this._clearValue.bind(this);
  }

  _onFocus(setFieldTouched) {
    const { name } = this.props;
    setFieldTouched(name, true);
    this.setState({ isFocusing: true });
  }

  _onFocusOut() {
    this.setState({ isFocusing: false });
  }

  _onInputChange = _.debounce((value) => {
    const { onInputChange } = this.props;
    if (value && onInputChange) {
      onInputChange(value);
    }
  }, 700);

  _handleChange(optionSelected, setFieldValue) {
    const { isMulti, readOnly } = this.props;
    if (!readOnly) {
      if (isMulti) {
        this._handleChangeMulti(optionSelected, setFieldValue);
      } else {
        this._handleChangeSingle(optionSelected, setFieldValue);
      }
    }
  }

  _handleChangeSingle({ value }, setFieldValue) {
    this._setValue(setFieldValue, value);
    if (this.props.handleChange) {
      this.props.handleChange(value);
    }
  }

  _handleChangeMulti(optionSelected, setFieldValue) {
    const value = _.map(optionSelected, "value");
    this._setValue(setFieldValue, value);
    if (this.props.handleChange) {
      this.props.handleChange(value);
    }
  }

  _clearValue(setFieldValue) {
    this._setValue(setFieldValue, "");
  }

  _setValue(setFieldValue, value) {
    const { name, onChange } = this.props;
    setFieldValue(name, value);
    if (onChange) {
      onChange(value);
    }
  }

  _handleInitSelect(value) {
    const { options, isGroup, isMulti } = this.props;
    let valueSelect;
    if (isGroup) {
      if (isMulti) {
        valueSelect = [];
        _.forEach(value, (item) => {
          _.forEach(options, (itemOption) => {
            const valueItem = _.find(
              _.get(itemOption, "options"),
              (o) => String(o.value) === String(item)
            );
            if (valueItem) {
              valueSelect.push(valueItem);
            }
          });
        });
      } else {
        _.forEach(options, (item) => {
          valueSelect = _.find(
            _.get(item, "options"),
            (o) => String(o.value) === String(value)
          );
          if (valueSelect) {
            return false;
          }
        });
      }
    } else {
      if (isMulti) {
        valueSelect = [];
        _.forEach(value, (item) => {
          const valueItem = _.find(
            options,
            (o) => String(o.value) === String(item)
          );
          if (valueItem) {
            valueSelect.push(valueItem);
          }
        });
      } else {
        valueSelect = _.find(options, (o) => String(o.value) === String(value));
      }
    }
    return valueSelect;
  }

  render() {
    const {
      label,
      name,
      options,
      showLabelRequired,
      isMulti,
      isWarning,
      isClosing,
      isLoading,
      readOnly,
    } = this.props;
    const { isFocusing } = this.state;

    // Style Cho Group Option
    const groupStyles = {
      color: "white",
      background: "#e8e8e8",
      padding: "5px 0px",
      display: "flex",
      cursor: "not-allowed",
    };

    const GroupHeading = (props) => (
      <div style={groupStyles}>
        <components.GroupHeading {...props} />
      </div>
    );
    return (
      <div className="v-input">
        <Field>
          {({
            form: {
              setFieldValue,
              setFieldTouched,
              errors,
              values,
              touched,
              isSubmitting,
            },
          }) => {
            const error = _.get(errors, name, null);
            const value = _.get(values, name, null);
            const valueSelect = this._handleInitSelect(value);
            const isTouched = _.get(touched, name);
            const isError = !!error && isTouched;
            return (
              <div
                className={classnames("v-input-control", {
                  "flag-active": isFocusing || !!value,
                  "flag-error": isError,
                  "flag-warning": isWarning,
                  "flag-readonly-v2": readOnly,
                })}
              >
                <div className="v-input-slot">
                  {label && (
                    <label className="v-label" htmlFor={name}>
                      {label}
                      {showLabelRequired && <span className="textRed">*</span>}
                    </label>
                  )}
                  {valueSelect && !isMulti && !isClosing && !readOnly && (
                    <div>
                      <IconButton
                        aria-label="Delete"
                        size="small"
                        onClick={() => this.clearValue(setFieldValue)}
                      >
                        <i className="el-icon-input-delete glyphicon glyphicon-remove-circle pointer" />
                      </IconButton>
                    </div>
                  )}
                  <MySelectCore
                    options={options}
                    value={valueSelect || null}
                    placeholder={""}
                    onMenuOpen={() => this.onFocus(setFieldTouched)}
                    onMenuClose={this.onFocusOut}
                    onChange={(value) =>
                      this.handleChange(value, setFieldValue)
                    }
                    onInputChange={(value) => this.onInputChange(value)}
                    openMenuOnFocus={true}
                    components={{
                      GroupHeading,
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    isMulti={isMulti}
                    isLoading={isLoading}
                    errors={errors}
                    values={values}
                    submitting={isSubmitting.toString()}
                    name={name}
                    isDisabled={readOnly}
                  />
                  <div className="v-input-icon v-icon-select2">
                    <i
                      aria-hidden="true"
                      className="v-icon material-icons v-icon-append"
                    >
                      arrow_drop_down
                    </i>
                  </div>
                </div>
                {isError && (
                  <div
                    className={classnames("v-messages", {
                      "v-messages-error": isError,
                    })}
                  >
                    {error && error.replace(":attr_name", label)}
                  </div>
                )}
              </div>
            );
          }}
        </Field>
      </div>
    );
  }
}

MySelect.defaultProps = {
  isGroup: false,
  isMulti: false,
  isWarning: false,
  isLoading: false,
};

MySelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  showLabelRequired: PropTypes.bool,
  // options: PropTypes.oneOfType([
  //     PropTypes.arrayOf(PropTypes.shape({
  //         value: PropTypes.any.isRequired,
  //         label: PropTypes.any.isRequired,
  //     })),
  //     PropTypes.arrayOf(PropTypes.shape({
  //         label: PropTypes.any.isRequired,
  //         options: PropTypes.array.isRequired,
  //     })),
  // ]).isRequired,
  isGroup: PropTypes.bool,
  isMulti: PropTypes.bool,
  isWarning: PropTypes.bool,
  isLoading: PropTypes.bool,
  onInputChange: PropTypes.func,
};

export default MySelect;
