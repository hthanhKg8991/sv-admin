import React, {Component} from "react";
import classnames from 'classnames';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as utils from "utils/utils";
import _ from "lodash";

class InputImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            imagePreviewUrl: null,
            flag_active: false,
            flag_error: false,
            msg: null,
            validateType: ["image/gif", "image/jpeg", "image/png", "image/jpg"],
            rollback: false,
            icon_rollback: false,
            validate: props.validate,
            value_tmp: null,
            deleteImg: false,
        };
        this.chooseFile = this._chooseFile.bind(this);
        this.onChange = this._onChange.bind(this);
        this.removeImg= this._removeImg.bind(this);
    }

    _chooseFile(event) {
        this.inputFile.click();
    }

    _onChange(event) {
        this.setState({deleteImg: false});

        let file = event.target.files[0];

        if (file === undefined) {
            return;
        }

        if (this.props.maxSize && file.size > (this.props.maxSize * 1024 * 1024)) {
            this.setState({flag_error: true});
            this.setState({msg: "Kích thước file không hợp lệ."});
            return;
        }
        if (!this.state.validateType.includes(file.type)) {
            this.setState({flag_error: true});
            this.setState({msg: "File không đúng định dạng hình ảnh."});
            return;
        }
        //validate widht height in promise
        (new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', (ev) => {
                const imageName = file.name;
                resolve({
                    imageName: imageName,
                    src: ev.target.result
                });
            });
            reader.addEventListener('error', reject);
            reader.readAsDataURL(file);
        }).then(reader => {
            return (new Promise((resolve, reject) => {
                const img = new Image();
                img.addEventListener('load', () => {
                    if (_.has(this.state, 'validate.mustWidth')) {
                        const mustWidth = this.state.validate.mustWidth;
                        if (mustWidth) {
                            if (Array.isArray(mustWidth)) {
                                if (!mustWidth.includes(img.width)) {
                                    reject("Chiều rộng của ảnh phải là " + mustWidth.join(' hoặc ') + " px")
                                }
                            } else if (img.width !== mustWidth) {
                                reject("Chiều rộng của ảnh phải là " + mustWidth + " px")
                            }
                        }
                    }

                    if (_.has(this.state, 'validate.mustHeight')) {
                        const mustHeight = this.state.validate.mustHeight;
                        if (mustHeight) {
                            if (Array.isArray(mustHeight)) {
                                if (!mustHeight.includes(img.height)) {
                                    reject("Chiều cao của ảnh phải là " + mustHeight.join(' hoặc ') + " px")
                                }
                            } else if (img.height !== mustHeight) {
                                reject("Chiều cao của ảnh phải là " + mustHeight + " px")
                            }
                        }
                    }

                    resolve(reader);
                });
                img.src = reader.src;
            }));
        }).then(() => {
            if ((this.props.width && this.props.height) || this.props.fullSize) {
                let folder = this.props.folder ? this.props.folder : "default";
                let data = new FormData();
                data.append('folder', folder);
                data.append('image', file);
                if (this.props.width) {
                    data.append('width', this.props.width);
                }
                if (this.props.height) {
                    data.append('height', this.props.height);
                }

                let args = {up_file: true, file: data, name: this.props.name};
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiCdnDomain, ConstantURL.API_URL_UPLOAD_IMAGE, args);
                this.props.uiAction.showLoading();
            }
        }).catch(reason => {
            this.setState({msg: reason, flag_error: true});
        }));

        // if ((this.props.width && this.props.height) || this.props.fullSize){
        //     let folder = this.props.folder ? this.props.folder : "default";
        //     let data = new FormData();
        //     data.append('folder', folder);
        //     data.append('image', file);
        //     if (this.props.width) {
        //         data.append('width', this.props.width);
        //     }
        //     if (this.props.height) {
        //         data.append('height', this.props.height);
        //     }
        //
        //     let args = {up_file: true, file: data, name: this.props.name};
        //     this.props.apiAction.requestApi(apiFn.fnPost, config.apiCdnDomain, ConstantURL.API_URL_UPLOAD_IMAGE, args);
        //     this.props.uiAction.showLoading();
        // }
    }

    _removeImg() {
        this.setState({imagePreviewUrl: null});
        this.setState({value_tmp: null});
        this.setState({deleteImg: true});
        this.props.onChange(null, this.props.name, _.get(this.props, 'item', null));
        this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_UPLOAD_IMAGE);
    }

    componentWillMount() {
        let value = this.props.value;
        let is_value = !(value === "" || value === null || value === undefined);
        if (is_value) {
            this.setState({imagePreviewUrl: utils.urlFile(this.props.value, config.urlCdnFile)});
            this.setState({flag_active: true});
        }
        let old_value = this.props.old_value;
        if (old_value !== undefined && old_value !== value && value !== undefined && value !== null) {
            this.setState({icon_rollback: true});
            this.setState({value_tmp: this.props.value});
        }
    }

    componentWillReceiveProps(newProps) {
        let value = newProps.value;
        let flag_error = false;
        let msg = '';
        let imagePreviewUrl = this.state.imagePreviewUrl ? this.state.imagePreviewUrl : value;
        if (this.props.name && newProps.nameFocus === this.props.name) {
            flag_error = true;
            msg = 'Thông tin là bắt buộc.';
        }
        if (newProps.error) {
            flag_error = true;
            msg = newProps.error;
        }
        let old_value = newProps.old_value;
        if (old_value !== undefined && value !== undefined && value !== null) {
            if (old_value !== value) {
                this.setState({icon_rollback: true});
                this.setState({value_tmp: newProps.value});
            } else {
                // this.setState({icon_rollback: false});
            }
        }
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))) {
            this.setState({lang: newProps.lang});
        }
        if (newProps.api[ConstantURL.API_URL_UPLOAD_IMAGE]) {
            let response = newProps.api[ConstantURL.API_URL_UPLOAD_IMAGE];
            if (response.info?.args?.name === this.props.name) {
                if (response.code === Constant.CODE_SUCCESS) {
                    if (this.props.onChange && response.data) {
                        this.props.onChange(response.data.path_file, this.props.name, _.get(this.props, 'item', null));
                    }
                    this.inputFile.value = null;
                    imagePreviewUrl = utils.urlFile(response.data.url, config.urlCdnFile);
                }
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_UPLOAD_IMAGE);
            }
        }
        if (imagePreviewUrl) {
            this.setState({imagePreviewUrl: imagePreviewUrl});
            this.setState({flag_active: true});
        }
        this.setState({flag_error: flag_error, msg: msg});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {validate = null, showDeleteImg} = this.props;
        let class_error = this.state.icon_rollback && !this.state.rollback ? "flag-warning" : "";
        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        if (msg) {
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            } else {
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let style = {
            width: (this.props.width) + "px",
            height: (this.props.height) + "px",
            borderRadius: (this.props.is_avatar ? (this.props.width + 2) / 2 : null)
        };

        if (this.props.style) {
            style.width = this.props.style.width || "100%";
            style.height = this.props.style.height || "auto";
            style.minHeight = this.props.style.minHeight || 80;
            style.maxWidth = this.props.style.maxWidth || 500;
        }

        let imagePreviewUrl = this.state.imagePreviewUrl;
        let old_value = this.state.value_tmp === this.props.value ? this.props.old_value : imagePreviewUrl;
        let url = this.state.value_tmp === this.props.value ? imagePreviewUrl : (this.props.old_value || old_value);
        let imagePreview = url && !this.state.deleteImg ? <img style={style} alt={this.props.label} src={url}/> : null;
        if(this.state.deleteImg){
            this.setState({flag_active: false});
        }
        return (
            <div className={classnames("v-input", class_error)}>
                {this.state.icon_rollback && (
                    <OverlayTrigger placement="right" shouldUpdatePosition={true} overlay={
                        <Popover id={`${this.props.name}-popover`}>
                            {old_value ? (
                                <img style={style} alt={this.props.label}
                                     src={utils.urlFile(old_value, config.urlCdnFile)}/>
                            ) : (
                                <span>non images</span>
                            )}
                        </Popover>
                    }>
                        <div className="icon-rollback-img">
                            <IconButton aria-label="rollback" size="small" onClick={() => {
                                let value = this.state.rollback ? this.state.value_tmp : this.props.old_value;
                                this.props.onChange(value, this.props.name, _.get(this.props, 'item', null));
                                this.setState({rollback: !this.state.rollback});
                            }}>
                                <i className="fs18 pointer icon-transform material-icons">redo</i>
                            </IconButton>
                        </div>
                    </OverlayTrigger>
                )}
                <div className="v-input-picture" style={style} onClick={this.chooseFile}>
                    <div className={classnames("v-input-label", this.state.flag_active ? "flag-active" : "not-active")}>
                        <label className="v-label" htmlFor={this.props.name}>{this.props.label} {this.props.required ?
                            <span className="textRed">*</span> : ""}</label>
                        <div>
                            {!imagePreview && validate?.mustWidth &&
                            <span>{`(${validate?.mustWidth}x${validate?.mustHeight})`}</span>}
                        </div>
                    </div>
                    <div style={style} className={classnames("v-input-content d-flex")}>
                        {imagePreview === null && (
                            <i className="icon-plus glyphicon glyphicon-plus m-auto" style={{lineHeight: "3"}}/>
                        )}
                        <input type="file" name={this.props.name} ref={input => this.inputFile = input}
                               onChange={this.onChange}/>
                        {imagePreview}
                    </div>
                </div>
                {showDeleteImg && imagePreview && (
                    <div className="icon-delete-img pointer" onClick={this.removeImg}>
                        <span aria-hidden="true">×</span>
                    </div>
                )}
                <div className={classnames("v-messages", this.state.flag_error ? "flag-error" : "")}>
                    {msg}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.language,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InputImg);
