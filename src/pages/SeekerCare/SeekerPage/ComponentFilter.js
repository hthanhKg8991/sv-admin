import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                status: Constant.STATUS_ACTIVED
            },
            staff_list: [],
        };
        this.getCustomerCare = this._getCustomerCare.bind(this);
    }

    _getCustomerCare(){
        let division_code = this.props.user ? this.props.user.division_code : '';
        let args = {status: Constant.STATUS_ACTIVED, execute: Constant.STATUS_ACTIVED};
        args['division_code[0]'] = Constant.DIVISION_TYPE_seeker_care_member;
        if(division_code !== Constant.DIVISION_TYPE_seeker_care_member) {
            args['division_code[1]'] = Constant.DIVISION_TYPE_seeker_care_leader;
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, args);
    }

    componentDidMount(){
        this.getCustomerCare();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }
    }
    render () {
        const {staff_list} = this.state;
        let seeker_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        seeker_status = seeker_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        let support_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_support_type);
        let created_source = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_created_source);
        let mobile_exist = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_mobile_exist);
        let token_mobile = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_token_mobile);
        let token_email = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_token_email);
        let seeker_resume_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_resume_status);
        const old_channel_code = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_old_channel_code_employer);
        let province = this.props.sys.province.items;

        const {query, menuCode, idKey, is_archived} = this.props;
        const staff_list_tmp = [...staff_list];
        const support_type_tmp = [...support_type];

        if(staff_list_tmp.length !== 0){
          staff_list_tmp.unshift({
            id: "empty",
            login_name: "Chưa có CSNTV",
          })
        }

        if(support_type_tmp.length !== 0){
          support_type_tmp.unshift({
            value: "empty",
            title: "Chưa chọn",
          })
        }

        if(is_archived){
            return (
              <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                  <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
                  <SearchField type="dropboxmulti" label="CSKH NTV" name="assigned_staff_id" data={staff_list_tmp} key_value="id" key_title="login_name"/>
                  <SearchField type="dropbox" label="Hồ sơ" name="seeker_resume_status" data={seeker_resume_status}/>
                  <SearchField type="dropbox" label="Phân loại hỗ trợ" name="support_type" data={support_type_tmp}/>
                  <SearchField type="dropbox" label="Nguồn tạo" name="created_source" data={created_source}/>
                  <SearchField type="datetimerangepicker" label="Ngày đăng ký" name="created_at"/>
                  <SearchField type="dropboxmulti" label="Tỉnh thành" name="province_id" key_value="id" key_title="name" data={province}/>
                  <SearchField type="dropbox" label="Xác thực email" name="token_email" data={token_email}/>
                  <SearchField type="dropbox" label="Xác thực số điện thoại" name="token_sms" data={token_mobile}/>
                  <SearchField type="dropbox" label="Số điện thoại" name="mobile_exist" data={mobile_exist}/>
              </FilterLeft>
            )
        }

        const listDivision = [Constant.DIVISION_TYPE_admin, Constant.DIVISION_TYPE_root, Constant.DIVISION_TYPE_seeker_care_member, Constant.DIVISION_TYPE_quality_control_call_seeker]
        const showSearchPhone = listDivision.includes(this.props?.user?.division_code || "");

        if(showSearchPhone){
            return (
                <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={5}>
                    <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
                    <SearchField type="input" label="SĐT 3 kênh" name="mobile" timeOut={1000}/>
                    <SearchField type="dropboxmulti" label="CSKH NTV" name="assigned_staff_id" data={staff_list_tmp} key_value="id" key_title="login_name"/>
                    <SearchField type="dropbox" label="Trạng thái tài khoản" name="status" data={seeker_status}/>
                    <SearchField type="dropbox" label="Hồ sơ" name="seeker_resume_status" data={seeker_resume_status}/>
                    <SearchField type="dropbox" label="Phân loại hỗ trợ" name="support_type" data={support_type_tmp}/>
                    <SearchField type="dropbox" label="Nguồn tạo" name="created_source" data={created_source}/>
                    <SearchField type="datetimerangepicker" label="Ngày đăng ký" name="created_at"/>
                    <SearchField type="dropboxmulti" label="Tỉnh thành" name="province_id" key_value="id" key_title="name" data={province}/>
                    <SearchField type="dropbox" label="Xác thực email" name="token_email" data={token_email}/>
                    <SearchField type="dropbox" label="Xác thực số điện thoại" name="token_sms" data={token_mobile}/>
                    <SearchField type="dropbox" label="Số điện thoại" name="mobile_exist" data={mobile_exist}/>
                    {/*Old_channel_code */}
                    <SearchField type="dropbox" label="Nguồn sáp nhập" name="old_channel_code" data={old_channel_code}/>
                    {/*order_by*/}
                    <SearchField type="dropbox" label="Sắp xếp thời gian đăng ký" name="order_by[created_at]"
                                 data={Constant.ORDER_BY_CONFIG}/>
                    <SearchField type="dropbox" label="Sắp xếp thời gian sửa" name="order_by[updated_at]"
                                 data={Constant.ORDER_BY_CONFIG}/>
                    <SearchField type="dropbox" label="Sắp xếp thời gian đăng nhập" name="order_by[logined_at]"
                                 data={Constant.ORDER_BY_CONFIG}/>
                    <SearchField type="dropbox" label="Sắp xếp thời gian vào giỏ" name="order_by[assigned_staff_at]"
                                 data={Constant.ORDER_BY_CONFIG}/>
                </FilterLeft>
            )
        }

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
                <SearchField type="dropboxmulti" label="CSKH NTV" name="assigned_staff_id" data={staff_list_tmp} key_value="id" key_title="login_name"/>
                <SearchField type="dropbox" label="Trạng thái tài khoản" name="status" data={seeker_status}/>
                <SearchField type="dropbox" label="Hồ sơ" name="seeker_resume_status" data={seeker_resume_status}/>
                <SearchField type="dropbox" label="Phân loại hỗ trợ" name="support_type" data={support_type_tmp}/>
                <SearchField type="dropbox" label="Nguồn tạo" name="created_source" data={created_source}/>
                <SearchField type="datetimerangepicker" label="Ngày đăng ký" name="created_at"/>
                <SearchField type="dropboxmulti" label="Tỉnh thành" name="province_id" key_value="id" key_title="name" data={province}/>
                <SearchField type="dropbox" label="Xác thực email" name="token_email" data={token_email}/>
                <SearchField type="dropbox" label="Xác thực số điện thoại" name="token_sms" data={token_mobile}/>
                <SearchField type="dropbox" label="Số điện thoại" name="mobile_exist" data={mobile_exist}/>
                {/*Old_channel_code */}
                <SearchField type="dropbox" label="Nguồn sáp nhập" name="old_channel_code" data={old_channel_code}/>
                {/*order_by*/}
                <SearchField type="dropbox" label="Sắp xếp thời gian đăng ký" name="order_by[created_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
                <SearchField type="dropbox" label="Sắp xếp thời gian sửa" name="order_by[updated_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
                <SearchField type="dropbox" label="Sắp xếp thời gian đăng nhập" name="order_by[logined_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
                <SearchField type="dropbox" label="Sắp xếp thời gian vào giỏ" name="order_by[assigned_staff_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
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
