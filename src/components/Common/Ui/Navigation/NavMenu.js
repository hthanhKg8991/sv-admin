import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import NavMenuList from './NavMenuList'
import {connect} from "react-redux";
import $ from 'jquery';

class NavMenu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            navigation: [],
            IsDidUpdate: false
        };
    }

    initNavigation(menu){
        let navigation = [];
        Object.keys(menu).forEach((key) => {
            navigation.push(menu[key])
        });
        this.setState({navigation: navigation});
        if(navigation.length) {
            if (!this.state.IsDidUpdate) {
                this.setState({IsDidUpdate: true}, () => {
                    const defaults = {
                        accordion: true,
                        speed: 200,
                        closedSign: '[+]',
                        openedSign: '[-]'
                    };

                    //@todo get rid of jquery stuff

                    // Extend our default options with those provided.
                    const opts = $.extend({}, defaults, this.props);
                    //Assign current element to variable, in this case is UL element
                    const $this = $(ReactDOM.findDOMNode(this));

                    //add a mark [+] to a multilevel menu
                    $this.find("li").each(function () {
                        if ($(this).find("ul").length !== 0) {
                            //add the multilevel sign next to the link
                            $(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

                            //avoid jumping to the top of the page when the is an #
                            if ($(this).find("a:first").attr('href') === "#") {
                                $(this).find("a:first").click(function () {
                                    return false;
                                });
                            }
                        }
                    });

                    //open active level
                    $this.find("a.active").each(function (li) {
                        $(this).parents("ul").slideDown(opts.speed);
                        $(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
                        $(this).parents("ul").parent("li").addClass("open");
                    });
                    $this.find("li a").click(function () {
                        if ($(this).parent().find("ul").length !== 0) {
                            if (opts.accordion) {
                                //Do nothing when the list is open
                                if (!$(this).parent().find("ul").is(':visible')) {
                                    const parents = $(this).parent().parents("ul");
                                    const visible = $this.find("ul:visible");
                                    visible.each(function (visibleIndex) {
                                        let close = true;
                                        parents.each(function (parentIndex) {
                                            if (parents[parentIndex] === visible[visibleIndex]) {
                                                close = false;
                                                return false;
                                            }
                                        });
                                        if (close) {
                                            if ($(this).parent().find("ul") !== visible[visibleIndex]) {
                                                $(visible[visibleIndex]).slideUp(opts.speed, function () {
                                                    $(this).parent("li").find("b:first").html(opts.closedSign);
                                                    $(this).parent("li").removeClass("open");
                                                });

                                            }
                                        }
                                    });
                                }
                            }// end if
                            if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
                                $(this).parent().find("ul:first").slideUp(opts.speed, function () {
                                    $(this).parent("li").removeClass("open");
                                    $(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
                                });

                            } else {
                                $(this).parent().find("ul:first").slideDown(opts.speed, function () {
                                    /*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
                                    $(this).parent("li").addClass("open");
                                    $(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
                                });
                            } // end else
                        } // end if
                    });
                })
            }
        }
    }

    componentWillMount(){
        if (this.props.sys.menu){
            this.initNavigation(this.props.sys.menu);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.sys.menu){
            this.initNavigation(newProps.sys.menu);
        }
    }

    componentDidMount() {

    }

    render() {
        let {navigation} = this.state;
        return (
            <NavMenuList items={navigation}/>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

function mapStateToProps(state) {
    return {
        router: state.router,
        sys: state.sys,
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(NavMenu)
