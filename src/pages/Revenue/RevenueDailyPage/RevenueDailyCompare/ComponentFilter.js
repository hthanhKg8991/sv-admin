import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey, branch} = this.props;
        // get unique channel_code
        const channelList = branch.branch.reduce((init, item) => {
            if (!init.find(i => i.value === item.channel_code)) {
                init.push({
                    title: Constant.CHANNEL_LIST[item.channel_code],
                    value: item.channel_code
                });
                return init;
            } else {
                return init;
            }
        }, []);
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={5}>
                <SearchField type="input" label="ID, Tên, Email, Mã NV" name="q" timeOut={1000}/>
                <SearchField type="input" label="SKU" name="sku" timeOut={1000}/>
                <SearchField type="input" label="ID SO" name="sales_order_id" timeOut={1000}/>
                <SearchField type="dropbox" label="Kênh" name="search_channel_code" data={channelList}/>
                <SearchField type="datetimerangepicker" label="Ngày ghi nhận" name="revenue_at"/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        province: state.province,
        user: state.user,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
