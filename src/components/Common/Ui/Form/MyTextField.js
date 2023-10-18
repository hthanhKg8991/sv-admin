import React from "react"
import { Field } from "formik"
import classnames from "classnames"
import * as ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import _ from "lodash"
import configForm from "config/form"

class MyTextField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onChange = this._onChange.bind(this)
  }

  _onChange(e, setFieldValue) {
    this._setValue(setFieldValue, e)
  }

  _setValue(setFieldValue, value) {
    const { name, onChange } = this.props
    setFieldValue(name, value)
    if (onChange) {
      onChange(value)
    }
  }

  render() {
    const { label, name, toolbar, showLabelRequired } = this.props
    let modules = {
      toolbar: toolbar ? toolbar : this.props.modules.toolbar,
      clipboard: this.props.modules.clipboard,
    }
    return (
      <div className="v-input">
        <Field>
          {({ form: { setFieldValue, errors, values } }) => {
            const error = _.get(errors, name, null)
            const value = _.get(values, name, null)?.replaceAll(/\n/g, "<br />") || ""
            const isError = !!error
            return (
              <div
                className={classnames("v-input-control", {
                  "flag-error": isError,
                })}
              >
                {label && (
                  <label className="v-label" htmlFor={name}>
                    {label}
                    {showLabelRequired && <span className="textRed">*</span>}
                  </label>
                )}
                <ReactQuill
                  theme="snow"
                  name={name}
                  value={value}
                  onChange={(e) => this.onChange(e, setFieldValue)}
                  modules={modules}
                  ref={this.Ref}
                  formats={configForm.formatsMyTextField}
                />
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
            )
          }}
        </Field>
      </div>
    )
  }
}

MyTextField.defaultProps = {
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: "" }, { align: "center" }],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  },
}

export default MyTextField
