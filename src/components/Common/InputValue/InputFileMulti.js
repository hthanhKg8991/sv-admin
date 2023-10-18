import React, {Component} from "react";
import classnames from 'classnames';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {uploadFileV2} from "api/cdn";
import config from "config";

class InputFileMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            lang: props.lang,
            previewUrl: null,
            fileType: null,
            flag_active: false,
            flag_error: false,
            msg: null,
        };
        this.chooseFile = this._chooseFile.bind(this);
        this.deleteFile = this._deleteFile.bind(this);
        this.onChange = this._onChange.bind(this);
        this.setOnChange = this._setOnChange.bind(this);
    }

    _chooseFile(event) {
        this.inputFile.click();
    }

    _deleteFile(index) {
        const {files} = this.state;
        files.splice(index, 1);
        this.setState({files});
        this.setOnChange();
    }

    _setOnChange() {
        this.props.onChange(this.state.files.map(i => i.path_file), this.props.name);
    }

    async _onChange(event) {
        let file = event.target.files[0];
        if (!file) {
            this.setState({flag_error: true});
            this.setState({msg: `File không hợp lê. File phải có định dạng ${this.props.validateType.join(', ')} và dung lượng <= ${this.props.maxSize}MB`});
            return;
        }
        const {name, size} = file;
        const type = name.split(".").pop();
        if ((this.props.maxSize && size > this.props.maxSize * 1024 * 1024) || !this.props.validateType.includes(type)) {
            this.setState({flag_error: true});
            this.setState({msg: `File không hợp lê. File phải có định dạng ${this.props.validateType.join(', ')} và dung lượng <= ${this.props.maxSize}MB`});
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
            this.setState({files: [...this.state.files, res]});
        }
        this.inputFile.value = null;
        this.setOnChange();
    }

    componentWillMount() {
        if (this.props.value && Array.isArray(this.props.value)) {

            this.setState({
                files: this.props.value.map(i => ({
                    url: config.urlCdnFile + i,
                    path_file: i,
                }))
            });
        }
    }

    render() {
        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        if (msg) {
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            } else {
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        const {files} = this.state;
        return (
            <div className="v-input">
                <div
                    className={classnames("v-input-label", this.state.flag_active ? "flag-active" : "flag-active", this.state.flag_error ? "flag-error" : "")}>
                    <label className="v-label" htmlFor={this.props.name}>{this.props.label} {this.props.required ?
                        <span className="textRed">*</span> : ""}</label>
                    <input type="file" name="file" className="hidden" ref={input => this.inputFile = input}
                           onChange={this.onChange}/>
                </div>

                <div className={classnames("v-input-content")} onClick={this.chooseFile}>
                    <span
                        className="text-underline text-bold text-primary pointer mb5">Chọn File</span>
                </div>


                {this.state.loading ? (
                    <div className="v-input-content text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <>
                        {
                            files.map((item, idx) => (
                                <div key={idx} className={classnames("v-input-content pointer")}>
                                    <div>
                                        {item && <>Tải file: <a
                                            target="_blank" rel="noopener noreferrer"
                                            href={item.url}>Tại đây</a></>} | <span>{item.url?.split("/").pop()}</span> |
                                        <span className="pointer text-bold text-primary"
                                              onClick={() => this.deleteFile(idx)}>Xóa file</span>
                                    </div>
                                </div>
                            ))
                        }
                    </>

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

export default connect(mapStateToProps, mapDispatchToProps)(InputFileMulti);
