import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import {getListConfigGroup, getListConfigKpi} from "api/commission";

class ComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            group_code_list: [],
        }
    }

    async _getListConfigGroup() {
        const res = await getListConfigGroup({per_page: 100});
        if (res && Array.isArray(res.items)) {
            const configGroupList = res.items.map(item => {
                return {
                    title: item?.name,
                    value: item?.code
                }
            });
            this.setState({group_code_list: configGroupList});
        }
    }

    componentDidMount() {
        this._getListConfigGroup();
    }

    render() {
        const {query, menuCode, idKey, config_list} = this.props;
        const {group_code_list} = this.state;
        const position = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_revenue_staff_position);
        return (
            <div className="row mt-15">
                <Filter idKey={idKey} query={query} menuCode={menuCode} initFilter={{config_id: query?.config_id}}>
                    <SearchField className="col-md-3" type="input" label="ID, Tên" name="q" timeOut={1000}/>
                    <SearchField className="col-md-3" type="dropbox" label="Cấu hình" name="config_id" data={config_list}/>
                    <SearchField className="col-md-3" type="dropbox" label="Team" name="group_code" data={group_code_list}/>
                    <SearchField className="col-md-3" type="dropbox" label="Chức vụ" name="position" data={position}/>
                </Filter>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
