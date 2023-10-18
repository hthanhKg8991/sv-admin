import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Edit from "pages/Survey/SurveyJsPage/Edit/Form";
import SurveyJs from "pages/Survey/SurveyJsPage/Edit/SurveyJs";

class EditContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            question: null,
        };

        this.fnCallback = this._fnCallback.bind(this);
    }

    _fnCallback(value) {
        this.setState({question: value})
    }

    render() {
        const {history} = this.props;
        const {id, question} = this.state;
        const idKey = "SurveyJsEdit";

        return (
            <Default
                title={`${id > 0 ? "Chỉnh Sửa" : "Thêm"} Survey`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Edit id={id} idKey={idKey} question={question} history={history}/>
                <SurveyJs id={id} idKey={idKey} fnCallback={this.fnCallback}/>
            </Default>
        )
    }
}

export default connect(null, null)(EditContainer);
