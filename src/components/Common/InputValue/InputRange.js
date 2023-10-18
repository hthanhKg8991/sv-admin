import React, {Component} from "react";
import {connect} from "react-redux";
import {OverlayTrigger, Popover} from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import classnames from 'classnames';

function NumberFormatCustom(props) {
    let {inputRef, onChange, prefix, suffix, ...other } = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix={prefix}
            suffix={suffix}
        />
    );
}

class InputRange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            value_1: "",
            value_2: "",
            flag_active: false,
            flag_error: false,
            rollback: false,
            icon_rollback: false,
            value_tmp: null
        };
        this.Ref = React.createRef();
        this.onChangeValue1 = this._onChangeValue1.bind(this);
        this.onChangeValue2 = this._onChangeValue2.bind(this);
        this.onFocus = this._onFocus.bind(this);
        this.onBlur = this._onBlur.bind(this);
    }
    _onChangeValue1(event) {
        let {value_1, value_2} = this.state;
        let value = event.target.value;
        if (this.props.numberOnly){
            let re = /^[0-9\b]+$/;
            if (!(re.test(value) || !value)){
                value = value_1;
            }
        }else{
            value = event.target.value;
        }

        this.setState({value_1: value});
        if (value) {
            this.setState({flag_error: false});
            this.setState({msg: null});
        }
        this.props.onChange([value, value_2], this.props.name);
    }
    _onChangeValue2(event) {
        let {value_1, value_2} = this.state;
        let value = event.target.value;
        if (this.props.numberOnly){
            let re = /^[0-9\b]+$/;
            if (!(re.test(value) || !value)){
                value = value_2;
            }
        }else{
            value = event.target.value;
        }
        this.setState({value_2: value});
        if (value) {
            this.setState({flag_error: false});
            this.setState({msg: null});
        }
        this.props.onChange([value_1, value], this.props.name);
    }

    _onFocus(event){
        this.setState({flag_active: true});
    }
    _onBlur(event){
        this.setState({flag_active: (!(!this.state.value_1 && !this.state.value_2))});
        let flag_error = false;
        let msg = '';
        if (this.props.required && (!this.state.value_1 || !this.state.value_2)) {
            flag_error = true;
            msg = "Thông tin là bắt buộc.";
        }
        this.setState({flag_error: flag_error});
        this.setState({msg: msg});
    }
    componentWillMount(){
        let {value, old_value} = this.props;
        if (value && Array.isArray(value)){
            let is_value_1 = !(value[0] === "" || value[0] === null || value[0] === undefined);
            let is_value_2 = !(value[1] === "" || value[1] === null || value[1] === undefined);
            if (is_value_1 || is_value_2){
                this.setState({flag_active: true});
                this.setState({value_1: value[0]});
                this.setState({value_2: value[1]});
            }
        }
        if (Array.isArray(old_value)){
            if((value[0] !== undefined && value[0] !== null) && (value[1] !== undefined && value[1] !== null)) {
                if (JSON.stringify(old_value) !== JSON.stringify(value)) {
                    this.setState({icon_rollback: true});
                    this.setState({value_tmp: this.props.value});
                }
            }
        }
    }
    componentWillReceiveProps(newProps) {
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
        let {value, old_value, nameFocus, error} = newProps;
        if (error && Array.isArray(error)){
            let is_error_1 = !(error[0] === "" || error[0] === null || error[0] === undefined);
            let is_error_2 = !(error[1] === "" || error[1] === null || error[1] === undefined);
            if (is_error_1 || is_error_2){
                this.setState({msg_1: error[0]});
                this.setState({msg_2: error[1]});
                this.setState({flag_error: true});
            }
        }
        if (value && Array.isArray(value)){
            let is_value_1 = !(value[0] === "" || value[0] === null || value[0] === undefined);
            let is_value_2 = !(value[1] === "" || value[1] === null || value[1] === undefined);
            if (is_value_1 || is_value_2){
                this.setState({flag_active: true});
                this.setState({value_1: value[0]});
                this.setState({value_2: value[1]});
            }
        }
        if (Array.isArray(old_value)){
            if((value[0] !== undefined && value[0] !== null) && (value[1] !== undefined && value[1] !== null)) {
                if (JSON.stringify(old_value) !== JSON.stringify(value)) {
                    this.setState({icon_rollback: true});
                    this.setState({value_tmp: this.props.value});
                }else{
                    // this.setState({icon_rollback: false});
                }
            }
        }
        if (this.props.name.includes(nameFocus)){
            this.Ref.current.focus();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let {label, placeholder, old_value, name, className, isNumber} = this.props;
        let {flag_active, flag_error, icon_rollback, rollback, msg_1, msg_2, value_tmp} = this.state;

        let value_1 = this.state.value_1;
        let value_2 = this.state.value_2;
        msg_1 = this.state.lang.stringError[msg_1] ? this.state.lang.stringError[msg_1] : msg_1;
        msg_2 = this.state.lang.stringError[msg_2] ? this.state.lang.stringError[msg_2] : msg_2;
        if (msg_1){
            msg_1 = label ? msg_1.replace(":attr_name", label) : msg_1.replace(":attr_name", placeholder);
        }
        if (msg_2){
            msg_2 = label ? msg_2.replace(":attr_name", label) : msg_2.replace(":attr_name", placeholder);
        }
        let old_title = '';
        if (old_value && Array.isArray(old_value)) {
            old_value = !rollback ? old_value : value_tmp;
            old_title = `${old_value[0]} - ${old_value[1]}`;
        }

        let InputProps = {};
        if (isNumber){
            InputProps.inputComponent = NumberFormatCustom;
        }

        return(
            <div className={classnames("input-range", icon_rollback && !rollback ? "flag-warning" : "")}>
                <div style={{display: "inline-block", width: '50%'}} className={classnames("v-textfield paddingRight5", flag_active ? "flag-active" : "", icon_rollback && !rollback ? "flag-warning" : "")}>
                    <TextField type='text' id={name[0]} className={className} label={label} helperText={msg_1}
                               error={flag_error} value={value_1 || ''}
                               onChange={this.onChangeValue1}
                               onBlur={this.onBlur}
                               onFocus={this.onFocus}
                               onKeyDown={this.onKeyDown}
                               InputProps={InputProps}
                               inputProps={{prefix: this.props.prefix, suffix: this.props.suffix}}

                               inputRef={this.Ref}
                    />
                </div>
                <div style={{display: "inline-block", width: '50%'}} className={classnames("v-textfield paddingLeft5", flag_active ? "flag-active" : "", icon_rollback && !rollback ? "flag-warning" : "")}>
                    <TextField type='text' id={name[1]} className={className} label="&nbsp;" helperText={msg_2}
                               error={flag_error} value={value_2 || ''}
                               onChange={this.onChangeValue2}
                               onBlur={this.onBlur}
                               onFocus={this.onFocus}
                               onKeyDown={this.onKeyDown}
                               InputProps={InputProps}
                               inputProps={{prefix: this.props.prefix, suffix: this.props.suffix}}

                    />
                </div>
                {icon_rollback && (
                    <OverlayTrigger placement="top" shouldUpdatePosition={true} overlay={
                        <Popover id={`${name[0] + name[1]}-popover`}>{old_title}</Popover>
                    }>
                        <div className="icon-rollback-img">
                            <IconButton aria-label="rollback" size="small" onClick={()=>{
                                let value = rollback ? value_tmp : old_value;
                                this.props.onChange([value[0],value[1]], name);
                                this.setState({rollback: !rollback});
                            }}>
                                <i className="fs18 pointer icon-transform material-icons">redo</i>
                            </IconButton>
                        </div>
                    </OverlayTrigger>
                )}
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

export default connect(mapStateToProps,mapDispatchToProps)(InputRange);
