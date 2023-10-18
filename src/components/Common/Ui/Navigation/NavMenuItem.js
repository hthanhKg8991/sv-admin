import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';
import NavMenuList from './NavMenuList'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from 'actions/uiAction'


class SmartMenuItem extends Component {
    constructor (props) {
        super(props);
        this.state = {
            active: null,
            router: props.router
        };
    }
    componentWillMount(){
        this.setState({router: this.props.router});
    }
    componentWillReceiveProps(newProps) {
        this.setState({router: newProps.router});
    }
    render() {
        let item = this.props.item;
        let title = !item.parent ?
            <span className="menu-item-parent">{item.name}</span> : <span>{item.name}</span>;

        let badge = item.badge ? <span className={item.badge.class}>{item.badge.label || ''}</span> : null;
        let childItems = item.child ? <NavMenuList items={item.child}/> : null;

        let icon = item.icon ? (
            item.counter ? <i className={classnames(item.icon,"fs20")}><em>{item.counter}</em></i> : <i className={classnames(item.icon,"fs20")}/>
        ) : null;
        let liClassName = (this.state.router.location.pathname === item.url) ? 'active nav-active' : '';
        let link = liClassName !== 'active nav-active' ?
            <NavLink to={item.url} activeClassName={liClassName}>
                {icon} {title} {badge}
            </NavLink> :
            <a className={liClassName} href={item.url}>
                {icon} {title} {badge}
            </a>;
        return <li className={liClassName}>{link}{childItems}</li>
    }
}

function mapStateToProps(state) {
    return {
        router: state.router
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(SmartMenuItem);

