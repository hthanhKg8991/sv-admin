import React, {Component} from "react";
import {Collapse} from 'react-bootstrap';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import classnames from 'classnames';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {getPermission, getMenuWithAction, savePermission} from "api/auth";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import _ from 'lodash';

class PopupPermission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: {},
            permission: {},
            permission_count: {},
            menu: {},
            show_detail: {},
            loading: false,
            loadingMini: false,
        };
        this.showHide = this._showHide.bind(this);
    }

    _showHide(name) {
        let show_detail = Object.assign({}, this.state.show_detail);
        show_detail[name] = !show_detail[name];
        this.setState({show_detail: show_detail});
    }

    async _getPermission() {
        this.setState({loading: true});
        let args = {
            division_code: this.props.object.code,
            per_page: 2500 // tăng limit để check phân quyền
        };
        const resPermission = await getPermission(args);
        const resMenu = await getMenuWithAction();
        let permission = {};
        resPermission.items.forEach((item) => {
            permission[item.code] = item;
        });
        this.setState({menu: resMenu, permission: permission, loading: false});
    }

    async _updatePermission(permission_code, code, status) {
        let args = {
            division_code: this.props.object.code,
            permission_code: [permission_code],
            status: status,
            code: code
        };
        const res = await savePermission(args);
        if (res) {
            let permission = {};
            res.forEach((item) => {
                permission[item.code] = item;
            });
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.setState({permission: permission});
        }
    }

    async _updatePermissionAll(actions, code, status) {
        let permission_code = [];
        actions.forEach((item) => {
            permission_code.push(item.code);
        });
        let args = {
            division_code: this.props.object.code,
            permission_code: permission_code,
            status: status,
            code: code
        };
        const res = await savePermission(args);
        if (res) {
            let permission = {};
            res.forEach((item) => {
                permission[item.code] = item;
            });
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.setState({permission: permission});
        }
    }

    componentDidMount() {
        this._getPermission();
    }

    render() {
        let {menu, permission, show_detail, loading} = this.state;
        if (loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        let group = _.groupBy(permission, 'group');
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container">
                        {Object.keys(menu).map((name) => {
                            return (
                                <div className="box-card mb10" key={name}>
                                    <div
                                        className={classnames("box-card-title box-package pointer paddingLeft5", show_detail[name] ? "active" : "")}
                                        onClick={() => {
                                            this.showHide(name)
                                        }}>
                                        <div className="title left">
                                            <i aria-hidden="true" className="v-icon material-icons v-icon-append"
                                               style={{lineHeight: "15px"}}>arrow_drop_down</i>
                                            <span>{menu[name].name}</span>
                                        </div>
                                    </div>
                                    <Collapse in={show_detail[name]}>
                                        {show_detail[name] ? (
                                            <div className="padding10">
                                                {menu[name].child ? menu[name].child.map((item, key) => {
                                                    let check_all = false;

                                                    if (group[item.code] && group[item.code].length >= item.actions.length) {
                                                        check_all = true;
                                                    }
                                                    return (
                                                        <div className="box-card mb10" key={name + key}>
                                                            <div
                                                                className={classnames("box-card-title box-package paddingLeft5", this.state.show_detail[name + key] ? "active" : "")}>
                                                                <div className="title left pointer w70"
                                                                     onClick={this.showHide.bind(this, name + key)}>
                                                                    <i aria-hidden="true"
                                                                       className="v-icon material-icons v-icon-append"
                                                                       style={{lineHeight: "15px"}}>arrow_drop_down</i>
                                                                    <span>{item.name}</span>
                                                                </div>
                                                                {item.actions.length > 0 && (
                                                                    <div className="right">
                                                                        <FormControlLabel
                                                                            className="margin0"
                                                                            label={<label className="v-label margin0">Chọn
                                                                                tất cả</label>}
                                                                            control={<Checkbox checked={check_all}
                                                                                               color="primary"
                                                                                               icon={
                                                                                                   <CheckBoxOutlineBlankIcon
                                                                                                       fontSize="large"/>}
                                                                                               checkedIcon={
                                                                                                   <CheckBoxIcon
                                                                                                       fontSize="large"/>}
                                                                                               onChange={() => {
                                                                                                   this._updatePermissionAll(item.actions, item.code, check_all ? 0 : 1)
                                                                                               }}/>}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Collapse in={show_detail[name + key]}>
                                                                {show_detail[name + key] ? (
                                                                    <div>
                                                                        <div className="card-body row">
                                                                            {item.actions.map((ac, k) => {
                                                                                let checked = false;
                                                                                if (permission[ac.code]) {
                                                                                    checked = true;
                                                                                }
                                                                                return (
                                                                                    <div className="col-sm-3 col-xs-6"
                                                                                         key={k}>
                                                                                        <FormControlLabel
                                                                                            label={<label
                                                                                                className="v-label margin0">{ac.name}</label>}
                                                                                            control={<Checkbox
                                                                                                checked={checked}
                                                                                                color="primary"
                                                                                                icon={
                                                                                                    <CheckBoxOutlineBlankIcon
                                                                                                        fontSize="large"/>}
                                                                                                checkedIcon={
                                                                                                    <CheckBoxIcon
                                                                                                        fontSize="large"/>}
                                                                                                onChange={() => {
                                                                                                    this._updatePermission(ac.code, item.code, checked ? 0 : 1)
                                                                                                }}/>}
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>) : <div></div>}
                                                            </Collapse>
                                                        </div>
                                                    )
                                                }) 
                                                : 
                                                (<> {/** Giành cho case menu không phân cấp, task SO-98 liên quan tới phân quyền tại trang chủ admin */}
                                                    {menu[name]?.actions ? (
                                                        <div>
                                                            <div className="card-body row">
                                                                {menu[name]?.actions.map((ac, k) => {
                                                                    let checked = false;
                                                                    if (permission[ac.code]) {
                                                                        checked = true;
                                                                    }
                                                                    return (
                                                                        <div className="col-sm-3 col-xs-6"
                                                                                key={k}>
                                                                            <FormControlLabel
                                                                                label={<label
                                                                                    className="v-label margin0">{ac.name}</label>}
                                                                                control={<Checkbox
                                                                                    checked={checked}
                                                                                    color="primary"
                                                                                    icon={
                                                                                        <CheckBoxOutlineBlankIcon
                                                                                            fontSize="large"/>}
                                                                                    checkedIcon={
                                                                                        <CheckBoxIcon
                                                                                            fontSize="large"/>}
                                                                                    onChange={() => {
                                                                                        this._updatePermission(ac.code, menu[name]?.code, checked ? 0 : 1)
                                                                                    }}/>}
                                                                            />
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>) : <div></div>}
                                                </>)}
                                            </div>
                                        ) : <div></div>}
                                    </Collapse>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupPermission);
