import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Detail from "pages/QualityControlEmployer/ApproveAssignmentRequestPage/Detail";

class DetailContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id')
        };
    }

    render() {
        const {history} = this.props;
        const {id} = this.state;
        const idKey = "ApproveAssignmentRequestDetail";

        return (
            <Default
                title={'Chi Tiết Yêu Cầu Chờ Duyệt'}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Detail idKey={idKey} id={id} history={history}/>
            </Default>
        )
    }
}

export default connect(null, null)(DetailContainer);
