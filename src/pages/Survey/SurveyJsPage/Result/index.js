import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {putToastError, putToastSuccess} from "actions/uiAction";
import {getDetailSurveyJsQuestion, getResultSurveyJsAnswer} from "api/survey";
import SurveyAnalytics from "pages/Survey/SurveyJsPage/Result/SurveyAnalytics";
import {subscribe} from "utils/event";

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            loading: true,
            item: null,
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({ loading: true }, () => {
                this._asyncData();
            });
        }, props.idKey));
    }

    async _asyncData() {
        const {id} = this.state;
        const resQuestion = await getDetailSurveyJsQuestion({id});
        if (resQuestion) {
            this.setState({item: resQuestion});
        }
        const resResult = await getResultSurveyJsAnswer({surveyjs_question_id: id});
        if (resResult) {
            this.setState({result: resResult});
        }
        this.setState({loading: false});
    }

    render() {
        const {loading, item, result} = this.state;
        if (loading) {
            return <></>;
        }
        return (
            <div className="survey-result">
                <SurveyAnalytics question={item?.question} data={result}/>
            </div>
        )
    }

    componentDidMount() {
        this._asyncData();
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Result);
