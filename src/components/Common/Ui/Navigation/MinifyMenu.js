import React from 'react'
import $ from 'jquery';

export default class MinifyMenu extends React.Component{
    toggle() {
        let $body = $('body');
        if (!$body.hasClass("menu-on-top")) {
            $body.toggleClass("minified");
            $body.removeClass("hidden-menu");
            $('html').removeClass("hidden-menu-mobile-lock");
        }
    }
    render() {
        return (
            <span className="minifyme hidden-xs" data-action="minifyMenu" onClick={this.toggle}>
               <i className="fa fa-arrow-circle-left hit"/>
           </span>
        )
    }
}
