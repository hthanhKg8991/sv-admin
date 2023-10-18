import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
            staff_list: []
        };
        this.getCustomerCare = this._getCustomerCare.bind(this);
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

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
    }

    componentDidMount() {
        this.getCustomerCare();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {query, menuCode, idKey} = this.props;
        let {staff_list} = this.state;
        const commonSaleStatus = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_by_field_status);
        const sales_order_status = commonSaleStatus.filter(_ => _?.value !== Constant.STATUS_DELETED);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Mã phiếu" name="q" timeOut={1000}/>
                <SearchField type="input" label="ID NTD" name="employer_id" timeOut={1000}/>
                <SearchField type="input" label="Email NTD" name="employer_email" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái phiếu" name="status" data={sales_order_status}/>
                <SearchField type="datetimerangepicker" label="Ngày duyệt phiếu" name="approved_at"/>
                <SearchField type="datetimerangepicker" label="Ngày tạo phiếu" name="created_at"/>
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id"
                             key_title="login_name" data={staff_list}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
