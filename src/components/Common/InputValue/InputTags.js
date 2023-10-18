import React, {Component} from "react";
import classnames from 'classnames';
import {connect} from "react-redux";
import moment from 'moment/moment';
import * as utils from "utils/utils";
class InputTags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            flag_error: false,
            msg: null,
            value: null,
            flag_active: false,
            keyPress: props.keyPress ? props.keyPress : ['Enter','Tab'],
        };
        this.onFocus = this._onFocus.bind(this);
        this.onBlur = this._onBlur.bind(this);
        this.onAddValue = this._onAddValue.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.focusInput = this._focusInput.bind(this);
    }
    _focusInput(event){
        this.Input.focus();
        this.setState({flag_active: true});
    }
    _onFocus(event){
        this.setState({flag_active: true});
    }
    _onBlur(event){
        this.setState({flag_active: (!!this.state.value.length || !!this.Input.value)});

        if(!!this.Input.value){
            this.onAddValue(event, true);
            return;
        }

        if (this.props.required && !this.state.value.length) {
            this.setState({flag_error: true, msg: "Thông tin là bắt buộc"});
        }
    }
    _onAddValue(event, onBlur = false){
        let {value, keyPress} = this.state;
        let value_input = this.Input.value;
        let newValue = [...value];
        if (keyPress.includes(event.key) || onBlur) {
            if(this.props.isEmail && !utils.validateEmailV2(value_input) && value_input !== ""){
                this.setState({flag_error: true, msg: "Định dạnh email không hợp lệ"});
                return
            }
            if (!value.includes(value_input) && value_input !== ""){
                newValue.push(value_input);
            }
            if (this.props.onChange){
                this.props.onChange(newValue, this.props.name);
            }
            setTimeout(() => {
                this.Input.value = null;
                this.focusInput();
            }, 1);
        }
        if (event.key === 'Backspace' && value_input === "" && value.length){
            newValue = newValue.filter(c => c !== newValue[newValue.length - 1]);
            if (this.props.onChange){
                this.props.onChange(newValue);
            }
        }
        this.setState({
            value: newValue, 
            flag_error: false,
            msg :"", 
            cheat: moment().unix() + Math.random()
        });
    }
    _onDelete(item){
        let value = this.state.value;
        value = value.filter(c => c !== item);
        this.setState({value: value});
        if (this.props.onChange){
            this.props.onChange(value, this.props.name);
        }
    }

    componentWillMount(){
        let value = this.props.value;
        let is_value = !(value === "" || value === null || value === undefined);
        if(is_value){
            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            };

            this.setState({flag_active: is_value, value : value.filter( unique )});
        }
    }

    componentDidMount(){

    }

    componentWillReceiveProps(newProps) {
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
        if (!(JSON.stringify(newProps.value) === JSON.stringify(this.state.value))){
            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            };
            this.setState({value: newProps.value.filter( unique )});
        }
        if (newProps.nameFocus === this.props.name){
            this.focusInput();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextProps) === JSON.stringify(this.props)) || !(JSON.stringify(nextState) === JSON.stringify(this.state)) ;
    }

    render() {
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

        return(
            <div className="v-input">
                <div className={"v-input-control " + class_error}>
                    <div className="v-input-slot" onClick={this.focusInput}>
                        <label className="v-label" htmlFor={this.props.name} onClick={this.focusInput}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                        <div className="divInputTags">
                            {this.state.value.map((item, key) => {
                                return(
                                    <div className="divTags" key={key}>
                                        <div className="divTags-content">{item}</div>
                                        <div className="divTags-delete" onClick={()=>{this.onDelete(item)}}>
                                            <svg height="14" width="14" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-tj5bde-Svg">
                                                <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"/>
                                            </svg>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="divInput">
                                <input type={this.state.showPass ? "text" : this.props.type}
                                       name={this.props.name}
                                       id={this.props.name}
                                       className={this.props.className}
                                       onFocus={this.onFocus}
                                       onBlur={this.onBlur}
                                       ref={(input) => { this.Input = input; }}
                                       placeholder={this.props.placeholder}
                                       onKeyDown={this.onAddValue}
                                />
                            </div>
                        </div>
                    </div>
                    {(this.props.no_msg === null || !this.props.no_msg) && (
                        <div className={classnames("v-messages", !class_msg && this.props.hidden_error_non ? "hidden" : class_msg)}>
                            {msg}
                        </div>
                    )}
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

export default connect(mapStateToProps,mapDispatchToProps)(InputTags);
