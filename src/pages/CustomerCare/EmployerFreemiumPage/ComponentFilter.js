import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import config from 'config';
class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
            account_service_staff_list: [],
        };
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

    componentDidMount() {
        this._getCustomerCare();
        this._getAccountServiceCustomerCare();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ staff_list: response.data });
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

    render() {
        const { query, menuCode, idKey } = this.props;

        let { staff_list, account_service_staff_list } = this.state;

        const statusFreemium = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_freemium_status);
        const employer_premium_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_premium_status);
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_status);
        employer_status = employer_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        const employer_freemium_is_new = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_freemium_is_new);
        const optionsStaff = [Constant.OPTION_STAFF_EMPTY, ...staff_list];
        const customer_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_customer_status);
        const types = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_is_type);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Id, Tên, Email" name="q" timeOut={1000} />
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id"
                    key_title="login_name" data={optionsStaff} />
                <SearchField type="dropboxmulti" label="CSKH Account Service" name="account_service_assigned_id"
                    key_title="login_name" key_value="id" data={account_service_staff_list} />
                <SearchField type="dropbox" label="Trạng thái freemium" name="status" data={statusFreemium} />
                <SearchField type="dropbox" label="Loại tài khoản" name="premium_status"
                    data={employer_premium_status} />
                <SearchField type="dropbox" label="Trạng thái tài khoản" name="employer_status" data={employer_status} />
                <SearchField type="dropbox" label="Trạng thái gán company" name="customer_status" data={customer_status} />
                <SearchField type="dropbox" label="Loại đăng ký" name="is_new" data={employer_freemium_is_new} />
                <SearchField type="datetimerangepicker" label="Ngày đăng ký tài khoản" name="employer_created_at" />
                <SearchField type="datetimerangepicker" label="Ngày đăng ký Freemium" name="created_at" />
                <SearchField type="datetimerangepicker" label="Ngày vào giỏ" name="assigning_changed_at" />
                <SearchField type="input" label="Mã số thuế" name="tax_code" timeOut={1000} />
                <SearchField type="dropbox" label="Nguồn" name="type" data={types} />
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
