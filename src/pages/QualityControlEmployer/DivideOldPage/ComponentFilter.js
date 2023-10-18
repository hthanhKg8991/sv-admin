import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as Constant from 'utils/Constant';
import * as utils from 'utils/utils';
import * as apiFn from "api";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomList: null,
        }
    }

    _getRoomList(branch) {
        if(branch){
            let params = [];
            params['branch_code'] = branch;
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_ROOM_LIST, params);
        }else{
            this.setState({roomList: null})
        }
    }

    componentDidMount(){
        const {query} = this.props;
        this._getRoomList(query?.branch_code);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.query?.branch_code !== this.props.query?.branch_code) {
            this._getRoomList(newProps.query?.branch_code);
        }
        //list phòng
        if (newProps.api[ConstantURL.API_URL_GET_ROOM_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_ROOM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({roomList: response.data.items});
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ROOM_LIST);
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    //         JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    // }

    render() {
        const {query, menuCode, idKey, branch, sys} = this.props;

        const {roomList} = this.state;
        const currentBranch = branch?.currentBranch;
        const branchList = branch?.branch_list?.filter(_ => (_.channel_code === currentBranch.channel_code));
        const staffLevelList = utils.convertArrayValueCommonData(sys.common.items,Constant.COMMON_DATA_KEY_staff_level);
        const throwout_type = utils.convertArrayValueCommonData(sys.common.items,Constant.COMMON_DATA_KEY_throw_customer_type);
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="dropbox"  label="Loại xả" name="type" noDelete
                             data={throwout_type}/>
                <SearchField type="input" label="Email CSKH" name="staff_username" timeOut={1000}/>
                <SearchField type="input" label="Tên Nhóm" name="team_name" timeOut={1000}/>
                <SearchField type="dropbox" key_value="code" key_title="title" label="Vùng miền" name="branch_code"
                             data={branchList}/>
                <SearchField type="dropbox" key_value="id" key_title="name" label="Phòng" name="room_id"
                             data={roomList || []}/>
                <SearchField type="dropbox" label="Level" name="level"
                             data={staffLevelList || []} />
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        province: state.province,
        user: state.user,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
