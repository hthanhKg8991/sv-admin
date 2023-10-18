import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import {TimePicker} from "@material-ui/pickers";

class TimePickerCom extends Component {
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
    }
    _onChange(value) {
        let Step = this.props.Step;
        if (value && Step){
            let minutes = value.minutes();
            if (minutes > 0 && (minutes < Step || minutes%Step > 0)){
                value.minute(minutes + (Step - minutes%Step));
            }
        }
        this.setState({value: value});
        let flag_active = false;
        let flag_error = false;
        let msg = '';
        if (value){
            flag_active = true;
            this.props.onChange(value, this.props.name);
        }else{
            if (this.state.required){
                flag_error = true;
                msg = "Thông tin là bắt buộc.";
            }
        }
        this.setState({flag_active: flag_active});
        this.setState({flag_error: flag_error});
        this.setState({msg: msg});
    }
    componentWillMount(){
        let value = this.props.value;
        let is_value = !(value === "" || value === null || value === undefined);
        this.setState({flag_active: is_value});
        this.setState({value: is_value ? value : null});

        let old_value = this.props.old_value;
        let is_ovalue = !(old_value === null || old_value === undefined);
        if (is_ovalue && old_value !== value && value !== undefined && value !== null){
            this.setState({icon_rollback: true});
            this.setState({value_tmp: this.props.value});
        }
    }
    componentWillReceiveProps(newProps) {
        let value = newProps.value;
        let is_value = !(value === "" || value === null || value === undefined);
        this.setState({flag_active: is_value});
        this.setState({value: is_value ? value : null});

        if (newProps.error){
            this.setState({flag_error: true});
            this.setState({msg: newProps.error});
        }
        if (newProps.nameFocus === this.props.name){
            this.Ref.current.focus();
        }
        let old_value = newProps.old_value;
        let is_ovalue = !(old_value === null || old_value === undefined);
        if (is_ovalue && old_value !== value){
            this.setState({icon_rollback: true});
            this.setState({value_tmp: newProps.value});
        }
        this.setState({required: newProps.required});
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    render() {
        let {lang, value, rollback, icon_rollback, value_tmp, required, msg, flag_active, flag_error} = this.state;
        msg = lang.stringError[msg] ? lang.stringError[msg] : msg;
        if (msg){
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            }else{
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let old_value = !rollback ? this.props.old_value: value_tmp;
        let label = <React.Fragment>{this.props.label} {required ? <span className="textRed">*</span> : ""}</React.Fragment>;
        if (this.props.readOnly){
            return(
                <div className="v-input">
                    <div className={classnames("v-input-control", flag_active ? "flag-active" : "", icon_rollback && !rollback ? "flag-warning" : "")}>
                        <div className="v-input-slot">
                            <label className="v-label" htmlFor={this.props.name}>
                                {label}
                            </label>
                            <input type="text" className={this.props.className} placeholder={this.props.placeholder} value={value} readOnly/>
                        </div>
                    </div>
                </div>
            )
        }
        return(
            <div className={classnames("v-textfield", flag_active ? "flag-active" : "", icon_rollback && !rollback ? "flag-warning" : "")}>
                <TimePicker id={this.props.name} className={this.props.className} label={label} helperText={msg} autoOk
                                    ampm={false}
                                    error={flag_error}
                                    value={value}
                                    onChange={this.onChange}
                                    onFocus={this.onFocus}
                                    minutesStep={this.props.Step ? this.props.Step : 1}
                                    inputRef={this.Ref}
                />
                {icon_rollback && (
                    <div className="v-input-icon">
                        <OverlayTrigger placement="top" shouldUpdatePosition={true} overlay={
                            <Popover id={`${this.props.name}-popover`}>{old_value}</Popover>
                        }>
                            <IconButton aria-label="rollback" size="small" style={{bottom:"25px", right:"13px"}} onClick={()=>{
                                let value = rollback ? value_tmp : this.props.old_value;
                                this.props.onChange(value, this.props.name);
                                this.setState({rollback: !rollback});
                            }}>
                                <i className="fs18 pointer icon-transform material-icons">redo</i>
                            </IconButton>
                        </OverlayTrigger>
                    </div>
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


export default connect(mapStateToProps)(TimePickerCom);
