import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Detail from "pages/SeekerCare/ResumeTemplatePage/DetailNew";

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
        const idKey = "ResumeTemplateDetail";

        return (
            <Default
                    title={'Chi Tiết Hồ Sơ Mẫu'}
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
