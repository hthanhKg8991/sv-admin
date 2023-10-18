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
        const {query, menuCode, idKey} = this.props;
        let {staff_list} = this.state;
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        employer_status = employer_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        const employer_email_verified_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_email_verified_status);
        const employer_status_suspect = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status_suspect);
        const employer_company_kind = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_kind);
        const employer_company_size = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_size);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID, tên, email" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={employer_status}/>
                <SearchField type="dropbox" label="Nghi ngờ" name="suspect_status" data={employer_status_suspect}/>
                <SearchField type="dropbox" label="Xác thực email" name="email_verified_status" data={employer_email_verified_status}/>
                <SearchField type="datetimerangepicker" label="Ngày vào giỏ cấm liên lạc" name="created_at"/>
                <SearchField type="datetimerangepicker" label="Ngày vào giỏ CSKH" name="assigning_created_at"/>
                <SearchField type="datetimerangepicker" label="Ngày đăng ký" name="employer_created_at"/>
                <SearchField type="dropbox" label="Quy mô công ty" name="company_size" data={employer_company_size}/>
                <SearchField type="dropbox" label="Loại KH" name="company_kind" data={employer_company_kind}/>
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
