import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import {getListRoom} from "api/auth";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            roomList: []
        };
        this.getRoom = this._getRoom.bind(this);
    }

    async _getRoom() {
        const res = await getListRoom({status: Constant.STATUS_ACTIVED});
        if (res && Array.isArray(res?.items)) {
            const roomList = res.items.map(room => {
                return {title: room?.name, value: room?.id}
            });
            this.setState({
                roomList: roomList
            })
        }
    }

    componentDidMount() {
        this.getRoom();
    }

    render() {
        const {query, menuCode, idKey} = this.props;
        const {roomList} = this.state;

        const revenue_config_rating = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_revenue_config_rating);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Mã, Tên NV" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Phòng" name="room_id" data={roomList}/>
                <SearchField type="dropbox" label="Trạng thái" name="rating" data={revenue_config_rating}/>
                <SearchField type="datetimerangepicker" label="Ngày tính" name="created_at"/>
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
