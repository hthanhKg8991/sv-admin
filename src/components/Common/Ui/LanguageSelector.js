import React, { Component } from 'react'
import classnames from 'classnames'
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {Dropdown, MenuItem} from 'react-bootstrap';
import * as uiAction from 'actions/uiAction';

class LanguageSelector extends Component{
    constructor(props)
    {
        super(props);
        this.state = {};
        this.selectLanguage = this._selectLanguage.bind(this);
    }
    _selectLanguage(language){
        this.props.uiAction.changeLanguage(language);
    }
    render () {
        let languages = this.props.lang.languages;
        let language = this.props.lang.currentLanguage;
        return (
            <ul className="header-dropdown-list ng-cloak">
                <li className="dropdown">
                    <Dropdown id="dropdown-language" className="dropdown-language">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            <span className="pointer color-white">
                                <img src="/assets/img/blank.gif" className={classnames(['flag', 'flag-'+language.key])} alt={language.alt} />
                                <i className="ml5 fa fa-angle-down" />
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="pull-right">
                            {languages.map((item,key) => {
                                return (
                                    <MenuItem key={key} className={classnames(item.key === language.key ? 'active' : '')}>
                                        <span className="pointer" onClick={this.selectLanguage.bind(this, item.key)} >
                                            <img src="/assets/img/blank.gif" className={classnames(['flag', 'flag-'+item.key])} alt={item.alt} />
                                        </span>
                                    </MenuItem>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>
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
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(LanguageSelector);
