import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
        };
    }

    componentWillMount(){
        this.props.uiAction.refreshList('DivisionPage');
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        let division_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_division_status);
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Mã, tên" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={division_status}/>
            </FilterLeft>
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
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
