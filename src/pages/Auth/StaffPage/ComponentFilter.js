import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            division_list: []
        };
        this.onSearch = this._onSearch.bind(this);
        this.getDivision = this._getDivision.bind(this);
        this.getDataGroup = this._getDataGroup.bind(this);
    }
    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('StaffPage');
    }
    _getDivision(){
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_DIVISION_LIST);
    }
    _getDataGroup(){
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST, {execute: true});
    }
    componentWillMount(){
        this.getDivision();
        this.getDataGroup();
        this.props.uiAction.refreshList('StaffPage');
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DIVISION_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_DIVISION_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({division_list: response.data});
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_group_list: response.data});
            }
            this.setState({loading: false});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {division_list, data_group_list} = this.state;
        let division_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_division_status);
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="input" label="Tên, email, điện thoại" name="q" timeOut={1000}/>
                <SearchField type="input" label="Mã nhân viên" name="staff_code" timeOut={1000}/>
                <SearchField type="input" label="Line" name="xlite_ids[]" timeOut={1000}/>
                <SearchField type="dropbox" label="Bộ phận" name="division_code" data={division_list} key_value="code" key_title="full_name"/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={division_status}/>
                <SearchField type="dropbox" label="Nhóm dữ liệu" name="data_group_code" data={data_group_list} key_value="code" key_title="name"/>
            </BoxSearch>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
