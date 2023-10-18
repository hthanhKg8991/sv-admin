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
import {getVsic} from "api/system";
import {getListCustomerItems} from "api/employer";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
            room_list: [],
            customer_list: [],
            vsic_list: [],
            account_service_staff_list: [],
        };
        this.getCustomer = this._getCustomer.bind(this);
    }

    async _getCustomer(params) {
        if (params) {
            const res = await getListCustomerItems({q: params});
            if (res && Array.isArray(res)) {
                const items = res.map(item => {return {title: `${item?.name}-${item?.code}`, value: item?.id}});
                this.setState({customer_list: items});
            }
        } else {
            this.setState({customer_list: []});
        }
    }

    _getRoom() {
        const {branch} = this.props;
        const branch_code = branch.currentBranch.code;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_ROOM_LIST, {
            branch_code: branch_code
        });
    }

    _getCustomerCare() {
        let division_code = this.props.user ? this.props.user.division_code : '';
        let args = {};
        args['division_code_list[0]'] = Constant.DIVISION_TYPE_customer_care_member;
        if (division_code !== Constant.DIVISION_TYPE_customer_care_member) {
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

    async _getVsic() {
        const res = await getVsic();
        if (res) {
            this.setState({vsic_list: res});
        }
    }

    componentDidMount() {
        this._getCustomerCare();
        this._getRoom();
        this._getVsic();
        this._getAccountServiceCustomerCare();
        const {query} = this.props;
        if (Number(query?.customer_id) > 0) {
            this.getCustomer(query?.customer_id);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]) {
            let responseAS = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
            if (responseAS.code === Constant.CODE_SUCCESS) {
                this.setState({account_service_staff_list: responseAS?.data?.items||[]});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_ROOM_LIST]) {
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

    render () {
        const {query, menuCode, is_archived,is_search_employer, branch} = this.props;
        let {staff_list, room_list, vsic_list, customer_list, account_service_staff_list} = this.state;
        const channelCode = branch.currentBranch.channel_code;
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        employer_status = employer_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        const employer_premium_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_premium_status);
        const employer_folder = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_folder);
        const employer_rival_type = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_rival_type);
        const employer_email_verified_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_email_verified_status);
        const employer_business_license_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_business_license_status);
        const employer_business_license_file = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_business_license_file);
        const employer_status_suspect = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_status_suspect);
        const email_marketing_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_status_marketing);
        const employer_company_kind = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_company_kind);
        const employer_company_size = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_company_size);
        const employer_support = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_support);
        const employer_class = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_class);
        const employer_channel_checkmate = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_filter_channel_checkmate);
        const employer_freemium = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_freemium);
        const employer_cross_selling = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_assign_cross_selling);
        const optionsStaff = [Constant.OPTION_STAFF_EMPTY, ...staff_list];
        const optionsEmployerSupport = [Constant.OPTION_EMPLOYER_SUPPORT_EMPTY, ...employer_support];
        const created_source = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_created_source);
        const old_channel_code = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_old_channel_code_list_employer);
        const customer_not_yet_verify = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_customer_not_yet_verify);
        const customer_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_customer_status);

        if (is_search_employer) {
            const listDivision = [Constant.DIVISION_TYPE_admin, Constant.DIVISION_TYPE_quality_control_employer, Constant.DIVISION_TYPE_root]
            const showSearchPhone = listDivision.includes(this.props?.user?.division_code || "");
            if (showSearchPhone){
                return (
                    <FilterLeft idKey={"EmployerList"} query={query} menuCode={menuCode}>
                        {/*id,name,email,phone*/}
                        <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
                        {/*customer_id*/}
                        <SearchField type="dropboxfetch" label="ID KH/ Mã code/ Tên company" name="customer_id"
                                     fnFetch={this.getCustomer}
                                     data={customer_list}
                                     timeOut={500}
                        />
                        <SearchField type="input" label="SĐT 3 kênh" name="phone" timeOut={1000}/>
                    </FilterLeft>
                )
            }
            return (
                <FilterLeft idKey={"EmployerList"} query={query} menuCode={menuCode}>
                    {/*id,name,email,phone*/}
                    <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
                    {/*customer_id*/}
                    <SearchField type="dropboxfetch" label="ID KH/ Mã code/ Tên company" name="customer_id"
                                 fnFetch={this.getCustomer}
                                 data={customer_list}
                                 timeOut={500}
                    />
                </FilterLeft>
            )
        }

        // get visc list & filter options
        const viscFilter = vsic_list.filter(v => v?.parent !== 0);
        const viscOptions = [{name: "NTD không có Lĩnh vực hoạt động", id: -1}, ...viscFilter];

        // #CONFIG_BRANCH
        const isMW = channelCode === Constant.CHANNEL_CODE_MW;
        const isVL24H = channelCode === Constant.CHANNEL_CODE_VL24H;

        if (is_archived) {
            return (
                <FilterLeft idKey={"EmployerList"} query={query} menuCode={menuCode}>
                    {/*id,name,email,phone*/}
                    <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000}/>
                    {/*assigned_staff_id*/}
                    <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id"
                                 key_title="login_name" data={optionsStaff}/>
                    {/*premium_status*/}
                    <SearchField type="dropbox" label="Loại tài khoản" name="premium_status"
                                 data={employer_premium_status}/>
                    {/*employer_class*/}
                    <SearchField type="dropbox" label="Phân loại NTD" name="employer_classification"
                                 data={employer_class}/>
                    <SearchField type="dropbox" label="Trạng thái xác thực NTD" name="customer_not_yet_verify"
                             data={customer_not_yet_verify}/>
                    <SearchField type="dropbox" label="Trạng thái gán company" name="customer_status"
                             data={customer_status}/>
                    {/*channel_checkmate */}
                    <SearchField type="dropbox" label="Nhãn" name="channel_checkmate"
                                 data={employer_channel_checkmate}/>
                    {/*Created_source */}
                    <SearchField type="dropbox" label="Nguồn tạo" name="created_source" data={created_source}/>
                    {/*Old_channel_code */}
                    <SearchField type="dropbox" label="Nguồn sáp nhập" name="old_channel_code" data={old_channel_code}/>
                    {/*cross_selling */}
                    <SearchField type={isVL24H ? "dropbox" : ""} label="Nhân viên cross selling" name="is_cross_sale"
                                 data={employer_cross_selling}/>
                    {/*channel_freemium */}
                    <SearchField type="dropbox" label="NTD Freemium" name="is_freemium"
                                 data={employer_freemium}/>
                    {/*suspect_status*/}
                    <SearchField type="dropbox" label="Trạng thái nghi ngờ" name="suspect_status"
                                 data={employer_status_suspect}/>
                    {/*email_verified_status*/}
                    <SearchField type="dropbox" label="Xác thực email" name="email_verified_status"
                                 data={employer_email_verified_status}/>
                    {/*business_license_file*/}
                    <SearchField type="dropbox" label="Giấy phép kinh doanh" name="business_license_file"
                                 data={employer_business_license_file}/>
                    {/*business_license_status*/}
                    <SearchField type="dropbox" label="Trạng thái GPKD" name="business_license_status"
                                 data={employer_business_license_status}/>
                    {/*company_size*/}
                    <SearchField type="dropbox" label="Loại quy mô" name="company_kind" data={employer_company_kind}/>
                    {/*company_size*/}
                    <SearchField type="dropbox" label="Quy mô công ty" name="company_size"
                                 data={employer_company_size}/>
                    {/*folder*/}
                    <SearchField type="dropbox" label="Thư mục" name="folder" data={employer_folder}/>
                    {/*change_trademark_at*/}
                    <SearchField type="datetimerangepicker" label="Audit cập nhật GTCT/Website" name="change_trademark_at"/>
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
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id"
                             key_title="login_name" data={optionsStaff}/>
                {/*account_service_assigned_id*/}
                <SearchField type="dropboxmulti" label="CSKH Account Service" name="account_service_assigned_id"
                             key_title="login_name" key_value="id" data={account_service_staff_list}/>
                {/*premium_status*/}
                <SearchField type="dropbox" label="Loại tài khoản" name="premium_status"
                             data={employer_premium_status}/>
                {/*employer_class*/}
                <SearchField type="dropbox" label="Phân loại NTD" name="employer_classification"
                             data={employer_class}/>
                {/*channel_checkmate */}
                <SearchField type="dropbox" label="Nhãn" name="channel_checkmate"
                             data={employer_channel_checkmate}/>
                {/*Created_source */}
                <SearchField type="dropbox" label="Nguồn tạo" name="created_source" data={created_source}/>
                {/*Old_channel_code */}
                <SearchField type="dropbox" label="Nguồn sáp nhập" name="old_channel_code" data={old_channel_code}/>
                {/*cross_selling */}
                <SearchField type={isVL24H ? "dropbox" : ""} label="Nhân viên cross selling" name="is_cross_sale"
                             data={employer_cross_selling}/>
                {/*channel_freemium */}
                <SearchField type="dropbox" label="NTD Freemium" name="is_freemium"
                             data={employer_freemium}/>
                {/*status*/}
                <SearchField type="dropbox" label="Trạng thái tài khoản" name="status" data={employer_status}/>
                {/*suspect_status*/}
                <SearchField type="dropbox" label="Trạng thái nghi ngờ" name="suspect_status"
                             data={employer_status_suspect}/>
                {/*email_marketing_status*/}
                <SearchField type={!isMW ? "dropbox" : ""} label="Trạng thái thông báo hồ sơ" name="email_marketing_status"
                             data={email_marketing_status}/>
                {/*support_info*/}
                <SearchField type="dropboxmulti" label="Phân loại hổ trợ" name="support_info"
                             data={optionsEmployerSupport}/>
                <SearchField type="dropbox" label="Trạng thái xác thực NTD" name="customer_not_yet_verify"
                             data={customer_not_yet_verify}/>
                <SearchField type="dropbox" label="Trạng thái gán company" name="customer_status"
                             data={customer_status}/>
                {/*email_verified_status*/}
                <SearchField type="dropbox" label="Xác thực email" name="email_verified_status"
                             data={employer_email_verified_status}/>
                {/*business_license_file*/}
                <SearchField type="dropbox" label="Giấy phép kinh doanh" name="business_license_file"
                             data={employer_business_license_file}/>
                {/*business_license_status*/}
                <SearchField type="dropbox" label="Trạng thái GPKD" name="business_license_status"
                             data={employer_business_license_status}/>
                {/*company_size*/}
                <SearchField type="dropbox" label="Loại quy mô" name="company_kind" data={employer_company_kind}/>
                {/*company_size*/}
                <SearchField type="dropbox" label="Quy mô công ty" name="company_size" data={employer_company_size}/>
                {/*room_id*/}
                <SearchField type="dropboxmulti" label="Phòng" name="room_id" data={room_list}/>
                {/*customer_id*/}
                <SearchField type="dropboxfetch" label="ID/ Mã/ Tên Company" name="customer_id"
                             fnFetch={this.getCustomer}
                             data={customer_list}
                             timeOut={500}
                />
                {/*folder*/}
                <SearchField type="dropbox" label="Thư mục" name="folder" data={employer_folder}/>
                {/*change_trademark_at*/}
                <SearchField type="datetimerangepicker" label="Audit cập nhật GTCT/Website" name="change_trademark_at"/>
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
                {/*fields_activity*/}
                <SearchField type="dropbox" label="Lĩnh vực hoạt động" key_value="id" key_title="name"
                             name="fields_activity" data={viscOptions}/>
                {/*order_by*/}
                <SearchField type="dropbox" label="Sắp xếp thời gian đăng ký" name="order_by[created_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
                <SearchField type="dropbox" label="Sắp xếp thời gian sửa" name="order_by[updated_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
                <SearchField type="dropbox" label="Sắp xếp thời gian đăng nhập" name="order_by[last_logged_in_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
                <SearchField type="dropbox" label="Sắp xếp thời gian vào giỏ" name="order_by[assigning_changed_at]"
                             data={Constant.ORDER_BY_CONFIG}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
