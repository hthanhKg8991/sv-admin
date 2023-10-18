import React, {Component} from "react";
import * as utils from "utils/utils";
import classnames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {connect} from "react-redux";
import {OverlayTrigger, Popover} from 'react-bootstrap';

class Input2 extends Component {
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
            required: props.required,
            suggest: []
        };
        this.Ref = React.createRef();
        this.onChange = this._onChange.bind(this);
        this.onBlur = this._onBlur.bind(this);
        this.onFocus = this._onFocus.bind(this);
        this.showHidePass = this._showHidePass.bind(this);
        this.onKeyDown = this._onKeyDown.bind(this);
        this.onSelectSuggest = this._onSelectSuggest.bind(this);
    }

    _onChange(event) {
        const {fetchApi} = this.props;
        let value = event.target.value;
        let old_value = this.state.value;
        if (this.props.numberOnly) {
            let re = /^[0-9]+$/;
            if (value && !re.test(value)) {
                value = old_value;
            }
        }
        if (value) {
            this.setState({flag_error: false});
            this.setState({msg: null});
        }
        this.setState({value: value}, () => {
            if (this.props.onChange && value !== old_value) {
                if (this.props.timeOut) {
                    setTimeout(async () => {
                        if (this.state.value === value) {
                            this.props.onChange(value, this.props.name);
                            if (fetchApi) {
                                if (value.length > 0) {
                                    const res = await fetchApi({name: value});
                                    if (res && Array.isArray(res?.items)) {
                                        this.setState({suggest: res.items});
                                    }
                                } else {
                                    this.setState({suggest: []})
                                }
                            }
                        }
                    }, this.props.timeOut)
                } else {
                    if (this.props.type === "email") {
                        this.props.onChange(value, this.props.name);
                    } else {
                        this.props.onChange(value, this.props.name);
                    }
                }
            }
        });

    }

    _onFocus() {
        this.setState({flag_active: true});
    }

    _onBlur() {
        let value = this.state.value;
        let flag_error = false;
        let msg = '';
        let is_value = !(value === "" || value === null || value === undefined);
        if (this.state.required && !is_value) {
            flag_error = true;
            msg = "Thông tin là bắt buộc";
        }
        if (this.props.type === "email" && !utils.validateEmail(this.state.value)) {
            flag_error = true;
            msg = "E-mail phải đúng định dạng.";
        }
        this.setState({flag_active: is_value});
        this.setState({flag_error: flag_error});
        this.setState({msg: msg});
    }

    _showHidePass() {
        this.setState({isShowPass: !this.state.isShowPass});
    }

    _onKeyDown(event) {
        if (event.key === 'Enter' && this.props.onEnter) {
            let value = event.target.value;
            this.Ref.current.blur();
            this.props.onEnter(value, this.props.name);
        }
    }

    _onSelectSuggest(value) {
        this.props.onChange(value, this.props.name);
        this.setState({suggest: []});
    }

    componentWillMount() {
        let value = this.props.value;
        let is_value = !(value === "" || value === null || value === undefined);
        this.setState({flag_active: is_value});
        this.setState({value: is_value ? value : ''});

        let old_value = this.props.old_value;
        if (old_value !== undefined && old_value !== value && value !== undefined && value !== null) {
            this.setState({icon_rollback: true});
            this.setState({value_tmp: this.props.value});
        }
    }

    componentWillReceiveProps(newProps) {
        let value = newProps.value;
        let is_value = !(value === "" || value === null || value === undefined);
        this.setState({flag_active: is_value});
        if (newProps.error) {
            this.setState({flag_error: true});
            this.setState({msg: newProps.error});
        }
        this.setState({value: is_value ? value : ''});
        if (newProps.nameFocus === this.props.name) {
            this.Ref.current.focus();
        }
        let old_value = newProps.old_value;
        if (old_value !== undefined && value !== undefined && value !== null) {
            if (old_value !== value) {
                this.setState({icon_rollback: true});
                this.setState({value_tmp: value});
            } else {
                // this.setState({icon_rollback: false});
            }
        }
        this.setState({required: newProps.required});
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))) {
            this.setState({lang: newProps.lang});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let {lang, rollback, icon_rollback, value_tmp, required, isShowPass, flag_active, flag_error, suggest} = this.state;
        let msg = lang.stringError[this.state.msg] ? lang.stringError[this.state.msg] : this.state.msg;
        if (msg) {
            if (this.props.label) {
                msg = msg.replace(":attr_name", this.props.label);
            } else {
                msg = msg.replace(":attr_name", this.props.placeholder)
            }
        }
        let value = this.state.value === undefined || this.state.value === null ? '' : this.state.value;
        let old_value = !rollback ? this.props.old_value : value_tmp;
        let label = <React.Fragment>{this.props.label} {this.props.label && required ?
            <span className="textRed">*</span> : ""}</React.Fragment>;
        let inputProps = {prefix: this.props.prefix, suffix: this.props.suffix};
        let InputProps = {
            endAdornment: (
                <InputAdornment position="end" className={classnames(!this.props.showPass ? "hidden" : "")}>
                    <IconButton aria-label="Toggle password visibility" tabIndex="-1" onClick={this.showHidePass}>
                        {isShowPass ? <Visibility/> : <VisibilityOff/>}
                    </IconButton>
                </InputAdornment>
            )
        };
        if (this.props.readOnly) {
            return (
                <div className="v-input">
                    <div className={classnames(
                        "v-input-control flag-readonly",
                        flag_active ? "flag-active" : "",
                        icon_rollback && !rollback ? "flag-warning" : ""
                    )}>
                        <div className="v-input-slot">
                            <label className="v-label" htmlFor={this.props.name}>
                                {label}
                            </label>
                            <input type="text" className={this.props.className} placeholder={this.props.placeholder}
                                   value={value} readOnly/>
                        </div>
                    </div>
                </div>
            )
        }

        const {offAutoComplete, name} = this.props;
        let autoComplete;
        if (offAutoComplete) {
            autoComplete = "new-" + name;
        }

        return (
            <div className={classnames(
                "v-textfield",
                flag_active ? "flag-active" : "",
                icon_rollback && !rollback ? "flag-warning" : ""
            )}>
                <TextField type={isShowPass || !this.props.showPass ? 'text' : 'password'} id={this.props.name}
                           className={this.props.className} placeholder={this.props.placeholder} label={label}
                           helperText={msg}
                           error={flag_error} value={value}
                           onChange={this.onChange}
                           autoComplete={autoComplete}
                           onBlur={this.onBlur}
                           onFocus={this.onFocus}
                           onKeyDown={this.onKeyDown}
                           inputProps={inputProps}
                    // eslint-disable-next-line
                           InputProps={InputProps}
                           inputRef={this.Ref}
                />
                {icon_rollback && (
                    <div className="v-input-icon">
                        <OverlayTrigger placement="top" shouldUpdatePosition={true} overlay={
                            <Popover id={`${this.props.name}-popover`}>{old_value}</Popover>
                        }>
                            <IconButton aria-label="rollback" size="small" style={{bottom: "25px", right: "13px"}}
                                        onClick={() => {
                                            let value = rollback ? value_tmp : this.props.old_value;
                                            this.props.onChange(value, this.props.name);
                                            this.setState({rollback: !rollback});
                                        }}>
                                <i className="fs18 pointer icon-transform material-icons">redo</i>
                            </IconButton>
                        </OverlayTrigger>
                    </div>
                )}
                {suggest && suggest.length > 0 && (
                    <div className="suggest-box">
                        <ul className="input-suggest">
                            {suggest.map(s => (
                                <li key={s?.id.toString()} onClick={() => this.onSelectSuggest(s?.name)}>{s?.name}</li>
                            ))}
                        </ul>
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


export default connect(mapStateToProps)(Input2);
