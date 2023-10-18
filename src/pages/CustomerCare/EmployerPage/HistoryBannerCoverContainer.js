import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";
import HistoryBannerCover from "pages/CustomerCare/EmployerPage/HistoryBannerCover";

class HistoryBannerCoverContainer extends Component {
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
        const idKey = "EmployerBannerCoverHistory";

        return <HistoryBannerCover idKey={idKey} id={id} history={history} />
    }
}

export default connect(null, null)(HistoryBannerCoverContainer);
