import React from "react";
import PropTypes from "prop-types";
import MyField from "components/Common/Ui/Form/MyField";
import { FieldArray } from "formik";
import _ from "lodash";

class MyCloneField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayValue: Array.from(Array(1).keys()),
    };
  }

  render() {
    const { label, name, value, errors, setFieldError } = this.props;
    const parentError = _.get(errors, name);
    const isParentErrors = typeof parentError === "string";
    // msg lúc thì array lúc thì string nên hard code
    if (isParentErrors) {
      setFieldError(`${name}.${0}`, parentError);
    }
    if (!value) {
      return null;
    }
    return (
      <>
        <FieldArray
          name={name}
          render={(arrayHelpers) => (
            <>
              {value &&
                _.isArray(value) &&
                value?.map((_, index) => (
                  <div className="row" key={index}>
                    <div className="col-sm-9 mb10">
                      <MyField
                        isArrayField
                        name={`${name}.${index}`}
                        label={label}
                        showLabelRequired
                      />
                    </div>
                    <div className="col-sm-3 mt15">
                      {value.length !== 1 && (
                        <span
                          onClick={() => {
                            arrayHelpers.remove(index);
                          }}
                          className="pointer"
                        >
                          <i className="fa fa-minus" /> Xóa
                        </span>
                      )}
                      <span
                        onClick={() => arrayHelpers.push("")}
                        className="ml5 pointer"
                      >
                        <i className="fa fa-plus" /> Thêm
                      </span>
                    </div>
                  </div>
                ))}
            </>
          )}
        />
      </>
    );
  }
}

MyCloneField.defaultProps = {
  type: "text",
  multiline: false,
  isWarning: false,
};

MyCloneField.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  multiline: PropTypes.bool,
  showLabelRequired: PropTypes.bool,
  isWarning: PropTypes.bool,
  rows: PropTypes.number,
  InputProps: PropTypes.object,
};

export default MyCloneField;
