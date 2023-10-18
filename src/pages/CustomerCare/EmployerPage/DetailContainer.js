import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Detail from "pages/CustomerCare/EmployerPage/DetailNew";

class DetailContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            tabActive: _.get(queryParsed, 'tabActive'),
        };
    }

    render() {
        const {history} = this.props;
        const {id, tabActive} = this.state;
        const idKey = "EmployerDetail";

        return (
            <Default
                title={'Chi Tiết Nhà Tuyển Dụng'}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Detail idKey={idKey} id={id} history={history} tabActive={tabActive}/>
            </Default>
        )
    }
}

export default connect(null, null)(DetailContainer);
