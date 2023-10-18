import React, {Component} from "react";
import * as SurveyJSCreator from "survey-creator";
import "survey-creator/survey-creator.css";

SurveyJSCreator.StylesManager.applyTheme("default");

class SurveyCreator extends Component {
    surveyCreator;

    onSaveSurvey = () => {
        this.props.onSave(this.surveyCreator.text);
    };

    componentDidMount() {
        const {item} = this.props;
        const options = {showEmbededSurveyTab: true};
        this.surveyCreator = new SurveyJSCreator.SurveyCreator(null, options);
        this.surveyCreator.text = item?.question;
        this.surveyCreator.saveSurveyFunc = this.onSaveSurvey;
        this.surveyCreator.render("surveyCreatorContainer");
    }

    render() {
        return <div id="surveyCreatorContainer"/>;
    }
}

export default SurveyCreator;
