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
        this.props.uiAction.refreshList('DivideEmployerPage');
    }
    componentWillMount(){
        this.props.uiAction.refreshList('DivideEmployerPage');
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let divide_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_divide_status);
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="datetimerangepicker" label="Ngày đăng ký" name="created_at"/>
                <SearchField type="dropbox" name="status" label="Trạng thái" data={divide_status}/>
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
