import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import {getListConfigGroup, getListConfigKpi} from "api/commission";

class ComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            config_list: [],
            config_group_list: [],
        }
    }

    async _getListConfig() {
        const res = await getListConfigKpi({per_page: 100});
        if (res && Array.isArray(res.items)) {
            const configList = res.items.map(item => {
                return {
                    title: item?.name,
                    value: item?.id
                }
            });
            this.setState({config_list: configList});
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
            this.setState({config_group_list: configGroupList});
        }
    }

    componentDidMount() {
        this._getListConfig();
        this._getListConfigGroup();
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        const {config_list, config_group_list} = this.state;
        return (
            <div className="row mt-15">
                <Filter idKey={idKey} query={query} menuCode={menuCode} initFilter={{config_id: query?.config_id}}>
                    <SearchField className="col-md-2" type="input" label="ID, Tên" name="q" timeOut={1000}/>
                    <SearchField className="col-md-2" type="dropbox" label="Cấu hình" name="config_id" data={config_list}/>
                    <SearchField className="col-md-2" type="dropbox" label="Parent code" name="parent_code" data={config_group_list}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
