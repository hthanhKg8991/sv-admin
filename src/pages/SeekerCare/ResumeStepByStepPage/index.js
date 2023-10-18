import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from 'query-string';
import SeekerInfo from "./SeekerInfo";
import ResumeInfo from "./ResumeInfo";
import DiplomaInfo from "./DiplomaInfo";
import ExperienceInfo from "./ExperienceInfo";
import ConsultorInfo from "./ConsultorInfo";
import LanguageInfo from "./LanguageInfo";
import SkillInfo from "./SkillInfo";
import ItInfo from "./ItInfo";
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_showInfo: false,
            resume_info: null,
            canEdit: true,
        };
        this.showInfo = this._showInfo.bind(this);
    }
    _showInfo(show = false, status, last_revision_status){
        this.setState({is_showInfo: show});
        this.setState({status: Number(status)});
        this.setState({last_revision_status: Number(last_revision_status)});
    }
    componentWillMount(){
        let params = queryString.parse(window.location.search);
        if(!params['seeker_id']){
            this.props.history.push(Constant.BASE_URL_ERROR);
        }
        if(params['canEdit'] && params['canEdit'] === 'false'){
            this.setState({canEdit: false});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {is_showInfo, status, canEdit} = this.state;
        return (
            <div className="row-body">
                <SeekerInfo history={this.props.history} canEdit={canEdit}/>
                <ResumeInfo history={this.props.history} canEdit={canEdit} showInfo={this.showInfo} resume_type={Constant.RESUME_NORMAL}/>
                {is_showInfo && (
                    <React.Fragment>
                        <DiplomaInfo status={status} canEdit={canEdit} />
                        <ExperienceInfo status={status} canEdit={canEdit}/>
                        <ConsultorInfo status={status} canEdit={canEdit}/>
                        <LanguageInfo status={status} canEdit={canEdit}/>
                        {/* <SkillInfo status={status} canEdit={canEdit}/> */}
                        <ItInfo status={status} canEdit={canEdit}/>
                    </React.Fragment>
                )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
