import React, { Component } from "react";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeftCustom from "./FilterLeftCustom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import config from 'config';
import {publish} from "utils/event";
import { getAccountServiceSearchResumeCampaignList } from "api/mix";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account_service_staff_list: [],
            campaign_list: [],
            box_list: [],
        };

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

    async _getCampaignList() {
        const res = await getAccountServiceSearchResumeCampaignList({ status: Constant.AS_FILTER_RESUME_CAMPAIGN_ACTIVE, per_page:1000});
        if (res && Array.isArray(res?.items)) {
            const campaignList = res.items.map(campaign => {
                return {title: `${campaign?.id} - ${campaign?.name}`, value: campaign?.id}
            });
            this.setState({
                campaign_list: campaignList
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const strpreProv =  JSON.stringify(this.props.query?.campaign_id)
        const strnextProv =  JSON.stringify(nextProps.query?.campaign_id)
        if(strpreProv !== strnextProv){
            publish(".refresh", {}, "QuickFilterCustom");
        }
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys) ||
            JSON.stringify(this.props.query) !== JSON.stringify(nextProps.query);
    }

    componentDidMount() {
        this._getAccountServiceCustomerCare();
        this._getCampaignList();
    }

    render() {
        const { query, menuCode, idKey,sys } = this.props;
        const { campaign_list } = this.state;
        const language_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_language_resume);
        const experiment_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_job_experience_range);
        const seeker_level = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_seeker_level);
        const gender_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_job_gender);
        const work_time = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_resume_working_method);
        const is_seen = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_is_seen_resume_account_service);
        const is_sent_type = utils.convertArrayValueCommonData(sys.common.items, Constant.COMMON_DATA_KEY_account_service_resume_is_sent);
        const job_list = this.props.sys.jobField.items
        const province = sys.province.items;

        return (
            <FilterLeftCustom idKey={idKey} query={query} menuCode={menuCode} campaign={campaign_list?.find((item) => item?.value == query?.campaign_id)} showQtty={6}>
                <SearchField type="dropbox" label="Chọn Campaign" name="campaign_id" required data={campaign_list} />
                <SearchField type="input" label="Tên vị trí hoặc chức danh" name="q" timeOut={1000} />
                <SearchField type="dropbox" label="Địa điểm" name="province_ids[]" key_value="id" key_title="name" data={province} />
                <SearchField type="dropbox" label="Ngành nghề" key_value="id" key_title="name" name="field_ids[]" data={job_list} />
                <SearchField type="currency" label="Mức lương tối thiểu" name="salary_range[from]" timeOut={1000} />
                <SearchField type="currency" label="Mức lương tối đa" name="salary_range[to]" timeOut={1000} />
                <SearchField type="dropboxmulti" label="Kinh nghiệm" name="experience" data={experiment_list} />
                <SearchField type="dropbox" label="Ngoại ngữ" name="language" data={language_list} />
                <SearchField type="dropboxmulti" label="Bằng cấp" name="level" data={seeker_level} />
                <SearchField type="dropboxmulti" label="Hình thức làm việc" name="work_time" data={work_time} />
                <SearchField type="dropbox" label="Giới tính" name="seeker_gender" data={gender_list} />
                <SearchField type="dropbox" label="Lịch sử gửi" name="is_sent" data={is_sent_type} />
                <SearchField type="dropbox" label="Loại hồ sơ" name="is_seen" data={is_seen} />
                <SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at"/>
                <SearchField type="datetimerangepicker" label="Ngày làm mới" name="refreshed_at"/>
                <SearchField type="dropbox" label="Sắp xếp thời gian tạo" name="order_by[created_at]" data={Constant.ORDER_BY_CONFIG} />
                <SearchField type="dropbox" label="Sắp xếp thời gian làm mới" name="order_by[updated_at]" data={Constant.ORDER_BY_CONFIG} />
            </FilterLeftCustom>
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
