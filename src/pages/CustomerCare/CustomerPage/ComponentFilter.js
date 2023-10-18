import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import {getMembers, getListRoom} from "api/auth";
import {getVsic} from "api/system";

class ComponentFilter extends Component {

    constructor(props) {
		super(props);
		this.state = {
			staffList: [],
            vsics: [],
            listRoom: []
		};
	}

    async _getCustomerCare(){
		let division_code = this.props.user ? this.props.user.division_code : "";
		let args = {};
		args["division_code_list[0]"] = Constant.DIVISION_TYPE_customer_care_member;
		if(division_code !== Constant.DIVISION_TYPE_customer_care_member) {
			args["division_code_list[1]"] = Constant.DIVISION_TYPE_customer_care_leader;
		}
        const resMember = await getMembers(args);
        this.setState({staffList: resMember})
	}

    async _getListVsic() {
        const res = await getVsic();
        if(res) {
            this.setState({
                vsics: res || []
            })
        }
    }

    async _getListRoom() {
        const res = await getListRoom();
        if(res && res?.items) {
            this.setState({
                listRoom: res?.items || []
            })
        }
    }
    
    componentDidMount(){
        this._getListVsic();
        this._getListRoom();
        this._getCustomerCare()
    }

    render () {
        const {query, menuCode, idKey, vsics, sys, listRoom} = this.props;
        const {staffList} = this.state
        const customer_type_code = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_customer_type_code);
        const customer_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_customer_status);
        const fraud_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_fraud_status);
        const employer_company_size = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_company_size);
        const viscFilter = vsics?.filter(v => v?.parent !== 0)?.map((item) => {
            return {
                value: item?.id,
                title: item?.name
            }
        }) || [];
        const viscOptions = [{title: "NTD không có Lĩnh vực hoạt động", value: -1}, ...viscFilter];
        const province = sys.province.items?.map((item) => {
            return {
                value: item?.id,
                title: item?.name
            }
        }) || [];
        const staffListRecook = [{id: -1, login_name:"Chưa có CSKH"}, ...staffList]

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={12}>
                <SearchField type="input" label="ID, Tên" name="q" timeOut={1000}/>
                <SearchField type="input" label="Mã code" name="code" timeOut={1000}/>
                <SearchField type="dropbox" label="Loại code" name="type_code" data={customer_type_code}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={customer_status}/>
                <SearchField type="dropbox" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staffListRecook}/>
                <SearchField type="dropbox" label="Loại phòng" name="room_id" key_value="id" key_title="name" data={listRoom}/>
                <SearchField type="dropbox" label="Phân loại Customer" name="fraud_status" data={fraud_status}/>
                <SearchField type="dropbox" label="Quy mô" name="company_kind" data={employer_company_size}/>
                <SearchField type="dropbox" label="Lĩnh vực hoạt động" name="fields_activity" data={viscOptions}/>
                <SearchField type="dropbox" label="Tỉnh thành" name="province_id" data={province}/>
                <SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at" />
                <SearchField type="input" label="ID NTD" name="employer_id" timeOut={1000}/>
                <SearchField type="input" label="Email NTD" name="employer_email" timeOut={1000}/>
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
