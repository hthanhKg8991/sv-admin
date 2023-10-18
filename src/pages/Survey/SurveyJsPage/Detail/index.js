import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import {putToastError, putToastSuccess} from "actions/uiAction";
import {createSurveyJsAnswer} from "api/survey";
import * as Survey from "survey-react";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";
import "survey-react/survey.css";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            loading: true,
        };
        this.onComplete = this._onComplete.bind(this);
    }

    async _onComplete(survey) {
        const {actions, answerDetail, idKey} = this.props;
        let query = queryString.parse(window.location.search);
        const {item} = this.props;
        let res;
        const data = {
            surveyjs_question_id: item.id,
            answer: JSON.stringify(survey.data)
        };

        if (answerDetail?.answer) {
            actions.putToastError("Tài khoản đã thực hiện khảo sát!");
            return false;
        } else {
            res = await createSurveyJsAnswer(data);
        }

        if (res) {
            actions.putToastSuccess("Khảo sát thành công!");

            if (query?.referralFrom === Constant.REFERRAL_FROM_HOME_PAGE) {
                return;
            }

            publish(".refresh", {}, idKey);
        }
    }

    render() {
        const {item} = this.props;
        if (!item) {
            return <></>;
        }
        if (parseInt(item.status) !== Constant.STATUS_ACTIVED) {
            return <p className="text-red fs16 mb30">Khảo sát đang được tắt!</p>
        }

        const {answerDetail} = this.props;
        const model = new Survey.Model(item.question);
        const answer = JSON.parse(answerDetail?.answer || null);

        return (
            <Survey.Survey model={model} data={answer} onComplete={this.onComplete}/>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Detail);
