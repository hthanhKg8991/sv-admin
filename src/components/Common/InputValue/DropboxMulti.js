import React, {Component} from "react";
import ReactSelect from 'react-select';
import {connect} from "react-redux";
import {OverlayTrigger, Popover} from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import _ from "lodash";

class DropboxMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
            value: [],
            flag_active: false,
            flag_open: false,
            flag_error: false,
            msg: null,
            key_value: "value",
            key_title: "title",
            showPass: 0, //1 show, 0 hide
            data: props.data,
            rollback: false,
            icon_rollback: false,
            value_tmp: null,
            required: props.required
        };
        this.Ref = React.createRef();
        this.onSelect = this._onSelect.bind(this);
        this.onFocus = this._onFocus.bind(this);
        this.onBlur = this._onBlur.bind(this);
    }
    _onSelect(value) {
        this.setState({value: value});
        let value_change = [];
        if (value && value.length) {
            this.setState({flag_error: false});
            this.setState({msg: null});
            this.setState({flag_active: true});
            value.forEach((item) => {
                value_change.push(item.value);
            })
        }
        this.setState({flag_open: false});
        this.props.onChange(value_change, this.props.name, _.get(this.props, 'item', null));
    }
    _onFocus(){
        if (!this.props.readOnly) {
            this.setState({flag_active: true});
            this.setState({flag_open: true});
            this.Ref.current.focus();
        }
    }
    _onBlur(){
        this.setState({flag_active: !!(this.state.value && this.state.value.length)});
        this.setState({flag_open: false});
        if (this.state.required) {
            if (!this.state.value || !this.state.value.length) {
                this.setState({flag_error: true});
                this.setState({msg: "Thông tin là bắt buộc"});
            } else {
                this.setState({flag_error: false});
                this.setState({msg: null});
            }
        }
    }

    componentDidMount() {
        let {key_value, key_title, data, value, old_value, error} = this.props;
        key_value = key_value ? key_value : this.state.key_value;
        key_title = key_title ? key_title : this.state.key_title;
        this.setState({key_value: key_value});
        this.setState({key_title: key_title});
        let is_value = !(value === null || value === undefined || (Array.isArray(value) && !value.length));

        if (is_value && data && data.length){
            value.forEach(function(val, index){
                value[index] = String(val);
            });
            let n_value = [];
            data.forEach((item) => {
                n_value.push({label: item[key_title], value: item[key_value]})
            });
            n_value = n_value.filter(c => value.includes(String(c.value)));
            this.setState({value: n_value});
            this.setState({flag_active: true});
        }
        if (old_value !== undefined && JSON.stringify(old_value) !== JSON.stringify(value) && value !== undefined && value !== null){
            old_value.forEach(function(val, index){
                old_value[index] = String(val);
            });
            this.setState({old_value : old_value});
            this.setState({icon_rollback: true});
            this.setState({value_tmp: value});
        }

        this.setError(error);
    }

    setError(error) {
        if (error) {
            this.setState({flag_error: true});
            this.setState({msg: error});
        }
    }

    componentWillReceiveProps(newProps) {
        let {error, data, value, nameFocus, old_value, required} = newProps;
        this.setState({data: data});
        this.setState({required: required});

        let is_value = !(value === null || value === undefined || (Array.isArray(value) && !value.length));
        if (!is_value){
            this.setState({value: []});
            this.setState({flag_active: false});
        }

        if (data && data.length){
            if(is_value){
                let convertData = _.map(data, (o) => {return {value:o[this.state.key_value], label:o[this.state.key_title]}});
                let v = _.filter(convertData, (o) => { return _.includes(value, o.value)});
                this.setState({value: v});
                this.setState({flag_active: true});
            }
        }else{
            this.setState({value: []});
            this.setState({flag_active: false});
            this.props.onChange([], this.props.name);
        }

        this.setError(error);
        if (old_value !== undefined && value !== undefined && value !== null){
            if(JSON.stringify(old_value) !== JSON.stringify(value)) {
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
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let class_error = "";
        let class_msg = "";
        if (this.state.flag_active){
            class_error = " flag-active";
        }
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

        let old_value = !this.state.rollback ? this.props.old_value : this.state.value_tmp;
        let old_title = '';
        let data = [];
        if (Array.isArray(this.state.data)) {
            this.state.data.forEach((item) => {
                let i = {label: item[this.state.key_title], value: item[this.state.key_value]};
                data.push(i);
                if (old_value && old_value.includes(item[this.state.key_value])) {
                    old_title = old_title + item[this.state.key_title] + ", ";
                }

            });
        }
        data = this.state.value && this.state.value.length >= this.props.maximumSelectionLength ? [] : data;
        old_title = old_title ? old_title.substr(0,old_title.length - 2) : old_title;

        return(
            <div className="v-input">
                <div className={"v-input-control " + class_error}>
                    <div className="v-input-slot">
                        <label className="v-label" htmlFor={this.props.name} onClick={this.onFocus}>
                            {this.props.label} {this.props.label && this.state.required ? <span className="textRed">*</span> : ""}
                        </label>
                        {this.props.readOnly && (
                            <React.Fragment>
                                <ReactSelect
                                    name={this.props.name}
                                    value={this.state.value}
                                    placeholder={this.props.placeholder || ''}
                                    isMulti
                                    options={[]}
                                    // onMenuOpen ={this.onFocus}
                                    // onChange={this.onSelect}
                                    // onBlur={this.onBlur}
                                    menuIsOpen={this.state.flag_open}
                                    components={{
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null
                                    }}
                                    ref={this.Ref}
                                    menuPlacement={this.props.placement ? this.props.placement : 'auto'}
                                />
                                </React.Fragment>
                        )}
                        {!this.props.readOnly && (
                            <React.Fragment>
                                {this.state.icon_rollback && (
                                    <OverlayTrigger placement="top" shouldUpdatePosition={true} overlay={
                                        <Popover id={`${this.props.name}-popover`}>{old_title}</Popover>
                                    }>
                                        <IconButton aria-label="rollback" size="small" className="right0" style={{position: "absolute" ,bottom:"25px"}} onClick={()=>{
                                            let value = this.state.rollback ? this.state.value_tmp : this.props.old_value;
                                            this.props.onChange(value, this.props.name, _.get(this.props, 'item', null));
                                            this.setState({rollback: !this.state.rollback});
                                        }}>
                                            <i className="fs18 pointer icon-transform material-icons">redo</i>
                                        </IconButton>
                                    </OverlayTrigger>
                                )}
                                <ReactSelect
                                    name={this.props.name}
                                    value={this.state.value}
                                    placeholder={this.props.placeholder || ''}
                                    isMulti
                                    options={data}
                                    onMenuOpen ={this.onFocus}
                                    onChange={this.onSelect}
                                    onBlur={this.onBlur}
                                    menuIsOpen={this.state.flag_open}
                                    components={{
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null
                                    }}
                                    ref={this.Ref}
                                    menuPlacement={this.props.placement ? this.props.placement : 'auto'}
                                />
                                </React.Fragment>
                        )}
                        <div className="v-input-icon v-icon-select2">
                            <i aria-hidden="true" className="v-icon material-icons v-icon-append">arrow_drop_down</i>
                        </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(DropboxMulti);
