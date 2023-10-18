import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import _ from 'lodash';
import * as apiFn from "api";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import * as apiAction from "actions/apiAction";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomList: []
        };
        this.onSearch = this._onSearch.bind(this);
        this.onChangeBranch = this._onChangeBranch.bind(this);
    }

    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('CustomerServicePage');
    }

    _onChangeBranch(value){
        if (!value) {
            this.setState({roomList: []});
        } else {
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_ROOM_LIST, {
                branch_code: value
            });
        }
    }

    componentDidMount(){
        this.props.uiAction.refreshList('CustomerServicePage');
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_ROOM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_ROOM_LIST];
            let data = [];
            if (response.code === Constant.CODE_SUCCESS) {
                _.forEach(response.data.items, (item) => {
                    data.push({value: item.id, title: item.name});
                })
            }

            this.setState({roomList: data});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ROOM_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let branch_list = [];
        _.forEach(this.props.branch.branch_list, (item) => {
            if(item.channel_code === this.props.branch.currentBranch.channel_code){
                branch_list.push({value: item.code, title: item.name});
            }
        });

        let status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_team_status);
        const {roomList} = this.state;

        return (
            <BoxSearch showQtty={5} onChange={this.onSearch}>
                <SearchField type="input" label="Tên nhóm" name="q" timeOut={1000}/>
                <SearchField type="input" label="Email/ Id Trưởng nhóm" name="q_leader" timeOut={1000}/>
                <SearchField type="dropbox" label="Chi nhánh" name="branch_code" data={branch_list} onChangeSearch={this.onChangeBranch}/>
                <SearchField type="dropbox" label="Phòng" name="room_id" data={roomList}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status}/>
            </BoxSearch>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
