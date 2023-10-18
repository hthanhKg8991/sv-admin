import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {getListShareBasket} from "api/employer";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            share_basket_list: []
        };
    }

    async _getShareBasket() {
        const res = await getListShareBasket();
        if(res) {
            this.setState({
                share_basket_list: res?.items || []
            })
        }
    }

    componentDidMount() {
        this._getShareBasket();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        const {share_basket_list} = this.state;
        const employer_company_kind = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_kind);
        const throw_account_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_throwout_type);
        const type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_assigned_type);
        const ignore_type_options  = type.filter(e => e.value !== Constant.ASSIGNMENT_CUSTOMER_BIG);
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="dropbox" label="Danh sách nhận" key_value="id" key_title="name" name="config_id" data={share_basket_list}/>
                <SearchField type="dropbox" label="Quy mô" name="company_kind" data={employer_company_kind}/>
                <SearchField type="dropbox" label="Loại KH cũ/mới" name="throwout_type" data={throw_account_type}/>
                <SearchField type="dropbox" label="Loại CSKH" name="type" data={ignore_type_options}/>
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
