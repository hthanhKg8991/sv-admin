import React from "react";
import Dropzone from 'react-dropzone';
import _ from "lodash";
import PropTypes from "prop-types";
import {uploadFile, uploadImage} from "api/cdn";
import {Field} from "formik";
import classnames from "classnames";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

class DropzoneImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            loading: false
        };

        this.onDrop = this._onDrop.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onDrop(files, setFieldValue, setFieldError) {
        const {name, validationImage, isFile} = this.props;
        const file = _.get(files, '0');
        if (file) {
            if (validationImage) {
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', (ev) => {
                        const imageName = file.name;
                        resolve({
                            imageName: imageName,
                            src: ev.target.result
                        });
                    });
                    reader.addEventListener('error', reject);
                    const {name, size} = file;
                    const type = name.split(".").pop();

                    if (validationImage.size && size > validationImage.size) {
                        reject(`Chỉ chọn File có dung lượng dưới ${validationImage.size / 1000} KB`);
                    }

                    if (validationImage.type && !validationImage.type.includes(type)) {
                        reject(`File phải có định dạng ${validationImage.type.toString()}`);
                    }
                    reader.readAsDataURL(file);
                }).then(image => {
                    return (new Promise((resolve, reject) => {
                        if (isFile) {
                            resolve(file)
                        }

                        const img = new Image();
                        img.addEventListener('load', () => {

                            if (validationImage.width && img.width < validationImage.width) {
                                reject("Chiều dài của ảnh phải lớn hơn hoặc bằng " + validationImage.width + "px")
                            }

                            if (validationImage.height && img.height < validationImage.height) {
                                reject("Chiều cao của ảnh phải lớn hơn hoặc bằng " + validationImage.height + "px")
                            }

                            resolve(file);
                        });
                        img.src = image.src;
                    }));
                }).then(file => {
                    this.asyncUploadImage(file, setFieldValue, setFieldError);
                }, error => {
                    setFieldError(name, error);
                });
            } else {
                this.asyncUploadImage(file, setFieldValue, setFieldError);
            }
        }
    }

    _onDelete(setFieldValue) {
        const {name} = this.props;
        setFieldValue(name, "");
        setFieldValue(name + "_url", "");
    }

    async asyncUploadImage(file, setFieldValue) {
        const {name, folder, isFile, prefix} = this.props;
        const fnUpload = isFile ? uploadFile : uploadImage;
        const args = {
            folder: folder,
            image: file,
        };
        if (prefix) {
            args.name = `${prefix}-${file.name}`;
        }
        this.setState({loading: true})
        const res = await fnUpload(args);
        this.setState({loading: false})
        if (res) {
            const imagePath = _.get(res, ['path_file']);
            const imageUrl = _.get(res, ['url']);
            setFieldValue(name, imagePath);
            setFieldValue(name + "_url", imageUrl);
        }
    }

    render() {
        const {label, name, showLabelRequired, isWarning, isFile, validationImage} = this.props;
        let labelField = label;
        if (showLabelRequired) {
            labelField = (
                <React.Fragment>
                    {label}
                    <span className="textRed">*</span>
                    {validationImage.width && validationImage.height && (
                        <div><span>(ngang x dọc):{validationImage.width}x{validationImage.height}</span>
                        </div>
                    )}
                </React.Fragment>
            )
        }

        return (
            <div className="v-input">
                <Field>
                    {({
                          form: {setFieldValue, setFieldError, errors, values}
                      }) => {
                        const error = _.get(errors, name, null);
                        const valueUrl = _.get(values, name + "_url", null);
                        const value = _.get(values, name, null);
                        return (
                            <>
                            {this.state.loading && <LoadingSmall />}
                            <div className={classnames("v-input-control v-input-image", {
                                "flag-error": !!error,
                                "flag-warning": isWarning,
                                "hidden": this.state.loading
                            })}>
                                <div className="v-input-slot">
                                    <Dropzone onDrop={(files) => this.onDrop(files,
                                        setFieldValue,
                                        setFieldError)}>
                                        {({getRootProps, getInputProps}) => (
                                            <div {...getRootProps({className: 'dropzone dropzone-custom'})}>
                                                <input {...getInputProps()} />
                                                {valueUrl && !isFile && (
                                                    <img alt={label} src={valueUrl}/>
                                                )}
                                                {isFile && valueUrl && (
                                                    <span onClick={() => {
                                                        window.open(valueUrl);
                                                    }} className="cursor-pointer text-link font-weight-bold">Xem tại đây</span>
                                                )}
                                                {!valueUrl && (
                                                    <React.Fragment>
                                                        <p style={{marginTop: "15px"}}>{labelField}</p>
                                                        <i className="icon-plus glyphicon glyphicon-plus"/>
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        )}
                                    </Dropzone>
                                </div>
                                {value && (
                                    <div className="text-center text-underline cursor-pointer"
                                         onClick={() => this.onDelete(setFieldValue)}>
                                        Xóa
                                    </div>
                                )}
                                {error && (
                                    <div
                                        className={classnames("v-messages text-center",
                                            {"v-messages-error": !!error})}>
                                        {error && error.replace(":attr_name", label)}
                                    </div>
                                )}
                            </div>
                            </>
                        )
                    }}
                </Field>
            </div>
        );
    }
}

DropzoneImage.defaultProps = {
    folder: 'default',
    isWarning: false,
};

DropzoneImage.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    showLabelRequired: PropTypes.bool,
    isWarning: PropTypes.bool,
    folder: PropTypes.string,
    isFile: PropTypes.bool,
};

export default DropzoneImage;
