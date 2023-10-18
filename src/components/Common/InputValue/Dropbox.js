import React, {Component} from "react";
import {connect} from "react-redux";
import ReactSelect from 'react-select';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import _ from "lodash";

class Dropbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            value: "",
            title: "",
            titleDefault: "",
            flag_active: false,
            flag_open: false,
            flag_error: false,
            msg: "",
            showPass: 0, //1 show, 0 hide
            list_item: props.data,
            key_value: "value",
            key_title: "title",
            waiting: false, //danh dau dang waiting search
            timeOutTitle: '',
            rollback: false,
            icon_rollback: false,
            value_tmp: null,
            required: props.required,
            isShowIconDelete: true
        };
        this.Ref = React.createRef();
        this.onFocus = this._onFocus.bind(this);
        this.onBlur = this._onBlur.bind(this);
        this.onChange = this._onChange.bind(this);
        this.iconDeleteClick = this._iconDeleteClick.bind(this);
        this.onSelectChange = this._onSelectChange.bind(this);
    }
    _onChange(value) {
        if (this.props.onChangeTimeOut) {
            this.setState({timeOutTitle: value});
            setTimeout(() => {
                if (value && this.state.timeOutTitle === value) {
                    this.props.onChangeTimeOut(value);
                }
            }, this.props.timeOut);
        }
    }

    _onSelectChange(item) {
        this.setState({value: item.value});
        this.setState({title: item.label});
        this.setState({titleDefault: item.label});
        this.setState({flag_error: false});
        this.setState({flag_active: true});
        this.setState({flag_open: false});
        this.setState({msg: ""});
        if (item.value !== this.state.value) {
            this.props.onChange(this.props.outNumber ? parseInt(item.value) : item.value, this.props.name, _.get(this.props, 'item', null));
        }
    }

    _onFocus(event){
        if (!this.props.readOnly) {
            this.setState({flag_active: true});
            this.setState({flag_open: true});
            this.Ref.current.focus();
        }
    }

    _onBlur(event){
        let value = this.state.value;
        let is_value = !(value === "" || value === null || value === undefined);
        if (!is_value){
            this.setState({flag_active: false});
            this.setState({title: ""});
        }else{
            this.setState({flag_active: true});
        }
        this.setState({flag_open: false});
        if (this.state.required) {
            if (!is_value) {
                this.setState({flag_error: true});
                this.setState({msg: 'Thông tin là bắt buộc'});
            } else {
                this.setState({flag_error: false});
                this.setState({msg: ""});
            }
        }
    }

    _iconDeleteClick(){
        this.setState({title: ""});
        this.setState({value: ""});
        this.setState({flag_active: false});
        this.props.onChange(null, this.props.name, _.get(this.props, 'item', null));
    }

    componentWillMount() {
        let {key_value, key_title, data, value, old_value} = this.props;
        key_value = key_value ? key_value : this.state.key_value;
        key_title = key_title ? key_title : this.state.key_title;
        this.setState({key_value: key_value});
        this.setState({key_title: key_title});
        if (data?.length){
            let list_item = data;
            this.setState({list_item: data});
            list_item.forEach((item) => {
                if (String(item[key_value]) === String(value)){
                    this.setState({title: item[key_title]});
                    this.setState({value: item[key_value]});
                    this.setState({flag_active: true});
                }
            });
        }
        if (old_value !== undefined && old_value !== value && value !== undefined && value !== null){
            this.setState({icon_rollback: true});
            this.setState({value_tmp: value});
        }
    }

    componentWillReceiveProps(newProps) {
        let {error, data, value, nameFocus, old_value, required, loading} = newProps;
        let {key_value, key_title} = this.state;
        this.setState({required});
        this.setState({loading});
        this.setState({list_item: data});
        let is_value = !(value === "" || value === null || value === undefined);
        if (!is_value && !newProps.timeOut){
            this.setState({flag_active: is_value});
            this.setState({value: ''});
            this.setState({title: ''});
        }
        if (data?.length){
            let isShowIconDelete = false;
            let title = "";
            data.forEach((item) => {
                if (String(item[key_value]) === String(value) && isShowIconDelete !== true) {
                    isShowIconDelete = true;
                    title = item[key_title];
                    value = item[key_value];
                }
            });
            value = isShowIconDelete ? value : null;
            if(newProps.timeOut){
                if(value){
                    isShowIconDelete = newProps.timeOut || isShowIconDelete;
                }else{
                    isShowIconDelete = false;
                }
            }
            this.setState({title:title, value: value, flag_active:isShowIconDelete, isShowIconDelete: isShowIconDelete});
        }else{
            if (!newProps.timeOut) {
                this.setState({title: ""});
                this.setState({value: ""});
                this.props.onChange(null, this.props.name, _.get(this.props, 'item', null));
            }
        }
        if (error){
            this.setState({flag_error: true});
            this.setState({msg: error});
        }
        if (old_value !== undefined && value !== undefined && value !== null){
            if(old_value !== value) {
                this.setState({icon_rollback: true});
                this.setState({value_tmp: value});
            }else{
                // this.setState({icon_rollback: false});
            }
        }
        if (nameFocus === this.props.name){
            this.onFocus();
        }
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }
        if(this.state.timeOutTitle){
            this.setState({flag_active: true});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        if (msg){
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            }else{
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let value = this.state.value ? {value: this.state.value, label: this.state.title} : {value: "", label: this.state.title};
        let old_value = !this.state.rollback ? this.props.old_value: this.state.value_tmp;
        let old_title = '';
        let data = [];
        if (this.state.list_item){
            this.state.list_item.forEach((item) => {
                data.push({label: item[this.state.key_title], value: item[this.state.key_value], isDisabled: item.isDisabled || false});
                if (item[this.state.key_value] === old_value){
                    old_title = item[this.state.key_title];
                }
            });
        }

        return(
            <div className="v-input">
                <div className={classnames(
                    "v-input-control",
                    this.state.flag_active ? "flag-active" : "",
                    this.state.flag_error ? "flag-error" : "",
                    this.state.icon_rollback && !this.state.rollback ? "flag-warning" : "",
                    this.props.readOnly ? "flag-readonly" : '')
                }>
                    <div className="v-input-slot">
                        <label className="v-label" htmlFor={this.props.name} onClick={this.onFocus}>
                            {this.props.label} {this.props.label && this.state.required ? <span className="textRed">*</span> : ""}
                        </label>
                            {this.state.isShowIconDelete && this.state.value !== "" && !this.props.readOnly && !this.props.noDelete  &&(
                                <div>
                                    <IconButton aria-label="Delete" size="small" onClick={this.iconDeleteClick}>
                                        <i className="el-icon-input-delete glyphicon glyphicon-remove-circle pointer"/>
                                    </IconButton>
                                </div>
                            )}
                        {this.props.readOnly && (
                            <input type="text" className={this.props.className} placeholder={this.props.placeholder} value={this.state.title} readOnly/>
                        )}
                        {!this.props.readOnly && (
                            <ReactSelect
                                name={this.props.name}
                                value={value}
                                placeholder={this.props.placeholder || ''}
                                options={data}
                                onMenuOpen ={this.onFocus}
                                onChange={this.onSelectChange}
                                onBlur={this.onBlur}
                                menuIsOpen={this.state.flag_open}
                                onInputChange={this.onChange}
                                components={{
                                    DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null
                                }}
                                ref={this.Ref}
                                isLoading={this.state.loading}
                                menuPlacement={this.props.placement ? this.props.placement : 'auto'}
                            />
                        )}
                        <div className="v-input-icon v-icon-select2">
                            <i aria-hidden="true" className="v-icon material-icons v-icon-append">arrow_drop_down</i>
                        </div>
                        {this.state.icon_rollback && (
                            <div className="v-input-icon">
                                <OverlayTrigger placement="top" shouldUpdatePosition={true} overlay={
                                    <Popover id={`${this.props.name}-popover`}>{old_title}</Popover>
                                }>
                                    <IconButton aria-label="rollback" size="small" style={{bottom:"25px", right:"0"}} onClick={()=>{
                                        let value = this.state.rollback ? this.state.value_tmp : this.props.old_value;
                                        this.props.onChange(this.props.outNumber ? parseInt(value) : value, this.props.name, _.get(this.props, 'item', null));
                                        this.setState({rollback: !this.state.rollback});
                                    }}>
                                        <i className="fs18 pointer icon-transform material-icons">redo</i>
                                    </IconButton>
                                </OverlayTrigger>
                            </div>
                        )}
                    </div>
                    <div className={classnames("v-messages", this.state.flag_error ? "v-messages-error" : "")}>
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

export default connect(mapStateToProps,mapDispatchToProps)(Dropbox);
