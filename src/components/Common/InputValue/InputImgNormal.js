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

class InputImgNormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            imagePreviewUrl: null,
            flag_active: false,
            flag_error: false,
            msg: null,
            validateType:["image/gif", "image/jpeg", "image/png","image/jpg"],
            rollback: false,
            icon_rollback: false,
            value_tmp: null,
        };
        this.chooseFile = this._chooseFile.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _chooseFile(event) {
        this.inputFile.click();
    }

    checkValidateDimension(file, dimension) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                const imageObj = new Image();
                imageObj.src = e.target?.result;
                imageObj.onload = function() {
                    const { height, width } = this;
                    if (
                        height < dimension.height ||
                        width < dimension.width
                    ) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                };
            };
        });
    };

    async _onChange(event) {
        if (event.target.files.length) {
            let file = event.target.files[0];
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
            if(this.props.dimension) {
                const isValidDimension = await this.checkValidateDimension(file, this.props.dimension);
                if(!isValidDimension) {
                    this.setState({flag_error: true});
                    this.setState({msg: `File không đúng kích thước hình ảnh (${this.props.dimension.width}x${this.props.dimension.height}px)`});
                    return;
                }
            }
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
        }
    }

    setError(error) {
        if (error) {
            this.setState({flag_error: true});
            this.setState({msg: error});
        }
    }

    componentWillMount(){
        let value = this.props.value;
        let is_value = !(value === "" || value === null || value === undefined);
        if (is_value){
            this.setState({imagePreviewUrl: utils.urlFile(this.props.value, config.urlCdnFile)});
            this.setState({flag_active: true});
        }
        let old_value = this.props.old_value;
        if (old_value !== undefined && old_value !== value && value !== undefined && value !== null){
            this.setState({icon_rollback: true});
            this.setState({value_tmp: this.props.value});
        }

        this.setError(this.props.error);
    }

    componentWillReceiveProps(newProps) {
        let value = newProps.value;
        let flag_error = false;
        let msg = '';
        let imagePreviewUrl = this.state.imagePreviewUrl ? this.state.imagePreviewUrl : value;

        if (this.props.name && newProps.nameFocus === this.props.name){
            flag_error = true;
            msg = 'Thông tin là bắt buộc.';
        }
        if (newProps.error){
            flag_error = true;
            msg = newProps.error;
        }
        let old_value = newProps.old_value;
        if (old_value !== undefined && value !== undefined && value !== null){
            if(old_value !== value) {
                this.setState({icon_rollback: true});
                this.setState({value_tmp: newProps.value});
            }
        }
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }

        let is_value_changed = (this.props.value !== newProps.value);
        if (is_value_changed){
            if (!newProps.value) {
                this.setState({imagePreviewUrl: null});
            }
            imagePreviewUrl = utils.urlFile(newProps.value, config.urlCdnFile);
        }

        if (newProps.api[ConstantURL.API_URL_UPLOAD_IMAGE]){
            let response = newProps.api[ConstantURL.API_URL_UPLOAD_IMAGE];
            if (response.info?.args?.name === this.props.name) {
                if (response.code === Constant.CODE_SUCCESS) {
                    if (this.props.onChange && response.data) {
                        this.props.onChange({path: response.data.path_file, url: response.data.url}, this.props.name, _.get(this.props, 'item', null));
                    }
                    this.inputFile.value = null;
                    imagePreviewUrl = utils.urlFile(response.data.url, config.urlCdnFile);
                }
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_UPLOAD_IMAGE);
            }
        }

        if(imagePreviewUrl) {
            if(newProps.isDeleted !== this.props.isDeleted && newProps.isDeleted){
                imagePreviewUrl = null;
            }

            this.setState({imagePreviewUrl: imagePreviewUrl});
            this.setState({flag_active: true});
        }
        this.setState({flag_error: flag_error, msg: msg});


        this.setError(newProps.error);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let class_error = this.state.icon_rollback && !this.state.rollback ? "flag-warning" : "";
        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        if (msg){
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            }else{
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let style = {
            width:(this.props.width)+"px",
            height:(this.props.height)+"px",
            borderRadius : (this.props.is_avatar ? (this.props.width+2)/2 : null )
        };
        if (this.props.style) {
            if (this.props.style.width) {
                style.width = this.props.style.width;
            }
            if (this.props.style.height) {
                style.height = this.props.style.height;
            }
        }
        let imagePreviewUrl = this.state.imagePreviewUrl;
        let old_value = this.state.value_tmp === this.props.value ? this.props.old_value: imagePreviewUrl;
        let url = this.state.value_tmp === this.props.value ? imagePreviewUrl : (this.props.old_value || old_value);
        let imagePreview = url ? <img style={style} alt={this.props.label} src={url} /> : null;

        return(
            <div className={classnames("v-input",class_error)}>
                {this.state.icon_rollback && (
                    <OverlayTrigger placement="right" shouldUpdatePosition={true} overlay={
                        <Popover id={`${this.props.name}-popover`}>
                            {old_value ? (
                                <img style={style} alt={this.props.label} src={utils.urlFile(old_value, config.urlCdnFile)} />
                            ) : (
                                <span>non images</span>
                            )}
                        </Popover>
                    }>
                        <div className="icon-rollback-img">
                            <IconButton aria-label="rollback" size="small" onClick={()=>{
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
                    <div className={classnames("v-input-label",this.state.flag_active ? "flag-active" : "not-active")}>
                        <label className="v-label" htmlFor={this.props.name}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                    </div>
                    <div className={classnames("h100 v-input-content overflow-hidden")} style={{display: "flex"}}>
                        {(imagePreview === null) && (
                            <i className="icon-plus glyphicon glyphicon-plus" style={{margin: "auto"}}/>
                        )}
                        <input type="file" name={this.props.name} ref={input => this.inputFile = input} onChange={this.onChange}/>
                        {imagePreview}
                    </div>
                </div>
                <div className={classnames("v-messages mt5", this.state.flag_error ? "flag-error" : "")}>
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

export default connect(mapStateToProps,mapDispatchToProps)(InputImgNormal);
