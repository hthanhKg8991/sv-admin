import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import PopupCustomFilter from "./Popup/PopupCustomFilter"
import * as uiAction from "actions/uiAction";
import _ from "lodash";
import T from "components/Common/Ui/Translate";

class BoxSearchRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_all: false,
            param_search: queryString.parse(window.location.search),
            lang: props.lang
        };
        this.showAll = this._showAll.bind(this);
        this.notShowAll = this._notShowAll.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.onChangeField = this._onChangeField.bind(this);
        this.refreshFilter = this._refreshFilter.bind(this);
    }

    _showAll() {
        this.setState({show_all: true});
    }

    _notShowAll() {
        this.setState({show_all: false});
    }

    _btnAdd() {
        if (Object.entries(this.state.param_search).length === 0) {
            this.props.uiAction.putToastError("Vui lòng chọn trường lọc trước khi tạo bộ lọc!");
        } else {
            this.props.uiAction.createPopup(PopupCustomFilter, "Tạo Bộ Lọc", {param_search: this.state.param_search})
        }
    }

    _onChangeField(value, key) {
        let param_search = Object.assign({}, this.state.param_search);
        Object.keys(param_search).forEach((item) => {
            if (key === item || (Array.isArray(key) && key.includes(item)) || item.indexOf(key + '[') >= 0) {
                delete param_search[item];
            }
        });
        if (value) {
            if (typeof value === "object") {
                param_search = Object.assign(param_search, value);
            } else {
                param_search[key] = value;
            }
        }
        if (this.props.onChange && !(JSON.stringify(param_search) === JSON.stringify(this.state.param_search))) {
            delete (param_search['page']);
            delete (param_search['per_page']);

            this.props.onChange(param_search);
            this.props.uiAction.refreshList('CustomFilter', {load: true});
        }
        this.setState({param_search: param_search});
    }

    _refreshFilter() {
        let param_search = {};
        if (this.props.onChange) {
            this.props.onChange(param_search);
            this.props.uiAction.refreshList('CustomFilter', {load: true});
        }
        this.setState({param_search: param_search});
    }

    componentWillReceiveProps(newProps) {
        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))) {
            this.setState({lang: newProps.lang});
        }
        if (newProps.refresh['BoxSearch']) {
            let query = queryString.parse(window.location.search);
            if (!(JSON.stringify(query) === JSON.stringify(this.state.param_search))) {
                this.setState({param_search: query});
            }
            this.props.uiAction.deleteRefreshList('BoxSearch');
        }

        if (newProps.filter && !_.isEqual(newProps.filter, this.state.param_search)) {
            this.setState({param_search: newProps.filter});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        return (
            <div className="card-body-search" style={{padding: "10px 20px"}}>
                <div className="card-box-search">
                    <form className="box-search-form">
                        {Array.isArray(this.props.children) && this.props.children.map((item, key) => {
                            if (key > this.props.showQtty - 1 && !this.state.show_all) {
                                return (
                                    <React.Fragment key={key}/>
                                )
                            }
                            return (
                                <div className="mb10" key={key}>
                                    {React.cloneElement(
                                        item, {
                                            param_search: this.state.param_search,
                                            onChangeField: this.onChangeField
                                        }
                                    )}
                                </div>
                            )
                        })}
                        {!Array.isArray(this.props.children) && (
                            <div className="mb10">
                                {React.cloneElement(
                                    this.props.children, {
                                        param_search: this.state.param_search,
                                        onChangeField: this.onChangeField
                                    }
                                )}
                            </div>
                        )}
                        {Array.isArray(this.props.children) && this.props.children.length > this.props.showQtty && !this.state.show_all && (
                            <div className="view-all mt15">
                                <span className="text-underline text-primary pointer"
                                      onClick={this.showAll}><T>Xem thêm</T></span>
                            </div>
                        )}
                        {Array.isArray(this.props.children) && this.props.children.length > this.props.showQtty && this.state.show_all && (
                            <div className="view-all mt15">
                                <span className="text-underline text-primary pointer" onClick={this.notShowAll}><T>Rút gọn</T></span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.language,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BoxSearchRow);
