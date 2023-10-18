import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as uiAction from "actions/uiAction";
import FilterLeft from 'components/Common/Ui/Table/FilterLeft';

class ComponentFilterJobApply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {}
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let resume_applied_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_applied_status_V2);
        const {query, menuCode, idKey} = this.props;

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="dropbox" label="Trạng thái ứng tuyển" name="status" data={resume_applied_status}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        branch: state.branch,
        province: state.province
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilterJobApply);
