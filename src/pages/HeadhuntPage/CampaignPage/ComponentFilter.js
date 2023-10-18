import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {getListStaffItems} from "api/auth";

class ComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            lead: [],
            sourcer: [],
        };
        this.asyncData = this._asyncData.bind(this);
    }

    async _asyncData() {
        const [resLead, resSourcer] = await Promise.all([
            getListStaffItems({
                status: Constant.STATUS_ACTIVED,
                division_code: Constant.DIVISION_TYPE_customer_headhunt_recruiter,
                per_page: 999
            }),
            getListStaffItems({
                status: Constant.STATUS_ACTIVED,
                division_code: Constant.DIVISION_TYPE_customer_headhunt_sourcer,
                per_page: 999
            })
        ])
        if (resLead) {
            const lead = resLead.map(v => ({value: v.login_name, title: v.login_name}));
            this.setState({lead});
        }
        if (resSourcer) {
            const sourcer = resSourcer.map(v => ({value: v.login_name, title: v.login_name}));
            this.setState({sourcer});
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {query, menuCode, idKey} = this.props;
        const {lead, sourcer} = this.state;
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_headhunt_campaign_status);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={6}>
                <SearchField type="input" label="ID, Mã campaign" name="q" timeOut={1000}/>
                <SearchField type="input" label="ID khách hàng" name="customer_id" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status}/>
                <SearchField type="input" label="Mã hợp đồng" name="contract_id" timeOut={1000}/>
                <SearchField type="dropbox" label="Recruiter" name="recruiter_group_member_login_name" data={lead}/>
                <SearchField type="dropbox" label="Sourcer" name="sourcer_group_member_login_name" data={sourcer}/>
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
