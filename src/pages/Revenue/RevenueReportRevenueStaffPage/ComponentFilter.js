import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {getListConfigGroup, getListConfigKpi} from "api/commission";
import Filter from "components/Common/Ui/Table/Filter";

class ComponentFilter extends Component {
    constructor() {
        super();
        this.state = {
            group_list: [],
        };
        this.getListStaffGroupCode = this._getListStaffGroupCode.bind(this);
        this.getListConfig = this._getListConfig.bind(this);
    }

    async _getListStaffGroupCode(config_id) {
        const res = await getListConfigGroup({
            config_id: config_id,
            per_page: 100
        });

        if (res && Array.isArray(res.items)) {
            const groupList = res.items.map(item => {
                return {
                    title: item?.name,
                    value: item?.code
                }
            });
            this.setState({group_list: groupList});
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

    componentDidMount() {
        const {config_id} = this.props.query;
        if (Number(config_id) > 0) {
            this.getListStaffGroupCode(config_id);
        }
        this.getListConfig();
    }

    componentWillReceiveProps(newProps) {
        if (newProps?.query?.config_id !== this.props?.query?.config_id && newProps?.query?.config_id > 0) {
            this.getListStaffGroupCode(newProps?.query?.config_id);
        }
    }

    render() {
        const {query, menuCode, idKey} = this.props;
        const {group_list, config_list} = this.state;
        const position = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_revenue_staff_position);

        return (
            <div className="row mt-15 d-flex">
                <Filter idKey={idKey} query={query} menuCode={menuCode} initFilter={{config_id: query?.config_id}}>
                    <SearchField className="col-md-3" type="input" label="ID, Tên" name="q" timeOut={1000}/>
                    <SearchField className="col-md-3" type="dropbox" label="Cấu hình" name="config_id" data={config_list}/>
                    <SearchField className="col-md-3" type="dropbox" label="Team" name="staff_group_code" data={group_list}/>
                    <SearchField className="col-md-3" type="dropbox" label="Vị trí" name="staff_position" data={position}/>
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
