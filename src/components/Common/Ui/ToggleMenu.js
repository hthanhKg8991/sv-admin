import React from 'react'
import $ from 'jquery';

export default class ToggleMenu  extends React.Component{
    toggleMenu(e) {
        const $body = $('body');
        const $html = $('html');

        if (!$body.hasClass("menu-on-top")){
            $html.toggleClass("hidden-menu-mobile-lock");
            $body.toggleClass("hidden-menu");
            $body.removeClass("minified");
        } else if ( $body.hasClass("menu-on-top") && $body.hasClass("mobile-view-activated") ) {
            $html.toggleClass("hidden-menu-mobile-lock");
            $body.toggleClass("hidden-menu");
            $body.removeClass("minified");
        }
        e.preventDefault();
    }
    toggle(e) {
        const $body = $('body');
        if (!$body.hasClass("menu-on-top")) {
            $body.toggleClass("minified");
            $body.removeClass("hidden-menu");
            $('html').removeClass("hidden-menu-mobile-lock");
        }
    }
    render() {
        return (
            <div className={this.props.className}>
            {/*<div id="hide-menu" className={this.props.className}>*/}
                <span title="Collapse Menu" className="pointer" onClick={this.toggle}>
                    <i className="fa fa-reorder"/>
                </span>
            </div>

        )
    }
}