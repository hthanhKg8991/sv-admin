import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import {getTeamList} from "api/auth";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team_list: [],
        };
        this.onSearch = this._onSearch.bind(this);
    }
    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('HotlineWebsitePage');
    }
    async _getListTeam() {
        const res = await getTeamList();
        if(res) {
            this.setState({team_list: res});
        }
    }
    componentWillMount(){
        this.props.uiAction.refreshList('HotlineWebsitePage');
    }
    componentDidMount() {
        this._getListTeam();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        const {team_list} = this.state;
        const {branch} = this.props;
        let branch_list = branch.branch_list.filter(c => c.channel_code === branch.currentBranch.channel_code)
            .map(b => {return {title: b.name, value: b.code}});
        let visible_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_visible_status);
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={visible_status}/>
                <SearchField type="input" label="Số điện thoại" name="phone" timeOut={1000}/>
                <SearchField type="dropbox" label="Nhóm" name="team_id" key_value="id" key_title="name" data={team_list}/>
                <SearchField type="dropbox" label="Vùng miền" name="branch_code" data={branch_list}/>
            </BoxSearch>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
