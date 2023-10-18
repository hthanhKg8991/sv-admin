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
            lead : [],
            sale : [],
        };
        this.asyncData = this._asyncData.bind(this);
    }

    async _asyncData() {
        const [resRecruiter, resSale] = await Promise.all([
            getListStaffItems({
                status: Constant.STATUS_ACTIVED,
                division_code: Constant.DIVISION_TYPE_customer_headhunt_recruiter,
                per_page: 999
            }),
            getListStaffItems({
                status: Constant.STATUS_ACTIVED,
                division_code: Constant.DIVISION_TYPE_customer_headhunt_sale,
                per_page: 999
            })
        ])
        if (resRecruiter && resSale){
            const lead = resRecruiter.map(v => ({value:v.login_name, title: v.login_name}));
            const sale = resSale.map(v => ({value:v.login_name, title: v.login_name}));
            this.setState({lead,sale});
        }
    }

    componentDidMount(){
        this.asyncData();
    }
    render() {
        const {query, menuCode, idKey} = this.props;
        const {lead, sale} = this.state;
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_headhunt_recruitment_request_status);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID request" name="q" timeOut={1000}/>
                <SearchField type="input" label="ID, Tên Campaign" name="campaign_id" timeOut={1000}/>
                <SearchField type="input" label="ID Khách hàng" name="customer_id" timeOut={1000}/>
                <SearchField type="datetimerangepicker" label="Ngày yêu cầu" name="request_at"/>
                <SearchField type="datetimerangepicker" label="Deadline" name="deadline_at"/>
                <SearchField type="dropbox" label="Recruiter" name={Constant.DIVISION_TYPE_customer_headhunt_recruiter} data={lead}/>
                <SearchField type="dropbox" label="Sale" name={Constant.DIVISION_TYPE_customer_headhunt_sale} data={sale}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status}/>
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
