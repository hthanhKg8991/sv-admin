import React from "react";
import {Field} from "formik";
import _ from "lodash";
import classnames from "classnames";
import PropTypes from "prop-types";
// import CKE from "ckeditor4-react";
import { CKEditor } from 'ckeditor4-react';

CKEditor.editorUrl = 'https://cdn.ckeditor.com/4.15.0/full-all/ckeditor.js';


class MyCKEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this._onChange.bind(this);
    }

    _onChange(e, setFieldValue) {
        const value = e.editor.getData();
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
        const {label, name, config, showLabelRequired} = this.props;
        let configCK = {
            toolbar:config,
            allowedContent: true
        };
        return (
            <div className="v-input">
                <Field>
                    {({
                          form: {setFieldValue, errors, values}
                      }) => {
                        const error = _.get(errors, name, null);
                        const value = _.get(values, name, null);
                        const isError = !!error;
                        return (
                            <div className={classnames("v-input-control", {
                                "flag-error": isError
                            })}>
                                {label && (
                                    <label className="v-label" htmlFor={name}>
                                        {label}
                                        {showLabelRequired && <span className="textRed">*</span>}
                                    </label>
                                )}
                                <CKEditor
                                    initData={value}
                                     name={name}
                                     data={value}
                                     config={configCK}
                                     onChange={e => this.onChange(e,setFieldValue)}
                                     ref={this.Ref}
                                />
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

MyCKEditor.defaultProps = {
    config: [['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']],
};


MyCKEditor.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.any,
    config: PropTypes.any,
    showLabelRequired: PropTypes.bool,
};

export default MyCKEditor;
