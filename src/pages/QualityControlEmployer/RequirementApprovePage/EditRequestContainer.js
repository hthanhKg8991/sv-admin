import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Edit from "pages/QualityControlEmployer/RequirementApprovePage/EditRequest";

class FormContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            employer_id: _.get(queryParsed, 'employer_id'),
            job_id: _.get(queryParsed, 'job_id'),
            type: _.get(queryParsed, 'type'),
            id: _.get(queryParsed, 'id'),
        };
    }

    render() {
        const {history} = this.props;
        const {employer_id,job_id,type,id} = this.state;
        const idKey = "RequestEdit";
        return (
            <Default
                title={`Gửi yêu cầu`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Edit idKey={idKey} id={id} employer_id={employer_id} job_id={job_id} type={type} history={history}/>
            </Default>
        )
    }
}

export default connect(null, null)(FormContainer);
