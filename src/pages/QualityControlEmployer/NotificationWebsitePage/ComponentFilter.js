import React, {Component} from "react";
import {connect} from "react-redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {

            }
        };
        this.onSearch = this._onSearch.bind(this);
    }
    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('NotificationWebsitePage');
    }
    componentWillMount(){
        this.props.uiAction.refreshList('NotificationWebsitePage');
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let notification_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_notification_status);
        let notification_object = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_notification_object);
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="input" label="Tiêu đề , Nội dung" name="q" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={notification_status}/>
                <SearchField type="dropbox" label="Đối tượng" name="notify_object" data={notification_object}/>
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
