import React, {Component} from "react";
import {connect} from "react-redux";
import {publish, subscribe} from "utils/event";
import _ from "lodash";
import {getDetailSurveyJsAnswerFull, getDetailSurveyJsQuestion} from "api/survey";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import Detail from "pages/Survey/SurveyJsPage/Detail";
import * as Constant from "utils/Constant";

const idKey = "SurveyJsDetail";

class DetailContainer extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            item: null,
            answerDetail: null,
            loading: true,
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this._getDetailAnswer();
            });
        }, idKey));

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

    async _getDetailAnswer() {
        const {id} = this.state;
        this.setState({loading: true});
        const res = await getDetailSurveyJsAnswerFull({surveyjs_question_id: id});
        if (res) {
            this.setState({answerDetail: res.data, loading: false});
        }
        this.setState({loading: false});
    }

    async _getDetailQuestion() {
        const {id} = this.state;
        const res = await getDetailSurveyJsQuestion({id});
        if (res) {
            this.setState({item: res});
        }
        this.setState({loading: false});
    }

    componentDidMount() {
        this._getDetailAnswer();
        this._getDetailQuestion();
    }

    render() {
        const {id, item, answerDetail} = this.state;
        return (
            <Default
                title={item?.title}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Detail id={id} idKey={idKey} item={item} answerDetail={answerDetail}/>
            </Default>
        )
    }
}

export default connect(null, null)(DetailContainer);
