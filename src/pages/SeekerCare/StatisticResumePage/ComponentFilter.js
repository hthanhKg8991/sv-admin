import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import moment from "moment";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        const {query, menuCode, idKey} = this.props;
        let now = moment();
        let last = moment().subtract(1, 'days');
        let ranges = {
            'Hôm nay': [now, now],
            'Hôm qua': [last, last],
            '7 Ngày': [moment().subtract(6, 'days'), now],
            '1 Tháng': [moment().subtract(30, 'days'), now],
            '3 Tháng': [moment().subtract(90, 'days'), now],
            '6 Tháng': [moment().subtract(180, 'days'), now],
        };

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="datetimerangepicker" label="Ngày thống kê" name="statistic_date" ranges={ranges}/>
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
