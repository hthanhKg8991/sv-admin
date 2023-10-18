import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    render () {
        const {query, menuCode, idKey} = this.props;
        const website_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_websites_crawled);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Tên job" name="q" timeOut={1000}/>
                <SearchField type="input" label="Tên công ty" name="qCompany" timeOut={1000}/>
                <SearchField type="input" label="Địa điểm" name="city" timeOut={1000}/>
                <SearchField type="input" label="Ngành" name="field" timeOut={1000}/>
                <SearchField type="dropbox" label="Website" name="web" data={website_list}/>
                <SearchField type="datetimerangepicker" label="Ngày update thông tin" name="updated_at" />
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
