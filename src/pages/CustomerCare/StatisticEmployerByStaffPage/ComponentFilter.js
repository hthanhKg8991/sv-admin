import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import moment from 'moment-timezone';
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
        };
        this.onSearch = this._onSearch.bind(this);
    }
    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('CallStatisticPage');
    }
    componentWillMount(){
        let params = queryString.parse(window.location.search);
        if (!params['assigned[from]']){
            params['assigned[from]'] = moment().unix();
        }
        if (!params['assigned[to]']){
            params['assigned[to]'] = moment().unix();
        }
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.setState({params: params});
        this.props.uiAction.refreshList('StatisticEmployerByStaffPage');
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
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
        let employer_premium_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_premium_status);
        let employer_discharged_reason = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_discharged_reason);
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="datetimerangepicker" label="Thời gian xả" name="assigned" ranges={ranges}/>
                <SearchField type="input" label="Mã,tên, email NTD" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Loại tài khoản" name="premium_status" data={employer_premium_status}/>
                <SearchField type="datetimerangepicker" label="Ngày chăm sóc" name="assigning_changed_at" ranges={ranges}/>
                <SearchField type="dropbox" label="Loại xả" name="reason" data={employer_discharged_reason}/>
            </BoxSearch>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
