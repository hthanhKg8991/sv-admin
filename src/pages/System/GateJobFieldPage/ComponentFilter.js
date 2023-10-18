import React, {Component} from "react";
import {connect} from "react-redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {}
        };
        this.onSearch = this._onSearch.bind(this);
    }
    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('GateJobFieldPage');
    }
    componentWillMount(){
        this.props.uiAction.refreshList('GateJobFieldPage');
    }
    componentWillReceiveProps(newProps) {
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            let params = queryString.parse(window.location.search);
            delete params.gate_code;
            this._onSearch(params);
            this.props.uiAction.refreshList('BoxSearch');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let gateList = this.props.sys.gate.items;
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="dropbox" label="Cổng" name="gate_code" data={gateList} key_value="code" key_title="full_name"/>
            </BoxSearch>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
