import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import _ from "lodash";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
            room_list: [],
        };
    }

    _getRoom() {
        const {branch} = this.props;
        const branch_code = branch.currentBranch.code;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_ROOM_LIST, {
            branch_code: branch_code
        });
    }

    _getCustomerCare(){
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_STAFF_CUSTOMER_CARE, {
            employer_care_type: Constant.EMPLOYER_ASSIGNED_TYPE_NOT_POPENTIAL
        });
    }

    componentDidMount(){
        this._getCustomerCare();
        this._getRoom();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_STAFF_CUSTOMER_CARE]){
            let response = newProps.api[ConstantURL.API_URL_GET_STAFF_CUSTOMER_CARE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_STAFF_CUSTOMER_CARE);
        }
        if (newProps.api[ConstantURL.API_URL_GET_ROOM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_ROOM_LIST];
            let data = [];
            if (response.code === Constant.CODE_SUCCESS) {
                _.forEach(response.data.items, (item) => {
                    data.push({value: item.id, title: item.name});
                })
            }
            this.setState({room_list: data});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ROOM_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        let {staff_list, room_list} = this.state;
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        employer_status = employer_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        const employer_premium_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_premium_status);
        const employer_folder = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_folder);
        const employer_email_verified_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_email_verified_status);
        const employer_company_kind = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_kind);
        const employer_company_size = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_size);
        const {query, menuCode, idKey} = this.props;

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                {/*id,name,email,phone*/}
                <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
                {/*assigned_staff_id*/}
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="name" data={staff_list}/>
                {/*premium_status*/}
                <SearchField type="dropbox" label="Loại tài khoản" name="premium_status" data={employer_premium_status}/>
                {/*status*/}
                <SearchField type="dropbox" label="Trạng thái tài khoản" name="status" data={employer_status}/>
                {/*email_verified_status*/}
                <SearchField type="dropbox" label="Xác thực email" name="email_verified_status" data={employer_email_verified_status}/>
                {/*company_size*/}
                <SearchField type="dropbox" label="Loại quy mô" name="company_kind" data={employer_company_kind}/>
                {/*company_size*/}
                <SearchField type="dropbox" label="Quy mô công ty" name="company_size" data={employer_company_size}/>
                {/*room_id*/}
                <SearchField type="dropboxmulti" label="Phòng" name="room_id" data={room_list}/>
                {/*folder*/}
                <SearchField type="dropbox" label="Thư mục" name="folder" data={employer_folder}/>
                {/*created_at*/}
                <SearchField type="datetimerangepicker" label="Ngày đăng ký" name="created_at"/>
                {/*assigning_changed_at*/}
                <SearchField type="datetimerangepicker" label="Ngày vào giỏ" name="assigning_changed_at"/>
                {/*premium_end_at*/}
                <SearchField type="datetimerangepicker" label="Thời hạn VIP" name="premium_end_at"/>
                {/*last_logged_in_at*/}
                <SearchField type="datetimerangepicker" label="Lần đăng nhập cuối" name="last_logged_in_at"/>
                {/*rival_type*/}
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        user: state.user,
        branch: state.branch
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
