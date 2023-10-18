import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Info from "./Info";
import RecruitmentRequestDetailReport from "pages/HeadhuntPage/RecruitmentRequestPage/Report";
const idKey = "RecruitmentRequestDetail";

class Detail extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id')
        };
    }

    render() {
        const {id} = this.state;
        return (
            <>
                <Default
                    title={"Chi tiết Recruitment Request"}
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}>
                        <Info  {...this.props} id={id} idKey={idKey} />
                </Default>
                <div className="mb10"></div>
                <RecruitmentRequestDetailReport {...this.props} />
            </>

        )
    }
}

export default connect(null, null)(Detail);
