import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import T from "components/Common/Ui/Translate";

class BoxSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_all: false,
            param_search: props.filter
        };
        this.showAll = this._showAll.bind(this);
        this.notShowAll = this._notShowAll.bind(this);
        this.onChangeField = this._onChangeField.bind(this);
    }

    _showAll() {
        this.setState({show_all: true});
    }

    _notShowAll() {
        this.setState({show_all: false});
    }

    _onChangeField(value, key) {
        let param_search = Object.assign({}, this.state.param_search);
        Object.keys(param_search).forEach((item) => {
            if (key === item || (Array.isArray(key) && key.includes(item)) || item.indexOf(key + '[') >= 0) {
                delete param_search[item];
            }
        });
        if (value || value === 0) {
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
        }

        this.setState({param_search: param_search});
    }

    componentWillReceiveProps(newProps) {
        if (newProps.filter && !_.isEqual(newProps.filter, this.state.param_search)) {
            this.setState({param_search: newProps.filter});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        let className = _.get(this.props, ['children', 'props', 'className'], null);
        return (
            <React.Fragment>
                {Array.isArray(this.props.children) && this.props.children.map((item, key) => {
                    if (key > this.props.showQtty - 1 && !this.state.show_all) {
                        return (
                            <React.Fragment key={key}/>
                        )
                    }

                    let className = _.get(item, ['props', 'className'], null);
                    return (
                        <div className={`mb10 ${className || null}`} key={key}>
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
                    <div className={`mb10 ${className || null}`}>
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
                        <span className="text-underline text-primary pointer"
                              onClick={this.notShowAll}><T>Thu gọn</T></span>
                    </div>
                )}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.language
    };
}

export default connect(mapStateToProps, null)(BoxSearch);
