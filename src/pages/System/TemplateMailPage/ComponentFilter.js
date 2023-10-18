import React, {Component} from "react";
import {connect} from "react-redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
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
        this.props.uiAction.refreshList('TemplateMailPage');
    }
    componentWillMount(){
        this.props.uiAction.refreshList('TemplateMailPage');
    }
    render () {
        let email_template_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_email_template_type);
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="input" label="Tên mail" name="code" timeOut={1000}/>
                <SearchField type="dropbox" label="Loại mail" name="email_type" data={email_template_type}/>
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
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
