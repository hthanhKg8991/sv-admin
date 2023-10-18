import React, {Component} from 'react';
import classnames from 'classnames';
import Content from './Content';
import $ from 'jquery';
import {connect} from 'react-redux';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import T from "components/Common/Ui/Translate";
import {getNotification, viewNotification, deleteNotification} from "api/mix";

class Activities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_visible: false,
            dataNotify: [],
        };
        this._active = false;
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    async asyncData() {
        const res = await getNotification({});
        if (res){
            this.setState({dataNotify: res.items})
        }

    }

     onView = async (id) => {
        const res = await viewNotification({ids: [id]});
        if (res){
            this.asyncData()
        }
    }

    onDelete = async (id) => {
        const res = await deleteNotification({id});
        if (res){
            this.asyncData();
        }
    }

    toggleDropdown = (e) => {
        e.preventDefault();
        let dataNt = this.state.dataNotify;
        let obj = [];
        dataNt.map(id => {
            return obj.push(id.id);
        });

        const $dropdown = $(this.refs.dropdown);
        const $dropdownToggle = $(this.refs.dropdownToggle);

        if (this._active) {
            $dropdown.fadeOut(150)
        } else {
            $dropdown.fadeIn(150)
        }
        this._active = !this._active;
        $dropdownToggle.toggleClass('active', this._active)
    };

    componentDidMount() {
        this.asyncData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.pathname !== this.props.pathname) {
            this.asyncData();
        }
    }
    componentWillUnmount() {
    }

    offPopup = () => {
        const $dropdown = $(this.refs.dropdown);
        $dropdown.fadeOut(150);
    };


    render() {
        const { dataNotify} = this.state;
        const countNotRead = dataNotify?.reduce((currentValue, item) => {
            return item.status === 1
                ? currentValue + 1
                : currentValue;
        }, 0) || 0;
        return (
            <ClickAwayListener onClickAway={this.offPopup}>
                <div>
                <span id="activity" onClick={this.toggleDropdown} ref="dropdownToggle" className="activity-dropdown">
                    <i className="fa fa-bell"/>
                    <b className={(countNotRead > 0) ? 'badge bg-color-red' : 'badge'}>{countNotRead}</b>
                </span>
                    <div className="ajax-dropdown" ref="dropdown">
                        {/* notification header */}
                        <div className="btn-group btn-group-justified" data-toggle="buttons">
                            <label className={classnames(["btn", "btn-default", "msgs"])} >
                                <input type="radio" name="activity"/><T>Thông báo</T>{` (${dataNotify.length})`}
                            </label>
                        </div>
                        {/* notification content */}
                        <div className="ajax-notifications custom-scroll bg-color-white">
                            <Content onView={this.onView} onDelete={this.onDelete} dataNotify={dataNotify} />
                            <div style={{float: "left", clear: "both"}}
                                 ref={(el) => {
                                     this.bottomSpan = el;
                                 }}>
                            </div>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>

        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        language: state.language,
        pathname: state.router.location.pathname,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}


export default connect(mapStateToProps, mapDispatchToProps)(Activities)



