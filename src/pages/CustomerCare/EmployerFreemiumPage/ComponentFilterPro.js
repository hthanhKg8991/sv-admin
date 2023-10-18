import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import config from 'config';
class ComponentFilterPro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
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

    componentDidMount() {
        this._getCustomerCare();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ staff_list: response.data });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
    }

    render() {
        const { query, menuCode, idKey } = this.props;

        let { staff_list } = this.state;

        const freemium_pro_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_freemium_pro_status)
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_status);
        employer_status = employer_status.filter(c => parseInt(c.value) !== Constant.STATUS_DELETED);
        const optionsStaff = [Constant.OPTION_STAFF_EMPTY, ...staff_list];
        const employer_premium_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_premium_status);

        return (
            <div className="row mt-15">
                <Filter idKey={idKey} query={query} menuCode={menuCode}>
                    <SearchField className="col-md-2" type="input" label="Id, Email" name="q" timeOut={1000} />
                    <SearchField className="col-md-2" type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id"
                        key_title="login_name" data={optionsStaff} />
                    <SearchField className="col-md-2" type="dropbox" label="Loại tài khoản" name="premium_status"
                        data={employer_premium_status} />
                    <SearchField className="col-md-2" type="dropbox" label="Trạng thái" name="status" data={freemium_pro_status} />
                    <SearchField className="col-md-2 inline-flex-datetime" type="datetimerangepicker" label="Ngày đăng ký" name="created_at" />
                </Filter>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilterPro);
