import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {getTeamMember} from "api/auth";

class ComponentFilter extends Component {

    constructor(props){
        super(props);
        this.state = {
            staff_list: []
        };
    }

    async _getTeamMember() {
        const res = await getTeamMember({
            division_code_list: [
                Constant.DIVISION_TYPE_customer_care_leader,
                Constant.DIVISION_TYPE_customer_care_member,
            ]
        });
        if(res) {
            this.setState({
                staff_list : res
            })
        }
    }

    componentDidMount() {
        this._getTeamMember();
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        const {staff_list} = this.state;

        let list_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_with_code_promotion_status);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID campaign, Mã Code" name="promotion_q" timeOut={800}/>
                <SearchField type="input" label="Tên, ID NTD" name="employer_q" timeOut={800}/>
                <SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={list_status}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
