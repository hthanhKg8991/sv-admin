import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Result from "pages/Survey/SurveyJsPage/Result";
import * as Constant from "utils/Constant";

class ResultContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
        };
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SURVEY,
            search: '?action=list'
        });
        return true;
    }

    render() {
        const {history} = this.props;
        const {id} = this.state;
        const idKey = "SurveyJsResult";

        return (
            <Default
                title={`Kết quả Survey`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <button type="button" className="el-button el-button-default el-button-small ml15"
                        onClick={() => this.goBack()}>
                    <span>Quay lại</span>
                </button>
                <Result id={id} idKey={idKey} history={history}/>
            </Default>
        )
    }
}

export default connect(null, null)(ResultContainer);
