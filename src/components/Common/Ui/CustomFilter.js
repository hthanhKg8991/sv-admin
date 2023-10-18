import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import createStore from 'store/configureStore';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as Utils from "utils/utils";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import _ from "lodash";
import T from "components/Common/Ui/Translate";

const { history } = createStore();

class CustomFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_all: false,
            getList: false,
            data_list: [],
            current_query: null,
            current_active: null,
            limit: 5,
            loading: false,
            lang: props.lang
        };
        this.showAll = this._showAll.bind(this);
        this.notShowAll = this._notShowAll.bind(this);
        this.onClickFilter = this._onClickFilter.bind(this);
        this.onDeleteFilter = this._onDeleteFilter.bind(this);
        this.refreshList = this._refreshList.bind(this);
    }
    _showAll(event){
        this.setState({show_all: true});
    }

    _notShowAll(event){
        this.setState({show_all: false});
    }

    _onClickFilter(query, active_item){
        this.setState({current_active: active_item});
        this.setState({current_query: query});
        let pathname = window.location.pathname;
        let url = pathname + "?" + query;
        history.push(url);
        this.props.uiAction.refreshList(this.props.name);
        this.props.uiAction.refreshList('BoxSearch');
    }

    _onDeleteFilter(id, key){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa bộ lọc ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_CUSTOM_FILTER_DELETE, {id, key});
            }
        });
    }

    _refreshList(menuList = null){
        let menu_code;
        let pathname = window.location.pathname;
        let menu = !_.isEmpty(menuList) ? menuList : _.get(this.props.sys, 'menu', {});

        Object.keys(menu).forEach((name) => {
            if(menu[name].url === pathname){
                menu_code = menu[name].code;
            }else if(menu[name].child){
                menu[name].child.forEach((item) => {
                    if(item.url === pathname){
                        menu_code = item.code;
                    }
                })
            }
        });

        if(menu_code){
            this.setState({loading: true});
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_CUSTOM_FILTER_LIST, {menu_code});
        }
    }

    componentDidMount(){
        //lấy lại chuỗi query bộ lọc
        //parse obj
        let query = queryString.parse(window.location.search);
        query = Utils.deleteQueryNotUsed(query);
        //parse string
        query = queryString.stringify(query);
        //ham queryString.parse sort lại param nên thứ tự query lúc parse lại string khác lúc đầu
        this.setState({current_query: query});
        if(!_.isEmpty(this.props.sys.menu)){
            this.refreshList();
        }
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(newProps.sys.menu) !== JSON.stringify(this.props.sys.menu)){
            this.refreshList(newProps.sys.menu);
        }

        if (!(JSON.stringify(newProps.lang) === JSON.stringify(this.state.lang))){
            this.setState({lang: newProps.lang});
        }

        if (newProps.api[ConstantURL.API_URL_GET_CUSTOM_FILTER_LIST]) {
            this.setState({loading: false});
            let response = newProps.api[ConstantURL.API_URL_GET_CUSTOM_FILTER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
                response.data.forEach((item, key) => {
                    //vì this.state.current_query bị sort param nên sort param item lại cho như nhau
                    if (queryString.stringify(queryString.parse(item.http_build_query)) === this.state.current_query) {
                        this.setState({current_active: key});
                        //nếu active phần tử lớn hơn limit thì mặc định hiện phần xem them
                        if (key >= this.state.limit) {
                            this.setState({show_all: true});
                        }
                    }
                })
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_CUSTOM_FILTER_LIST);
        }

        if (newProps.api[ConstantURL.API_URL_POST_CUSTOM_FILTER_DELETE]) {
            this.props.uiAction.hideSmartMessageBox();
            let response = newProps.api[ConstantURL.API_URL_POST_CUSTOM_FILTER_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Xóa bộ lọc thành công");
                let data_list = this.state.data_list;
                data_list = data_list.filter((item, key) => key !== response.info?.args?.key);
                this.setState({data_list: data_list});
                let current_active = this.state.current_active;
                this.setState({current_active: current_active - 1});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CUSTOM_FILTER_DELETE);
        }

        if (newProps.refresh['CustomFilter']){
            if(!newProps.refresh['CustomFilter'].load){
                this.refreshList();
            }else{
                let query = queryString.parse(window.location.search);
                query = Utils.deleteQueryNotUsed(query);
                query = queryString.stringify(query);
                this.setState({current_query: query});

                let current_active = -1;
                this.state.data_list.forEach((item, key) => {
                    if (queryString.stringify(queryString.parse(item.http_build_query)) === query) {
                        current_active = key;
                        if (key >= this.state.limit) {
                            this.setState({show_all: true});
                        }
                    }
                });
                this.setState({current_active: current_active});
            }
            this.props.uiAction.deleteRefreshList('CustomFilter');
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state);
    }

    render () {
        return (
            <div className="box-card">
                <div className="box-card-title">
                    <span className="title left"><T>Lọc Nhanh</T></span>
                    <div className="right">
                        <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                            <i className="fa fa-refresh"/>
                        </button>
                    </div>
                </div>
                {this.state.loading ? (
                    <div className="relative card-body text-center">
                        <LoadingSmall />
                    </div>
                ) : (
                    <div className="relative card-body">
                        <div className="card-box-search">
                            {this.state.data_list.map((item, key) => {
                                if (key < this.state.limit) {
                                    if (key !== this.state.current_active) {
                                        if (parseInt(item.filter_type) === Constant.CUSTOM_FILTER_PUBLIC) {
                                            return (
                                                <div className="custom-filter" key={key}>
                                                    <button type="button" title={item.name} className="el-button el-button-small mb10 el-button-default btn-filter"
                                                            onClick={this.onClickFilter.bind(this, item.http_build_query,key)}
                                                    >
                                                        <span>{item.name}</span>
                                                    </button>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="custom-filter" key={key}>
                                                    <button type="button" title={item.name} className="el-button el-button-small mb10 el-button-default btn-filter"
                                                            onClick={this.onClickFilter.bind(this, item.http_build_query,key)}
                                                    >
                                                        <span>{item.name}</span>
                                                    </button>
                                                    <div className="delete-filter" onClick={this.onDeleteFilter.bind(this,item.id,key)}>x</div>
                                                </div>
                                            )
                                        }
                                    } else {
                                        return (
                                            <div className="custom-filter" key={key}>
                                                <button type="button" title={item.name} className="el-button el-button-small mb10 el-button-default btn-filter active">
                                                    <span>{item.name}</span>
                                                </button>
                                                <div className="delete-filter" onClick={this.onDeleteFilter.bind(this,item.id,key)}>x</div>
                                            </div>
                                        )
                                    }
                                }else{
                                    return(
                                        <React.Fragment key={key} />
                                    )
                                }
                            })}
                            {this.state.data_list.length > 5 && !this.state.show_all &&(
                                <div className="view-all">
                                    <span className="pointer text-primary text-underline" onClick={this.showAll}><T>Xem thêm</T></span>
                                </div>
                            )}
                            {this.state.show_all && (
                                this.state.data_list.map((item, key) => {
                                    if (key >= this.state.limit) {
                                        if (key !== this.state.current_active) {
                                            if (parseInt(item.filter_type) === Constant.CUSTOM_FILTER_PUBLIC) {
                                                return (
                                                    <div className="custom-filter" key={key}>
                                                        <button  type="button" title={item.name} className="el-button el-button-small mb10 el-button-default btn-filter"
                                                                 onClick={this.onClickFilter.bind(this, item.http_build_query,key)}
                                                        >
                                                            <span>{item.name}</span>
                                                        </button>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className="custom-filter" key={key}>
                                                        <button type="button" title={item.name} className="el-button el-button-small mb10 el-button-default btn-filter"
                                                                onClick={this.onClickFilter.bind(this, item.http_build_query,key)}
                                                        >
                                                            <span>{item.name}</span>
                                                        </button>
                                                        <div className="delete-filter" onClick={this.onDeleteFilter.bind(this,item.id,key)}>x</div>
                                                    </div>
                                                )
                                            }
                                        } else {
                                            return (
                                                <div className="custom-filter">
                                                    <button key={key} type="button" title={item.name} className="el-button el-button-small mb10 el-button-default btn-filter active">
                                                        <span>{item.name}</span>
                                                    </button>
                                                    <div className="delete-filter" onClick={this.onDeleteFilter.bind(this,item.id,key)}>x</div>
                                                </div>
                                            )
                                        }
                                    }else{
                                        return(
                                            <React.Fragment key={key} />
                                        )
                                    }
                                })
                            )}
                            {this.state.show_all && (
                                <div className="view-all">
                                    <span className="pointer text-underline text-primary" onClick={this.notShowAll}><T>Rút gọn</T></span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        refresh: state.refresh,
        lang: state.language,
        api: state.api,
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomFilter);
