import React, {Component} from "react";
import SurveyCreator from "./SurveyCreator";
import {bindActionCreators} from "redux";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {connect} from "react-redux";
import {getDetailSurveyJsQuestion} from "api/survey";

class SurveyJs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            isLoading: false,
        }
        this.onSave = this._onSave.bind(this);
    }

    _onSave(value) {
        const {fnCallback} = this.props;
        fnCallback(value);
    }

    async _asyncData() {
        const {id} = this.state;
        this.setState({loading: true});
        const res = await getDetailSurveyJsQuestion({id});
        if (res) {
            this.setState({item: res, isLoading: true});
        }
        this.setState({loading: false});
    }

    componentDidMount() {
        const {id} = this.state;
        if (id > 0) {
            this._asyncData();
        } else {
            this.setState({isLoading: true})
        }
    }

    render() {
        const {item, isLoading} = this.state;
        if (!isLoading) {
            return <></>;
        }
        return (
            <div className="mt30">
                {isLoading && <SurveyCreator onSave={this.onSave} item={item}/>}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyJs);
