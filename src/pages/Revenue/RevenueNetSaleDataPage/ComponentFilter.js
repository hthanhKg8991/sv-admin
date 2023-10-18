import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import {getListConfigKpi} from "api/commission";

class ComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            config_list: [],
        };
        this.getListConfig = this._getListConfig.bind(this);
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

    componentDidMount() {
        this.getListConfig();
    }

    render() {
        const {query, menuCode, idKey} = this.props;
        const {config_list} = this.state;

        return (
            <div className="row mt-15">
                <Filter idKey={idKey} query={query} menuCode={menuCode} initFilter={query}>
                    <SearchField className="col-md-2" type="input" label="Mã phiếu / UID" name="q" timeOut={1000}/>
                    <SearchField className="col-md-2" type="input" label="Mã NV" name="staff_code" timeOut={1000}/>
                    <SearchField className="col-md-3" type="dropbox" label="Cấu hình" name="config_id"
                                 data={config_list}/>
                    <SearchField className="col-md-2" type="datetimerangepicker" label="Ngày ghi nhận"
                                 name="receive_at"/>
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
