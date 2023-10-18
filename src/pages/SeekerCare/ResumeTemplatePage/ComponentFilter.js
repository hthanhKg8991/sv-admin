import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                status: Constant.STATUS_ACTIVED
            }
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let resume_template_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_resume_template_status);
        const jobField = this.props.sys.jobField.items;
        const {query, menuCode, idKey} = this.props;

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Tiêu đề" name="title" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={resume_template_status}/>
                <SearchField type="dropbox" label="Ngành nghề" name="field_id" data={jobField} key_value="id" key_title="name"/>
                <SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at"/>
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
