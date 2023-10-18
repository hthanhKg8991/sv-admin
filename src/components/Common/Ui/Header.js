import React, {Component} from 'react';
import {connect} from 'react-redux';
import LanguageSelector from './LanguageSelector';
import BranchSelector from './BranchSelector';
import {bindActionCreators} from "redux";
import FullScreen from './FullScreen';
import ToggleMenu from './ToggleMenu'
import Activities from './ActivitiesNew';
import {Link} from 'react-router-dom';
import {Dropdown, MenuItem} from 'react-bootstrap';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import popupProFile from "./User/popupProfile";
import popupChangePassword from "./User/popupChangePassword";
import config from 'config';
import * as authAction from "actions/authAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class Header extends Component {
    constructor(props) {
        super(props);
        this.logout = this._logout.bind(this);
        this.popupProfile = this._popupProfile.bind(this);
        this.popupChangePassword = this._popupChangePassword.bind(this);
    }

    _popupProfile() {
        this.props.uiAction.createPopup(popupProFile, "Thông Tin Cá Nhân");
    }

    _popupChangePassword() {
        this.props.uiAction.createPopup(popupChangePassword, "Đổi Mật Khẩu");
    }

    _logout(e) {
        e.preventDefault();
        this.props.authAction.logout();
    }

    componentWillReceiveProps(newProps) {

    }

    render() {
        let display_name = this.props.user && this.props.user.display_name ? this.props.user.display_name : "";
        let division_code = this.props.user && this.props.user.division_code ? this.props.user.division_code : "";
        let avatar_path = this.props.user && this.props.user.avatar_path ? this.props.user.avatar_path : "";

        return (
            <header id="header">
                <div id="logo-group">
                    <span id="logo">
                        <Link to={Constant.BASE_URL}>
                            <img src="/assets/img/logo.png" alt="SmartAdmin"/>
                        </Link>
                    </span>
                    <Activities  />
                </div>
                <div className="pull-right">
                    <ToggleMenu className="btn-header pull-right hidden-xs"/>
                    <FullScreen className="btn-header pull-right hidden-xs"/>
                    <ul id="mobile-profile-img" className="header-dropdown-list padding-5">
                        <li className="">
                            <Dropdown id="dropdown-profile">
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    <img src={(avatar_path === "" || avatar_path === 'small-avatar1.png') ?
                                        '/assets/img/avatars/sunny.png' : utils.urlFile(avatar_path, config.urlCdnFile)}
                                         alt={display_name} className="online"/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="pull-right menu-profile">
                                    <MenuItem onClick={this.popupProfile}>
                                        <ListItemAvatar>
                                            <img src={(avatar_path === "" || avatar_path === 'small-avatar1.png') ?
                                                '/assets/img/avatars/sunny.png' : utils.urlFile(avatar_path, config.urlCdnFile)}
                                                 alt={display_name} className="avatar_profile"/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={display_name}
                                            secondary={
                                                <React.Fragment>
                                                    {[Constant.DIVISION_TYPE_admin, Constant.DIVISION_TYPE_root].includes(division_code) ? 'Quản lý' : 'Nhân viên'}
                                                </React.Fragment>
                                            }
                                        />
                                    </MenuItem>
                                    <MenuItem divider/>
                                    <MenuItem onClick={this.popupProfile}>
                                        <i className="fa fa-user"/> Thông tin cá nhân
                                    </MenuItem>
                                    <MenuItem divider/>
                                    <MenuItem onClick={this.popupChangePassword}>
                                        <i className="fa fa-lock"/> Đổi mật khẩu
                                    </MenuItem>
                                    <MenuItem divider/>
                                    <MenuItem onClick={this.logout}>
                                        <i className="fa fa-sign-out fa-lg"/> <strong>Đăng xuất</strong>
                                    </MenuItem>
                                </Dropdown.Menu>
                            </Dropdown>
                        </li>
                    </ul>
                    <div id="logout" className="btn-header transparent pull-right hidden">
                        <span>
                            <span title="Sign Out" onClick={this.logout}><i className="fa fa-sign-out pointer"/></span>
                        </span>
                    </div>
                    <LanguageSelector/>
                    <BranchSelector/>
                </div>
            </header>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,

    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        authAction: bindActionCreators(authAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
