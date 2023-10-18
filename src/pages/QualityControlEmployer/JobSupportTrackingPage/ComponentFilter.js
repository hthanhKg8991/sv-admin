import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.onSearch = this._onSearch.bind(this);
    }
    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('JobSupportTrackingPage');
    }
    componentWillMount(){
        this.props.uiAction.refreshList('JobSupportTrackingPage');
    }
    render () {
        let job_support_tracking_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_support_tracking_type);
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="dropbox" label="Loại tracking" name="tracking_type" data={job_support_tracking_type}/>
                <SearchField type="input" label="ID TTD" name="job_id" timeOut={1000}/>
                <SearchField type="input" label="ID NTV" name="seeker_id" timeOut={1000}/>
                <SearchField type="input" label="Campaign" name="campaign" timeOut={1000}/>
            </BoxSearch>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
