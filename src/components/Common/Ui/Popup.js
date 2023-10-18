import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import queryString from 'query-string';
import * as uiAction from "actions/uiAction";

class Popup extends Component{
    constructor (props) {
        super(props);
        this.state = {
            isShowPopup: 2,
            popup: {}
        };
        this.hidePopup = this._hidePopup.bind(this);
        this.onKeyPressed = this._onKeyPressed.bind(this);
    }

    _hidePopup(){
        this.setState({isShowPopup: 3});
        setTimeout(() => {
            this.props.uiAction.deletePopup();
        },300);
    }

    _onKeyPressed(){
        this.hidePopup();
    }

    componentWillReceiveProps(newProps) {
        let popup = newProps.ui.popup ? newProps.ui.popup : {};
        if([1,3].includes(this.state.isShowPopup) && !popup.Component){
            let query = queryString.parse(window.location.search);
            delete query.action_active;
            this.props.history.push(`?${queryString.stringify(query)}`);
        }

        this.setState({popup: popup});
        this.setState({isShowPopup: popup.Component ? 1 : 2});
        if(popup.Component && newProps.router.location.pathname !== this.props.router.location.pathname){
            this.hidePopup();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let {popup, isShowPopup} = this.state;
        let fade = "";
        if (isShowPopup === 3){
            fade = "fadeOut"
        }
        if ([1,3].includes(isShowPopup) && popup.Component){
            return (
                <div className={classnames("dialog-wrapper animated fast", fade)}>
                    <KeyboardEventHandler handleKeys={['esc']} handleFocusableElements={true} onKeyEvent={this.onKeyPressed} />
                    <div className={classnames("dialog-popup animated fast", fade, popup.classname)}>
                        <div className="dialog-popup-header">
                            <span className="dialog-popup-title">{popup.title}</span>
                            <button type="button" className="close" aria-label="Close" onClick={this.hidePopup}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <popup.Component history={this.props.history} {...popup.propsComponent}/>
                    </div>
                </div>
            )
        }else{
            return null;
        }
    }
}

function mapStateToProps(state) {
    return {
        ui: state.ui,
        router: state.router,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Popup)
