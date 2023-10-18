import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Detail from "./Detail";

class DetailContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            code: _.get(queryParsed, 'code'),
            tabActive: _.get(queryParsed, 'tabActive'),
        };
    }

    render() {
        const {history} = this.props;
        const {code, tabActive} = this.state;
        const idKey = "BookingDetail";

        return (
            <Default
                title={'Chi Tiết Mã Đặt Chỗ'}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Detail idKey={idKey} code={code} history={history} tabActive={tabActive}/>
            </Default>
        )
    }
}

export default connect(null, null)(DetailContainer);
