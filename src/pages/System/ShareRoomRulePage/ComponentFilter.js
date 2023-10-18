import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {getListShareRoom} from "api/employer";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            share_room_list: []
        };
    }

    async _getShareRoom() {
        const res = await getListShareRoom();
        if(res) {
            this.setState({
                share_room_list: res?.items || []
            })
        }
    }

    componentDidMount() {
        this._getShareRoom();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        const {share_room_list} = this.state;
        const employer_company_kind = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_kind);
        const throw_account_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_throwout_type);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="dropbox" label="Quy mô" name="company_kind" data={employer_company_kind}/>
                <SearchField type="dropbox" label="Loại KH" name="throwout_type" data={throw_account_type}/>
                <SearchField type="dropbox" label="Danh sách nhận" key_value="id" key_title="name" name="config_id" data={share_room_list}/>
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
