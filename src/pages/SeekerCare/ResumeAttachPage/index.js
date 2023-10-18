import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from 'query-string';
import SeekerInfo from "../ResumeStepByStepPage/SeekerInfo";
import ResumeInfo from "../ResumeStepByStepPage/ResumeInfo";
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canEdit: true,
        };
    }
    componentWillMount(){
        let params = queryString.parse(window.location.search);
        if(!params['seeker_id']){
            this.props.history.push(Constant.BASE_URL);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        const { canEdit } = this.state;
        return (
            <div className="row-body">
                <SeekerInfo history={this.props.history} canEdit={canEdit} />
                <ResumeInfo 
                    history={this.props.history} 
                    showInfo={()=>{}} 
                    resume_type={Constant.RESUME_NORMAL_FILE} 
                    canEdit={canEdit} 
                />
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
