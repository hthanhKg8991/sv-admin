import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {getListGroupCampaign} from "api/emailMarketing";

class ComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            campaign_group : [],
        }
        this.asyncData = this._asyncData.bind(this)
    }

    async _asyncData(){
        const res = await getListGroupCampaign({status: Constant.EMAIL_MARKETING_GROUP_CAMPAIGN_STATUS_ACTIVED, per_page: 99 })
        if (res){
            const campaign_group = res.items.map(v=>({value: v.id, title: `${v.id} - ${v.name}`}));
            this.setState({campaign_group});
        }
    }
    componentDidMount(){
        this.asyncData();
    }
    render() {
        const {query, menuCode, idKey} = this.props;
        const {campaign_group} = this.state;
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_email_marketing_status);
        const campaign_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_email_marketing_campaign_type);
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID, Tên" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Campaign Group ID" name="campaign_group_id" data={campaign_group}/>
                <SearchField type="dropbox" label="Loại campaign" name="type" data={campaign_type}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(ComponentFilter);
