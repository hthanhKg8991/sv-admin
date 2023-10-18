import React from "react";
import {Field} from 'formik';
import PropTypes from "prop-types";
import _ from "lodash";
import classnames from 'classnames';
import MyTextField from "./Core/MyTextField";
import {uploadFileV2} from "api/cdn";

class MyUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flag_error: false,
            msg: '',
        };
        this.onChange = this._onChange.bind(this);
        this.onChangeFile = this._onChangeFile.bind(this);
    }

    _onChange(value, setFieldValue) {
        this._setValue(setFieldValue, value);
    }

    async _onChangeFile(event, setFieldValue) {
        let file = event.target.files[0];
        if (!file) {
            this.setState({flag_error: true});
            this.setState({msg: `File không hợp lê. File phải có định dạng ${this.props.validateType?.join(', ')} và dung lượng <= ${this.props.maxSize}MB`});
            return;
        }
        const {name, size} = file;
        const type = name.split(".").pop();
        if ((this.props.maxSize && size > this.props.maxSize * 1024 * 1024) || !this.props.validateType?.includes(type)) {
            this.setState({flag_error: true});
            this.setState({msg: `File không hợp lê. File phải có định dạng ${this.props.validateType?.join(', ')} và dung lượng <= ${this.props.maxSize}MB`});
            return;
        }
        let folder = this.props.folder ? this.props.folder : "default";
        let data = new FormData();
        data.append('folder', folder);
        data.append('image', file);
        data.append('name', name);


        let args = {up_file: true, file: data, name: this.props.name};
        const res = await uploadFileV2(args);
        if (res) {
            this.onChange(res.url, setFieldValue);
            this.setState({flag_error: false, msg: ''});
        }
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
            InputProps,
            multiline,
            rows,
            showLabelRequired,
            isWarning,
            isArrayField,
            viewFile
        } = this.props;
        const {flag_error, msg} = this.state;
        return (
            <>
                <div className={classnames("v-textfield  overflow-hidden", {"flag-warning": isWarning})}>
                    <Field>
                        {({field, form}) => {
                            const {errors, values, touched, setFieldValue} = form;
                            const error = _.get(errors, name, null);
                            const value = _.get(values, name);
                            const isTouched = _.get(touched, name);
                            const isError = !!error && (isTouched || isArrayField);
                            const valueField = (value || value === 0) ? value : '';
                            return (
                                <>
                                    <label className="v-label mr10" htmlFor={name}>
                                        {label}
                                        {showLabelRequired && <span className="textRed">*</span>}
                                    </label>
                                    <label htmlFor={`file-${name}`} className={"el-button el-button-small"}>
                                        <i className="glyphicon glyphicon-upload"/>
                                        <input type="file" id={`file-${name}`}
                                               onChange={e => this.onChangeFile(e, setFieldValue)}
                                               style={{display: "none"}}/>
                                    </label>
                                    {value && (
                                        <>
                                            {viewFile ? <a href={value} className="text-link ml10"
                                                           target="_blank">{value.split('/').pop()}</a> :
                                                <span className="text-link ml10">{value.split('/').pop()}</span>}
                                        </>
                                    )}
                                    {flag_error && <span className="textRed ml10">({msg})</span>}
                                    {!flag_error && isError &&
                                    <span className="textRed ml10">({error?.replace(":attr_name", label)})</span>}
                                    <div className={"d-none"}>
                                        <MyTextField name={name}
                                                     type={"hidden"}
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
                                                     InputProps={InputProps}/>
                                    </div>
                                </>
                            );
                        }}
                    </Field>
                </div>
            </>
        )
    }
}

MyUpload.defaultProps = {
    type: 'text',
    multiline: false,
    isWarning: false,
    InputProps: {style: {lineHeight: "16px"}}
};

MyUpload.propTypes = {
    isArrayField: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    multiline: PropTypes.bool,
    showLabelRequired: PropTypes.bool,
    isWarning: PropTypes.bool,
    rows: PropTypes.number,
    maxSize: PropTypes.number,
    validateType: PropTypes.array,
    InputProps: PropTypes.object,
    onChange: PropTypes.func,
    viewFile: PropTypes.bool
};

export default MyUpload;
