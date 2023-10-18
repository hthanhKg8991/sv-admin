import React, {Component} from "react";
import {connect} from "react-redux";
import ReactSelect, {components} from 'react-select';
import _ from 'lodash';

class DropboxGroup extends Component {
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
            key_group: "parent",
            data: props.data,
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
        this.props.onChange(value_change, this.props.name);
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

    componentWillMount() {
        let {key_value, key_title, key_group, value, data} = this.props;

        key_value = key_value ? key_value : this.state.key_value;
        key_title = key_title ? key_title : this.state.key_title;
        key_group = key_group ? key_group : this.state.key_group;
        this.setState({key_value: key_value});
        this.setState({key_title: key_title});
        this.setState({key_group: key_group});

        let is_value = !(value === null || value === undefined || (Array.isArray(value) && !value.length));
        let nested = [];

        if(data && data.length){
            let group = _.groupBy(data, key_group);

            _.map(group[0], function (val) {
                let options = group[parseInt(val[key_value])] || [];
                let data_options = [];

                _.map(options, function(val_option){
                    data_options.push({ label : val_option[key_title], value : val_option[key_value]});
                });

                nested.push({ label: val[key_title], options: data_options });
            });

            if (is_value) {
                let v = [];
                _.map(nested, (item) => {
                    _.map(item.options, function(option){
                        if (_.includes(value, option.value)) {
                            v.push({
                                value: option.value,
                                label: option.label
                            });
                        }
                    });
                });

                this.setState({ value: v });
                this.setState({ flag_active: true });
            } else {
                this.setState({ value: [] });
                this.setState({ flag_active: false });
                this.props.onChange([], this.props.name);
            }
        }

        this.setState({data: nested});
    }

    componentWillReceiveProps(newProps) {
        let {error, data, value, nameFocus, required} = newProps;

        let key_title = this.state.key_title;
        let key_value = this.state.key_value;
        let key_group = this.state.key_group;

        let is_value = !(value === null || value === undefined || (Array.isArray(value) && !value.length));
        let nested = [];

        if(data && data.length){
            let group = _.groupBy(data, key_group);

            _.map(group[0], function (val) {
                let options = group[parseInt(val[key_value])] || [];
                let data_options = [];

                _.map(options, function(val_option){
                    data_options.push({ label : val_option[key_title], value : val_option[key_value]});
                });

                nested.push({ label: val[key_title], options: data_options });
            });

            if (is_value) {
                let v = [];
                _.map(nested, (item) => {
                    _.map(item.options, function(option){
                        if (_.includes(value, option.value)) {
                            v.push({
                                value: option.value,
                                label: option.label
                            });
                        }
                    });
                });

                this.setState({ value: v });
                this.setState({ flag_active: true });
            } else {
                this.setState({ value: [] });
                this.setState({ flag_active: false });
                this.props.onChange([], this.props.name);
            }
        }

        this.setState({data: nested});
        this.setState({required: required});

        if (error) {
            this.setState({ flag_error: true });
            this.setState({ msg: error });
        }

        if (nameFocus === this.props.name) {
            this.onFocus();
        }
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))) {
            this.setState({ lang: newProps.lang });
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

        let msg = this.state.lang.stringError[this.state.msg] ? this.state.lang.stringError[this.state.msg] : this.state.msg;
        if (msg) {
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            } else {
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }

        let data = this.state.data;

        return(
            <div className="v-input">
                <div className={"v-input-control " + class_error}>
                    <div className="v-input-slot">
                        <label className="v-label" htmlFor={this.props.name} onClick={this.onFocus}>
                            {this.props.label} {this.props.label && this.state.required ? <span className="textRed">*</span> : ""}
                        </label>
                        {this.props.readOnly && (
                            <input type="text" className={this.props.className} placeholder={this.props.placeholder} value={this.state.title} readOnly/>
                        )}
                        {!this.props.readOnly && (
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
    return {};
}

export default connect(mapStateToProps,mapDispatchToProps)(DropboxGroup);
