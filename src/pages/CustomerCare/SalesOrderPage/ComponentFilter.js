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
import { getListAccountantCampaign } from 'api/saleOrder';
import moment from "moment";
import {COMMON_DATA_KEY_created_source_sales_order} from "utils/Constant";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
            staff_list: [],
            campaign_list:[]
        };
        this.getCustomerCare = this._getCustomerCare.bind(this);
        this.getListCampaign = this._getListCampaign.bind(this);
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

    async _getListCampaign() {
        const res = await getListAccountantCampaign({
            status: Constant.STATUS_ACTIVED,
            per_page: 999,
            filter_expired: true,
        });

        if (res) {
            const campaigns = Array.isArray(res?.items) ?
                res?.items?.map(_ => {
                    return {
                        title: _?.campaign_name,
                        value: _?.campaign_id
                    }
                }) : [];
            this.setState({ campaign_list: campaigns });
        }
    }
    componentWillMount(){
        this.props.uiAction.refreshList('SalesOrderPage');
        this.getCustomerCare();
    }

    componentDidMount() {
        this.getListCampaign()
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
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        let { staff_list, campaign_list } = this.state;
        let invoice_issuance_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_invoice_issuance_method);
        let sales_order_opportunity = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_opportunity);
        const commonSaleStatus = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_status);
        const payment_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_payment_status);
        const confirm_payment_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_confirm_payment_status);
        const request_approve_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_request_approve_status);
        const type_campaign = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_type_campaign);
        let sales_order_status = commonSaleStatus.filter(_ => _?.value !== Constant.STATUS_DELETED);
        const old_channel_code = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_old_channel_code_employer);
        const created_source_sales_order = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_created_source_sales_order);
        const now = moment();
        const ranges = {
            'Hết hạn trong 3 ngày': [now, moment().add(3-1, 'days')],
            'Hết hạn trong 7 ngày': [now, moment().add(7-1, 'days')],
            'Hết hạn trong 15 ngày': [now, moment().add(15-1, 'days')],
            'Hết hạn trong 30 ngày': [now, moment().add(30-1, 'days')],
            'Hết hạn trong 60 ngày': [now, moment().add(60-1, 'days')],
            'Hết hạn trong 90 ngày': [now, moment().add(90-1, 'days')],
        };

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Mã phiếu, ID/Email NTD" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái phiếu" name="status" data={sales_order_status}/>
                <SearchField type="dropbox" label="Trạng thái thanh toán" name="payment_status" data={payment_status}/>
                <SearchField type="datetimerangepicker" label="Ngày tạo phiếu" name="created_at" />
                <SearchField type="dropbox" label="Yêu cầu chờ xác nhận thanh  toán" name="confirm_payment_status" data={confirm_payment_status}/>
                <SearchField type="dropbox" label="Yêu cầu chờ duyệt" name="request_approve_status" data={request_approve_status}/>
                <SearchField type="dropbox" label="Loại phiếu" name="type_campaign" data={type_campaign}/>
                {/*Old_channel_code */}
                <SearchField type="dropboxmulti" label="Chương trình tặng" name="campaign_id" data={campaign_list}/>
                {/*Created_source */}
                <SearchField type="dropbox" label="Nguồn tạo" name="created_source" data={created_source_sales_order}/>
                <SearchField type="dropbox" label="Nguồn sáp nhập" name="old_channel_code" data={old_channel_code}/>
                <SearchField type="datetimerangepicker" label="Ngày duyệt phiếu" name="approved_at" />
                <SearchField type="datetimerangepicker" label="Ngày hết hạn" name="expired_at" ranges={ranges}/>
                <SearchField type="dropbox" label="Xuất hóa đơn" name="invoice_issuance_method" data={invoice_issuance_method}/>
                <SearchField type="dropbox" label="Opportunity" name="sales_order_opportunity" data={sales_order_opportunity}/>
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
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
