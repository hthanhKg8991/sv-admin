import React, {Component} from "react";
import classnames from 'classnames';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as utils from "utils/utils";

class InputFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file_name:"",
            lang: props.lang,
            previewUrl: null,
            fileType: null,
            flag_active: false,
            flag_error: false,
            msg: null,
        };
        this.chooseFile = this._chooseFile.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _chooseFile(event) {
        this.inputFile.click();
    }

    _onChange(event) {
        let file = event.target.files[0];
        if(!file){
            this.setState({flag_error: true});
            this.setState({msg: `File không hợp lê. File phải có định dạng ${this.props.validateType.join(', ')} và dung lượng <= ${this.props.maxSize}MB`});
            return;
        }
        const {name,size} = file;
        const type = name.split(".").pop();
        if ((this.props.maxSize && size > this.props.maxSize*1024*1024) || !this.props.validateType.includes(type)){
            this.setState({flag_error: true});
            this.setState({msg: `File không hợp lê. File phải có định dạng ${this.props.validateType.join(', ')} và dung lượng <= ${this.props.maxSize}MB`});
            return;
        }
        let folder = this.props.folder ? this.props.folder : "default";
        let data = new FormData();
        data.append('folder', folder);
        data.append('image', file);
        data.append('name', name);

        if (this.props.isMergeFile){
            this.setState({file_name: file.name});
            this.props.onChange(file, this.props.name);
            return;
        }
        let args = {up_file: true, file: data, name: this.props.name};
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiCdnDomain, ConstantURL.API_URL_POST_UPLOAD_FILE, args);
        this.setState({loading: true});
    }

    componentWillMount(){
        if (this.props.value){
            this.setState({previewUrl: utils.urlFile(this.props.value, config.urlCdnFile)});
            this.setState({fileType: this.props.value?.substr(this.props.value.indexOf('.') + 1)});
            this.setState({flag_active: true});
        }
    }

    componentWillReceiveProps(newProps) {
        let value = newProps.value;
        let flag_error = false;
        let msg = '';
        let previewUrl = this.state.previewUrl ? this.state.previewUrl : value;
        if (this.props.name && newProps.nameFocus === this.props.name){
            flag_error = true;
            msg = 'Thông tin là bắt buộc.';
        }
        if (newProps.error){
            flag_error = true;
            msg = newProps.error;
        }
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
        if (newProps.api[ConstantURL.API_URL_POST_UPLOAD_FILE]){
            let response = newProps.api[ConstantURL.API_URL_POST_UPLOAD_FILE];
            if (response.info?.args?.name === this.props.name) {
                if (response.code === Constant.CODE_SUCCESS) {
                    if (this.props.onChange && response.data) {
                        this.props.onChange(response.data.path_file, this.props.name);
                    }
                    this.inputFile.value = null;
                    previewUrl = utils.urlFile(response.data.url, config.urlCdnFile);
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_UPLOAD_FILE);
            }
        }
        if(previewUrl) {
            this.setState({previewUrl: previewUrl});
            this.setState({flag_active: true});
        }
        this.setState({flag_error: flag_error});
        this.setState({msg: msg});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        let fileUrl = this.props?.file_url;
        if (msg){
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            }else{
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let type_no_support = ['doc', 'jpg', 'xls'];
        return(
            <div className="v-input">
                <div className={classnames("v-input-label",this.state.flag_active ? "flag-active" : "", this.state.flag_error ? "flag-error" : "")}>
                    <label className="v-label" htmlFor={this.props.name}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                    <input type="file" name="file" className="hidden" ref={input => this.inputFile = input} onChange={this.onChange}/>
                </div>
                {(this.props.isMergeFile) ? (
                    <div className={classnames("v-input-content")} onClick={this.chooseFile}>
                        <span className="text-underline text-bold text-primary pointer">{(this.state.file_name)? this.state.file_name : 'Chọn File'}</span>
                    </div>
                ) : (
                    <React.Fragment>
                    {this.state.loading ? (
                        <div className="v-input-content text-center">
                            <LoadingSmall />
                        </div>
                    ) : (
                     <>
                         {type_no_support.includes(this.state.fileType) ? (
                             <div>
                                 <div>
                                     {(fileUrl || this.state.previewUrl) && <>Tải file: <a target="_blank" rel="noopener noreferrer" href={fileUrl || this.state.previewUrl}>Tại đây</a></>} |
                                     <span className="pointer text-bold text-primary" onClick={this.chooseFile}>{(fileUrl || this.state.previewUrl) ? "Thay file" : "Chọn file" }</span>
                                 </div>
                             </div>
                         ) : (
                             <div className={classnames("v-input-content pointer")}>
                                 {this.state.previewUrl !== null && (
                                     <div>
                                         <div>
                                             {(fileUrl || this.state.previewUrl) && <>Tải file: <a target="_blank" rel="noopener noreferrer" href={fileUrl || this.state.previewUrl}>Tại đây</a></>} |
                                             <span className="pointer text-bold text-primary" onClick={this.chooseFile}>{(fileUrl || this.state.previewUrl) ? "Thay file" : "Chọn file" }</span>
                                         </div>
                                         {/*<FileViewer fileType={this.state.fileType} filePath={this.state.previewUrl}/>*/}
                                     </div>
                                 )}
                                 {(this.state.previewUrl === null && (
                                     <>Tải file: <span className="text-link" onClick={this.chooseFile}>Choose file</span></>
                                 ))}
                             </div>
                         )}
                    </>
                    )}
                    </React.Fragment>
                )}
                <div className={classnames("v-messages mt5", this.state.flag_error ? "flag-error" : "")}>
                    {msg}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        api: state.api,
        lang: state.language
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(InputFile);
