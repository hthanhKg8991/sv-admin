import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from 'utils/utils';

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                status: Constant.STATUS_ACTIVED
            },
            staff_list: [],
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        const {query, menuCode, idKey} = this.props;
        let status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_viewed_status);
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID, Tiêu đề" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái xem" name="viewed_status" data={status}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
