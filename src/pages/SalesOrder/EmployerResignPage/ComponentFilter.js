import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import {getTeamMember} from "api/auth";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staff_list: []
        };
    }

    async _getCustomerCare(){
        const res = await getTeamMember({
            division_code_list: [
                Constant.DIVISION_TYPE_customer_care_leader,
                Constant.DIVISION_TYPE_customer_care_member,
            ]
        });
        if(res) {
            this.setState({
                staff_list: res
            });
        }
    }

    componentDidMount(){
        this._getCustomerCare();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        const {staff_list} = this.state;

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Id, Tên, Email" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="CSKH" name="created_by_id" key_value="id" key_title="login_name" data={staff_list}/>
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
