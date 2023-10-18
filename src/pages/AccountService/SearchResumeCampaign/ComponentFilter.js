import React, { Component } from "react";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import config from 'config';
class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account_service_staff_list: [],
        };

    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    _getAccountServiceCustomerCare() {
        let args = {
            division_code: [Constant.COMMON_DATA_KEY_account_service, Constant.COMMON_DATA_KEY_account_service_lead, Constant.COMMON_DATA_KEY_account_service_manager],
            page: 1,
            per_page: 1000,
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, args);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]) {
            let responseAS = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
            if (responseAS.code === Constant.CODE_SUCCESS) {
                this.setState({ account_service_staff_list: responseAS?.data?.items || [] });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }
    }

    componentDidMount() {
        this._getAccountServiceCustomerCare();
    }

    render() {
        const { query, menuCode, idKey } = this.props;
        const { account_service_staff_list } = this.state;
        let status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_status_campaign_search_resume);
        let channels = [];
        for (const channel in Constant.CHANNEL_LIST) {
            channels.push({
                title: Constant.CHANNEL_LIST[channel],
                value: channel
            });
        }
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={6}>
                <SearchField type="input" label="ID,Tên campaign" name="q" timeOut={1000} />
                <SearchField type="input" label="ID,Email NTD" name="employer_q" timeOut={1000} />
                <SearchField type="input" label="ID tin" name="job_id" timeOut={1000} />
                <SearchField type="dropbox" label="CSKH Account Service" name="account_service_id" key_title="login_name" key_value="id" data={account_service_staff_list} />
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status} />
                <SearchField type="dropbox" label="Kênh" name="as_channel_code" data={channels} />
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
