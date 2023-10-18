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
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
            account_service_staff_list: [],
        };
    }

    _getCustomerCare(){
        let division_code = this.props.user ? this.props.user.division_code : '';
        let args = {};
        args['division_code_list[0]'] = Constant.DIVISION_TYPE_customer_care_member;
        if(division_code !== Constant.DIVISION_TYPE_customer_care_member) {
            args['division_code_list[1]'] = Constant.DIVISION_TYPE_customer_care_leader;
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_TEAM_MEMBER_LIST, args);
    }

    _getAccountServiceCustomerCare() {
        let args = {
            division_code: [Constant.COMMON_DATA_KEY_account_service, Constant.COMMON_DATA_KEY_account_service_lead, Constant.COMMON_DATA_KEY_account_service_manager],
            page: 1,
            per_page: 1000,
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, args);
    }

    componentDidMount(){
        this._getCustomerCare();
        this._getAccountServiceCustomerCare();
        
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]) {
            let responseAS = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
            if (responseAS.code === Constant.CODE_SUCCESS) {
                this.setState({ account_service_staff_list: responseAS?.data?.items || [] });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }

    render () {
        let { staff_list, account_service_staff_list } = this.state;
        const {idKey, query, menuCode, is_archived} = this.props;
        const employer_premium_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_premium_status);
        const job_post_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_job_status);
        const type_sales_order_id = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_type_sales_order_id);
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_status);
        employer_status = employer_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        const created_source = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_created_source);

        if(is_archived){
            return (
                <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                    {/*job_q*/}
                    <SearchField type="input" label="ID tin, tiêu đề tin" name="job_q" timeOut={1000}/>
                    {/*employer_q*/}
                    <SearchField type="input" label="ID NTD, tên NTD, email" name="employer_q" timeOut={1000}/>
                    {/*assigned_staff_id*/}
                    <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
                    <SearchField type="dropboxmulti" label="CSKH Account Service" name="account_service_assigned_id"
                        key_title="login_name" key_value="id" data={account_service_staff_list} />
                    {/*created_at*/}
                    <SearchField type="dropbox" label="Loại tài khoản" name="premium_status" data={employer_premium_status} />
                    <SearchField type="dropbox" label="Trạng thái tài khoản" name="employer_status" data={employer_status} />
                    <SearchField type="dropbox" label="Trạng thái tin" name="status_combine" data={job_post_status} />
                    <SearchField type="datetimerangepicker" label="Ngày kích hoạt" name="approved_at" />
                    <SearchField type="dropbox" label="Nhãn gói" name="type_sales_order_id" data={type_sales_order_id} />
                    <SearchField type="dropbox" label="Nguồn tạo" name="old_channel_code" data={created_source}/>
                </FilterLeft>
            )
        }


        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                {/*job_q*/}
                <SearchField type="input" label="ID tin, tiêu đề tin" name="job_q" timeOut={1000}/>
                {/*employer_q*/}
                <SearchField type="input" label="ID NTD, tên NTD, email" name="employer_q" timeOut={1000}/>
                {/*assigned_staff_id*/}
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
                <SearchField type="dropboxmulti" label="CSKH Account Service" name="account_service_assigned_id"
                    key_title="login_name" key_value="id" data={account_service_staff_list} />
                {/*created_at*/}
                <SearchField type="dropbox" label="Loại tài khoản" name="premium_status" data={employer_premium_status} />
                <SearchField type="dropbox" label="Trạng thái tài khoản" name="employer_status" data={employer_status} />
                <SearchField type="dropbox" label="Trạng thái tin" name="status_combine" data={job_post_status} />
                <SearchField type="datetimerangepicker" label="Ngày kích hoạt" name="approved_at"/>
                <SearchField type="dropbox" label="Nhãn gói" name="type_sales_order_id" data={type_sales_order_id} />
                <SearchField type="dropbox" label="Nguồn tạo" name="old_channel_code" data={created_source}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
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
