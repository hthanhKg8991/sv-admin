import React, {Component} from "react";
import * as utils from "utils/utils";
import classnames from 'classnames';
import TextField from '@material-ui/core/TextField';
import {connect} from "react-redux";

class InputCurrency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            flag_active: false,
            flag_error: false,
            msg: null,
            isShowPass: false, //1 show, 0 hide
            lang: props.lang,
            rollback: false,
            icon_rollback: false,
            value_tmp: null,
            required: props.required
        };
        this.Ref = React.createRef();
        this.onChange = this._onChange.bind(this);
        this.onBlur = this._onBlur.bind(this);
        this.onFocus = this._onFocus.bind(this);
        this.onKeyDown = this._onKeyDown.bind(this);
    }
    _onChange(event) {
        let value = (event?.target?.value || "").replace(/[^0-9]/g, "")
        let old_value = this.state.value;
        let re = /^[0-9]{1,9}$/;
        if (value && !re.test(value)){
            value = old_value;
        }
        if (value) {
            this.setState({flag_error: false});
            this.setState({msg: null});
        }
        this.setState({value: value},() => {
            if (this.props.onChange && value !== old_value) {
                if (this.props.timeOut) {
                    setTimeout(() => {
                        if (this.state.value === value) {
                            this.props.onChange(value, this.props.name);
                        }
                    }, this.props.timeOut)
                } else {
                    this.props.onChange(value, this.props.name);
                }
            }
        });

    }
    _onFocus(){
        this.setState({flag_active: true});
    }
    _onBlur(){
        const {error} = this.props;
        let value = this.state.value;
        let flag_error = false;
        let msg = '';
        let is_value = !(value === "" || value === null || value === undefined);
        if (this.state.required && !is_value) {
            flag_error = true;
            msg = "Thông tin là bắt buộc";
        } else if (error) {
            flag_error = true;
            msg = error;
        }
        
        this.setState({flag_active: is_value});
        this.setState({flag_error: flag_error});
        this.setState({msg: msg});
    }
    _onKeyDown(event){
        if (event.key === 'Enter' && this.props.onEnter){
            let value = event.target.value;
            this.Ref.current.blur();
            this.props.onEnter(value, this.props.name);
        }
    }
    componentWillMount(){
        let value = this.props.value;
        let is_value = !(value === "" || value === null || value === undefined);
        this.setState({flag_active: is_value});
        this.setState({value: is_value ? value : ''});
    }
    componentWillReceiveProps(newProps) {
        let value = newProps.value;
        let is_value = !(value === "" || value === null || value === undefined);
        this.setState({flag_active: is_value});
        if (newProps.error){
            this.setState({flag_error: true});
            this.setState({msg: newProps.error});
        } else {
            this.setState({flag_error: false});
            this.setState({msg: newProps.error});
        }
        
        this.setState({value: is_value ? value : ''});
        if (newProps.nameFocus === this.props.name){
            this.Ref.current.focus();
        }
        this.setState({required: newProps.required});
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let {lang, required, flag_active, flag_error} = this.state;
        let msg = lang.stringError[this.state.msg] ? lang.stringError[this.state.msg] : this.state.msg;
        if (msg){
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            }else{
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let value = this.state.value === undefined || this.state.value === null ? '' : this.state.value;
        let label = <React.Fragment>{this.props.label} {this.props.label && required ? <span className="textRed">*</span> : ""}</React.Fragment>;
        let inputProps = {prefix: this.props.prefix, suffix: this.props.suffix};
        if (this.props.readOnly){
            return(
                <div className="v-input">
                    <div className={classnames(
                        "v-input-control flag-readonly",
                        flag_active ? "flag-active" : "",
                    )}>
                        <div className="v-input-slot">
                            <label className="v-label" htmlFor={this.props.name}>
                                {label}
                            </label>
                            <input 
                                type="text" 
                                className={this.props.className} 
                                placeholder={this.props.placeholder} 
                                value={value ? utils.formatNumberVer2(value) : ""} 
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            )
        }

        const {offAutoComplete, name} =this.props;
        let autoComplete;
        if(offAutoComplete){
            autoComplete = "new-" + name;
        }
        return(
            <div className={classnames(
                "v-textfield",
                flag_active ? "flag-active" : "",
            )}>
                <TextField type="text" 
                    id={this.props.name} 
                    className={this.props.className} 
                    placeholder={this.props.placeholder} 
                    label={label} helperText={msg}
                    error={flag_error} value={value ? utils.formatNumberVer2(value) : ""}
                    onChange={this.onChange}
                    autoComplete={autoComplete}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    onKeyDown={this.onKeyDown}
                    inputProps={inputProps}
                    // eslint-disable-next-line
                    inputRef={this.Ref}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.language
    };
}


export default connect(mapStateToProps)(InputCurrency);
