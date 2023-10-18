import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

import {getListFullHeadhuntCampaign} from "api/headhunt";
import {getListStaffItems} from "api/auth";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: [],
            campaign: [],
            recruiter: [],

        }
        this.getListCampaign = this._getListCampaign.bind(this);
    }


    async _getListCampaign(value = null) {
        const [resCampaign, resRecruiter] = await Promise.all([
            getListFullHeadhuntCampaign({
                status: Constant.STATUS_ACTIVED,
                per_page: 20,
                q: value
            }),
            getListStaffItems({
                status: Constant.STATUS_ACTIVED,
                division_code: Constant.DIVISION_TYPE_customer_headhunt_recruiter,
                per_page: 999
            }),
        ]);
        if (resCampaign) {
            const campaign = resCampaign.map(v => ({value: v.id, title: `${v.id} - ${v.name}`})) || []
            this.setState({campaign});
        }
        if (resRecruiter) {
            const recruiter = resRecruiter.map(v => ({value: v.login_name, title: v.login_name}));
            this.setState({recruiter});
        }
    }

    componentDidMount() {
        const {query} = this.props;
        this.getListCampaign(query.campaign_id);
    }

    render() {
        const {query, menuCode, idKey, list_status} = this.props;
        const {campaign, recruiter} = this.state;
        const status = list_status?.map(v => ({value: v.id, title: v.title})) || [];
        const applicant_result = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_headhunt_pipeline_action_result);

        return (
            <div className="row mt-15">
                <Filter idKey={idKey} query={query} menuCode={menuCode} showQtty={10}>
                    <SearchField className="col-md-2" type="dropboxfetch" label="ID campaign" name="campaign_id"
                                 data={campaign}
                                 fnFetch={this.getListCampaign}
                                 timeOut={1000}/>
                    <SearchField className="col-md-2" type="input" label="ID Applicant, tên, email, sđt,..." name="q"
                                 timeOut={1000}/>
                    <SearchField className="col-md-2" type="dropbox" label="Recruiter"
                                 name="recruiter_staff_login_name" data={recruiter}/>
                    <SearchField className="col-md-2" type="dropbox" label="Action" name="applicant_action_action_code"
                                 data={status}/>
                    <SearchField className="col-md-2" type="datetimerangepicker" label="Action Date"
                                 name="applicant_action_date_at"/>
                    <SearchField className="col-md-2" type="dropbox" label="Action Result"
                                 name="applicant_action_result" data={applicant_result}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
