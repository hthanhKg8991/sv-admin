import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.query
        }
    }
    componentWillMount(){
        const {query} = this.state;
        if (!query["sales_order_status[0]"]) {
            query["sales_order_status[0]"] = Constant.SALE_ORDER_ACTIVED;
            query["sales_order_status[1]"] = Constant.SALE_ORDER_EXPIRED_ACTIVE;
            this.setState({query})
        }
    }
    render() {
        const {menuCode, idKey} = this.props;
        const {query} = this.state;

        return (
            <div className="row mt-15 mb5 d-flex">
                <Filter idKey={idKey} query={query} menuCode={menuCode}>
                    <SearchField type="input" className="col-md-2" label="Id/Email" name="q"
                                 timeOut={1000}/>
                </Filter>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
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
