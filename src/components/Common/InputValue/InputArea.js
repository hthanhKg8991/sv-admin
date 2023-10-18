import React, {Component} from "react";
import {connect} from "react-redux";
import {OverlayTrigger, Popover} from 'react-bootstrap';
import classnames from 'classnames';
import IconButton from '@material-ui/core/IconButton';

class InputArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            value: "",
            flag_active: false,
            flag_error: false,
            msg: null,
            rollback: false,
            icon_rollback: false,
            value_tmp: null
        };
        this.Ref = React.createRef();
        this.onChange = this._onChange.bind(this);
        this.onFocus = this._onFocus.bind(this);
        this.onBlur = this._onBlur.bind(this);
    }
    _onChange(event) {
        let value = event.target.value;
        this.setState({value: value});
        this.props.onChange(value, this.props.name);
        if (this.state.value && this.props.required) {
            this.setState({flag_error: false});
            this.setState({msg: null});
        }
    }
    _onFocus(event){
        this.setState({flag_active: true});
        this.Ref.current.focus();
    }
    _onBlur(event){
        this.setState({flag_active: !!this.state.value});
        if (this.props.required) {
            if (!this.state.value) {
                this.setState({flag_error: true});
                this.setState({msg: "Thông tin là bắt buộc"});
            } else {
                this.setState({flag_error: false});
                this.setState({msg: null});
            }
        }
    }
    componentWillMount(){
        let value = this.props.value;
        let is_value = !(value === "" || value === null || value === undefined);
        this.setState({flag_active: is_value});
        this.setState({value: is_value ? value : ''});

        let old_value = this.props.old_value;
        if (old_value !== undefined && old_value !== value && value !== undefined && value !== null){
            this.setState({icon_rollback: true});
            this.setState({value_tmp: this.props.value});
        }
    }
    componentWillReceiveProps(newProps) {
        let value = newProps.value;
        let is_value = !(value === "" || value === null || value === undefined);
        this.setState({flag_active: is_value});
        if (newProps.error){
            this.setState({flag_error: true});
            this.setState({msg: newProps.error});
        }
        this.setState({value: is_value ? value : ''});
        if (newProps.nameFocus === this.props.name){
            this.Ref.current.focus();
        }
        let old_value = newProps.old_value;
        if (old_value !== undefined && value !== undefined && value !== null){
            if(old_value !== value) {
                this.setState({icon_rollback: true});
                this.setState({value_tmp: value});
            }else{
                // this.setState({icon_rollback: false});
            }
        }
        this.setState({required: newProps.required});
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
    }
    render() {
        let class_msg = "";
        let class_error = this.state.flag_active ? "flag-active" : "";
        if (this.state.flag_error){
            class_error = class_error + " flag-error";
            class_msg = "v-messages-error"
        }
        class_error = this.state.icon_rollback && !this.state.rollback ? class_error + " flag-warning" : class_error;

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
                <div className={classnames("v-input-control " + class_error, this.props.readOnly ? "flag-readonly" : "")}>
                    <div className="v-input-slot">
                        <label className="v-label" htmlFor={this.props.name} onClick={this.onFocus}>{this.props.label} {this.props.required ? <span className="textRed">*</span> : ""}</label>
                        {this.props.icon && (
                            <i className={this.props.icon}/>
                        )}
                        {this.state.icon_rollback && !this.props.readOnly && (
                            <OverlayTrigger placement="top" shouldUpdatePosition={true} overlay={
                                <Popover id={`${this.props.name}-popover`}>{!this.state.rollback ? this.props.old_value: this.state.value_tmp}</Popover>
                            }>
                                <div className="icon-rollback-img right0">
                                    <IconButton aria-label="rollback" size="small" onClick={()=>{
                                        let value = null;
                                        if (this.state.rollback){
                                            value = this.state.value_tmp;
                                        }else{
                                            value = this.props.old_value;
                                        }
                                        this.props.onChange(value, this.props.name);
                                        this.setState({rollback: !this.state.rollback});
                                    }}>
                                        <i className="fs18 pointer icon-transform material-icons">redo</i>
                                    </IconButton>
                                </div>
                            </OverlayTrigger>
                        )}
                        <textarea
                                name={this.props.name}
                                id={this.props.name}
                                className={this.props.className}
                                value={this.state.value}
                                onChange={this.onChange}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                autoFocus={this.props.autoFocus}
                                placeholder={this.props.placeholder}
                                autoComplete={this.props.autoComplete}
                                disabled={this.props.disabled}
                                readOnly={this.props.readOnly}
                                style={this.props.style}
                                ref={this.Ref}
                        />
                    </div>
                    <div className={"v-messages " + class_msg}>
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

export default connect(mapStateToProps,mapDispatchToProps)(InputArea);
