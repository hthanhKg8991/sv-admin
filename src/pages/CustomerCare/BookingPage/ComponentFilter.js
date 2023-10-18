import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import {getListBox} from "api/booking";
import {getMembers} from "api/auth";
import _ from "lodash";
import {asyncApi} from "api";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staffList: [],
            boxList: []
        };
    }

    async initData() {
        let fetch = {};
        let division_code = _.get(this.props, ['user', 'division_code'], null);
        let args = {};
        args['division_code_list[0]'] = Constant.DIVISION_TYPE_customer_care_member;
        if (division_code !== Constant.DIVISION_TYPE_customer_care_member) {
            args['division_code_list[1]'] = Constant.DIVISION_TYPE_customer_care_leader;
        }
        fetch['staffList'] = getMembers();
        fetch['boxList'] = getListBox();

        const res = await asyncApi(fetch);
        this.setState({...res});
    }

    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps(newProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        let {staffList, boxList} = this.state;
        let booking_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_booking_status);
        let area_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_area);
        // area_list = area_list.filter(c => parseInt(c.value) !== Constant.AREA_ALL);
        const {query, menuCode} = this.props;

        return (
            <FilterLeft idKey={"BookingList"} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID đặt chổ, ID NTD, email NTD"
                             name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái"
                             name="booking_status" data={booking_status}/>
                <SearchField type="dropbox" label="Khu vực hiển thị"
                             name="displayed_area" data={area_list}/>
                <SearchField type="dropbox" label="Gói dịch vụ"
                             name="booking_box_id" data={boxList} key_value="id"
                             key_title="name"/>
                <SearchField type="datetimerangepicker" label="Ngày đặt chổ" name="created_at"/>
                <SearchField type="datetimerangepicker" label="Ngày lên tin" name="booking_date"/>
                <SearchField type="dropboxmulti" label="CSKH" name="staff_id"
                             key_value="id" key_title="login_name"
                             data={staffList}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
