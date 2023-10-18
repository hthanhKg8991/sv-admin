import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {

    render () {
        const {query, menuCode, idKey} = this.props;
        const callStatus = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_call_inline_status);
        const now = moment();
        const last = moment().subtract(1, 'days');
        const ranges = {
            'Hôm nay': [now, now],
            'Hôm qua': [last, last],
            '7 Ngày': [moment().subtract(6, 'days'), now],
            '1 Tháng': [moment().subtract(30, 'days'), now],
            '3 Tháng': [moment().subtract(90, 'days'), now],
            '6 Tháng': [moment().subtract(180, 'days'), now],
        };

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="datetimerangepicker" label="Thời gian gọi" name="date" ranges={ranges}/>
                <SearchField type="input" label="ID cuộc gọi" name="q" timeOut={1000}/>
                <SearchField type="input" label="Gọi từ số" name="source_number" numberOnly timeOut={1000}/>
                <SearchField type="input" label="Gọi đến số" name="destination_number" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái trả lời" name="call_status" data={callStatus} />
                <SearchField type="input" label="Thời lượng từ (s)" name="duration[from]" numberOnly timeOut={1000}/>
                <SearchField type="input" label="Thời lượng đến (s)" name="duration[to]" numberOnly timeOut={1000}/>
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
