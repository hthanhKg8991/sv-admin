import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey, sys} = this.props;
        const province = sys.province.items;
        const maxSalary = 100;
        let optionSalary = [];
        for (let i = 1; i <= maxSalary; i++) {
            optionSalary = [...optionSalary, {
                label: `${i} triệu`,
                value: i * 1000000,
            }]
        }
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="dropbox" label="Tỉnh thành" name="province_ids" key_value="id" key_title="name" data={province} />
                <SearchField type="dropbox" label="Mức lương tối thiểu" name="salary_range[from]" data={optionSalary} key_value="value" key_title="label" timeOut={1000} />
                {/*<SearchField type="dropbox" label="Mức lương tối đa" name="salary_range[to]" data={optionSalary} key_value="value" key_title="label" timeOut={1000} />*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
