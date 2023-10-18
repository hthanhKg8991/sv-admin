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
            staff_list: []
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

    componentDidMount(){
        this._getCustomerCare();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        let {staff_list} = this.state;
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        employer_status = employer_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        const employer_premium_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_premium_status);
        const employer_folder = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_folder);
        const employer_rival_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_rival_type);
        const employer_email_verified_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_email_verified_status);
        const employer_business_license_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_business_license_status);
        const employer_business_license_file = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_business_license_file);
        const employer_status_suspect = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status_suspect);
        const employer_status_marketing = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status_marketing);
        const employer_company_kind = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_kind);
        const employer_company_size = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_size);
        const {query, menuCode, is_archived,is_search_employer} = this.props;


        if(is_search_employer){
            return (
                <FilterLeft idKey={"EmployerList"} query={query} menuCode={menuCode}>
                    {/*id,name,email,phone*/}
                    <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
                    {/*assigned_staff_id*/}
                </FilterLeft>
            )
        }

        if(is_archived){
          return (
            <FilterLeft idKey={"EmployerList"} query={query} menuCode={menuCode}>
              {/*id,name,email,phone*/}
              <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
              {/*assigned_staff_id*/}
              <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
              {/*premium_status*/}
              <SearchField type="dropbox" label="Loại tài khoản" name="premium_status" data={employer_premium_status}/>
              {/*suspect_status*/}
              <SearchField type="dropbox" label="Trạng thái nghi ngờ" name="suspect_status" data={employer_status_suspect}/>
              {/*email_verified_status*/}
              <SearchField type="dropbox" label="Xác thực email" name="email_verified_status" data={employer_email_verified_status}/>
              {/*business_license_file*/}
              <SearchField type="dropbox" label="Giấy phép kinh doanh" name="business_license_file" data={employer_business_license_file}/>
              {/*business_license_status*/}
              <SearchField type="dropbox" label="Trạng thái GPKD" name="business_license_status" data={employer_business_license_status}/>
              {/*company_size*/}
              <SearchField type="dropbox" label="Loại quy mô" name="company_kind" data={employer_company_kind}/>
              {/*company_size*/}
              <SearchField type="dropbox" label="Quy mô công ty" name="company_size" data={employer_company_size}/>
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
              <SearchField type="dropbox" label="Loại đối thủ" name="rival_type" data={employer_rival_type}/>
            </FilterLeft>
          )
        }

        return (
          <FilterLeft idKey={"EmployerList"} query={query} menuCode={menuCode}>
            {/*id,name,email,phone*/}
            <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
            {/*assigned_staff_id*/}
            <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
            {/*premium_status*/}
            <SearchField type="dropbox" label="Loại tài khoản" name="premium_status" data={employer_premium_status}/>
            {/*status*/}
            <SearchField type="dropbox" label="Trạng thái tài khoản" name="status" data={employer_status}/>
            {/*suspect_status*/}
            <SearchField type="dropbox" label="Trạng thái nghi ngờ" name="suspect_status" data={employer_status_suspect}/>
            {/*suspect_status*/}
            <SearchField type="dropbox" label="Trạng thái thông báo hồ sơ" name="email_token_marketing_status" data={employer_status_marketing}/>
            {/*email_verified_status*/}
            <SearchField type="dropbox" label="Xác thực email" name="email_verified_status" data={employer_email_verified_status}/>
            {/*business_license_file*/}
            <SearchField type="dropbox" label="Giấy phép kinh doanh" name="business_license_file" data={employer_business_license_file}/>
            {/*business_license_status*/}
            <SearchField type="dropbox" label="Trạng thái GPKD" name="business_license_status" data={employer_business_license_status}/>
            {/*company_size*/}
            <SearchField type="dropbox" label="Loại quy mô" name="company_kind" data={employer_company_kind}/>
            {/*company_size*/}
            <SearchField type="dropbox" label="Quy mô công ty" name="company_size" data={employer_company_size}/>
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
            <SearchField type="dropbox" label="Loại đối thủ" name="rival_type" data={employer_rival_type}/>
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
