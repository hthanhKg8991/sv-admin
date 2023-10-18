import React from 'react';
import { CKEditor } from 'ckeditor4-react';

import {connect} from "react-redux";
import classnames from 'classnames';

CKEditor.editorUrl = 'https://cdn.ckeditor.com/4.15.0/full-all/ckeditor.js';

class Ckeditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lang: props.lang,
            flag_active: false,
            flag_error: false,
            msg: null,
            value: props.value,
        };
        this.Ref = React.createRef();
        this.onBlur = this._onBlur.bind(this);
        this.onFocus = this._onFocus.bind(this);
    }
    _onBlur(){
        this.setState({flag_active: !!this.state.value});
        let flag_error = false;
        let msg = null;
        if (this.props.required &&!this.state.value) {
            flag_error = true;
            msg = "Thông tin là bắt buộc.";
        }
        this.setState({flag_error});
        this.setState({msg});
    }
    _onFocus(){
        this.setState({flag_active: true});
    }
    componentWillMount(){
        this.setState({flag_active: !!this.props.value});
    }
    componentWillReceiveProps(newProps) {
        if (newProps.error){
            this.setState({flag_error: true});
            this.setState({msg: newProps.error});
        }
        if (newProps.value !== this.state.value){
            this.setState({value: newProps.value});
            this.setState({flag_active: !!newProps.value});
        }
        if (newProps.nameFocus === this.props.name){

        }
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render(){
        let class_msg = "";
        let class_error = this.state.flag_active ? "flag-active" : "";
        if (this.state.flag_error){
            class_error = class_error + " flag-error";
            class_msg = "v-messages-error"
        }
        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        if (msg){
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            }else{
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let config = {
            toolbar:this.props.toolbar,
            allowedContent: true
        };
        if(this.props.height){
            config.height = this.props.height;
        }
        return(
            <div className="v-input mt20">
                <div className={classnames("v-input-control",class_error)}>
                    <div className="v-input-slot">
                        <label className="v-label default-active fs18" style={{top: 0}} htmlFor={this.props.name}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                        <CKEditor onBlur={this.onBlur}
                             onFocus={this.onFocus}
                                  initData={this.state.value}
                             data={this.state.value}
                             config={config}
                             onChange={(evt) => {
                                 let value = evt.editor.getData();
                                 this.setState({value: value});
                                 if (this.props.onChange){
                                     this.props.onChange(value, this.props.name);
                                 }
                             }}
                             ref={this.Ref}
                        />
                    </div>
                    <div className={classnames("v-messages", class_msg)}>
                        {msg}
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        lang: state.language
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Ckeditor);
