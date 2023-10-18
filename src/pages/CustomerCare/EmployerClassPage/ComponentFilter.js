import React, {Component} from "react";
import {connect} from "react-redux";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {bindActionCreators} from "redux";
import {getListRoom, getTeamMember} from "api/auth";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
            room_list: [],
        };
    }

    async _getCustomerCare() {
        const res = await getTeamMember({
            division_code_list: [
                Constant.DIVISION_TYPE_customer_care_leader,
                Constant.DIVISION_TYPE_customer_care_member,
            ]
        });
        if (res) {
            this.setState({
                staff_list: res
            });
        }
    }

    async _getRoom() {
        const res = await getListRoom({status: Constant.STATUS_ACTIVED, is_role: true});
        if (res && Array.isArray(res?.items)) {
            const roomList = res.items.map(room => {
                return {title: room?.name, value: room?.id}
            });
            this.setState({
                room_list: roomList
            })
        }
    }

    componentDidMount() {
        this._getCustomerCare();
        this._getRoom();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        const {query, menuCode, idKey} = this.props;
        const {staff_list, room_list} = this.state;
        const employer_class = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_class);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Id, Tên, Email" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Phân loại hiện tại" name="employer_classification_new" data={employer_class}/>
                <SearchField type="dropbox" label="Phân loại cũ" name="employer_classification_old" data={employer_class}/>
                <SearchField type="datetimerangepicker" label="Ngày chuyển phân loại" name="created_at"/>
                <SearchField type="dropboxmulti" label="Phòng" name="room_id" data={room_list}/>
                <SearchField type="dropbox" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name"
                             data={staff_list}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
