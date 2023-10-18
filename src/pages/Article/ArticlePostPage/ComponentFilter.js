import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        let status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_article_status);

        const {query, menuCode} = this.props;

        return (
            <FilterLeft idKey={"ArticlePostList"} query={query} menuCode={menuCode}>
                {/*id,title*/}
                <SearchField type="input" label="ID, Tiêu đề" name="q" timeOut={1000}/>
                {/*status*/}
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status}/>
            </FilterLeft>
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
