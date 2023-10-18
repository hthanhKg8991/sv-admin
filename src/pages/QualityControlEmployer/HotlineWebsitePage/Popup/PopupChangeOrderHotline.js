import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import Sortable from 'react-sortablejs';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PopupChangeOrderHotline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list_north: [],
            data_list_south: [],
            object: Object.assign({}, props.object),
            object_required: ['team_id', 'staff_id', 'displayed_name', 'phone'],
            object_error: {},
            name_focus: "",
            team_list: [],
            staff_list: []
        };
        this.refreshList = this._refreshList.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onChangeSouth = this._onChangeSouth.bind(this);
        this.onChangeNorth = this._onChangeNorth.bind(this);
    }

    _refreshList(delay = 0) {
        this.setState({loading: true});
        let args = {};
        args['order_by[ordering]'] = 'ASC';
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LIST, args, delay);
    }

    _onSave() {
        let data_list = [...this.state.data_list_south, ...this.state.data_list_north].filter(c => c.ordering !== null);
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_CHANGE_ORDERING, {list_new: data_list});
    }

    _onChangeSouth(list) {
        let data_list_south = [];
        list.forEach((i, key) => {
            let item = this.state.data_list_south.filter(c => c.old_ordering === i);
            if (item.length) {
                item[0].ordering = item[0].old_ordering !== String(key + 1) ? String(key + 1) : null;
                data_list_south.push(item[0]);
            }
        });
        this.setState({data_list_south});
    }

    _onChangeNorth(list) {
        let data_list_north = [];
        list.forEach((i, key) => {
            let item = this.state.data_list_north.filter(c => c.old_ordering === i);
            if (item.length) {
                item[0].ordering = item[0].old_ordering !== String(key + 1) ? String(key + 1) : null;
                data_list_north.push(item[0]);
            }
        });
        this.setState({data_list_north});
    }

    componentWillMount() {
        this.refreshList();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let data_list_south = [];
                let data_list_north = [];
                response.data.forEach((i, key) => {
                    let item = Object.assign({}, i);
                    item.old_ordering = String(i.ordering);
                    item.ordering = null;
                    if (i.branch_code.includes("south")) {
                        data_list_south.push(item);
                    } else {
                        data_list_north.push(item);
                    }
                });
                this.setState({data_list_south, data_list_north});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_CHANGE_ORDERING]) {
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_CHANGE_ORDERING];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('HotlineWebsitePage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_CHANGE_ORDERING);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        let {data_list_south, data_list_north} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave();
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer" style={{minHeight: "250px"}}>
                        <div className="row mt5">
                            <div className="col-12 text-center">
                                <h5>Miền Nam</h5>
                            </div>
                        </div>
                        <div className="form-container row">
                            <Sortable onChange={(order) => {
                                this.onChangeSouth(order);
                            }}>
                                {data_list_south.map((item) => {
                                    return (
                                        <div key={item.old_ordering} data-id={item.old_ordering}
                                             className="col-sm-4 col-xs-6 move mt15">
                                            <span>
                                                <span
                                                    className="label hotline-order">{item.ordering ? `${item.old_ordering} → ${item.ordering}` : item.old_ordering}</span>&nbsp;
                                                <span className="textRed">{item.phone}</span>&nbsp;
                                                <span className="text">{item.displayed_name}</span>
                                            </span>
                                        </div>
                                    )
                                })}
                            </Sortable>
                        </div>
                        <div className="row mt5">
                            <div className="col-12 text-center">
                                <h5>Miền Bắc</h5>
                            </div>
                        </div>
                        <div className="row">
                            <Sortable onChange={(order) => {
                                this.onChangeNorth(order);
                            }}>
                                {data_list_north.map((item) => {
                                    return (
                                        <div key={item.old_ordering} data-id={item.old_ordering}
                                             className="col-sm-4 col-xs-6 move mt15">
                                            <span>
                                                <span
                                                    className="label hotline-order">{item.ordering ? `${item.old_ordering} → ${item.ordering}` : item.old_ordering}</span>&nbsp;
                                                <span className="textRed">{item.phone}</span>&nbsp;
                                                <span className="text text-over"
                                                      title={item.displayed_name}>{item.displayed_name}</span>
                                            </span>
                                        </div>
                                    )
                                })}
                            </Sortable>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeOrderHotline);
