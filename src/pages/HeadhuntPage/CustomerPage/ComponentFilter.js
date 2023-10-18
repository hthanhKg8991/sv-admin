import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import { getListStaffItemsHeadhunt } from "api/headhunt";

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
        const [resLead, resSale] = await Promise.all([
                getListStaffItemsHeadhunt({
                status: Constant.STATUS_ACTIVED,
                division_code: Constant.DIVISION_TYPE_customer_headhunt_lead,
                per_page: 999
            }),
            getListStaffItemsHeadhunt({
                status: Constant.STATUS_ACTIVED,
                division_code: Constant.DIVISION_TYPE_customer_headhunt_sale,
                per_page: 999
            })
        ])
        if (resLead && resSale){
            const lead = resLead.map(v => ({value:v.login_name, title: v.login_name}));
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
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_customer_status);
        const created_source = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_headhunt_customer_source);
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={5}>
                <SearchField type="input" label="ID, Tên, MST" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Lead" name={Constant.DIVISION_TYPE_customer_headhunt_lead} data={lead}/>
                <SearchField type="dropbox" label="Sale" name={Constant.DIVISION_TYPE_customer_headhunt_sale} data={sale}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status}/>
                <SearchField type="dropbox" label="Nguồn" name="created_source" data={created_source}/>
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
