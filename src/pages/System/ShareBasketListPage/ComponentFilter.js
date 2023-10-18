import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import { getListRoomItems } from "api/auth";
class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room_list: []
        };
    }

    async _getRoom() {
        const res = await getListRoomItems();
        if(res) {
            this.setState({
                room_list: res || []
            })
        }
    }

    componentDidMount() {
        this._getRoom();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        const {room_list} = this.state;
        const employer_assigned_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_assigned_type);
        const mode = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_staff_mode);
        const staff_level = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_staff_level);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="dropbox" label="Phòng" key_value="id" key_title="name" name="room_id" data={room_list}/>
                <SearchField type="dropbox" label="Loại CSKH" name="employer_care_type" data={employer_assigned_type}/>
                <SearchField type="dropbox" label="Level CSKH" name="customer_care_level" data={staff_level}/>
                <SearchField type="dropbox" label="Chế độ CSKH" name="mode" data={mode}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        province: state.province,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
