import React, {Component} from "react";
import {VisualizationPanel} from "survey-analytics";
import * as Survey from "survey-react";
import "survey-analytics/survey.analytics.css";

export default class SurveyAnalytics extends Component {
    visPanel;

    componentDidMount() {
        const {question, data = []} = this.props;
        const survey = new Survey.SurveyModel(question);
        this.visPanel = new VisualizationPanel(survey.getAllQuestions(), data);
        this.visPanel.render(document.getElementById("summaryContainer"));
    }

    render() {
        return <div id="summaryContainer"/>;
    }
}
