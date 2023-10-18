import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from 'query-string';
import * as Constant from "utils/Constant";
import SeekerInfo from "pages/SeekerCare/ResumeStepByStepPage/SeekerInfo";
import CvInfo from "pages/SeekerCare/SeekerPage/Cv/CvInfo";

class index extends Component {
    constructor(props){
        super(props);
        this.state = {
            canEdit: true,
        }
    }
    componentWillMount(){
        let params = queryString.parse(window.location.search);
        if(!params['seeker_id']){
            this.props.history.push(Constant.BASE_URL_ERROR);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render () {
        const { canEdit } = this.state
        return (
            <div className="row-body">
                <SeekerInfo history={this.props.history} canEdit={canEdit}/>
                <CvInfo history={this.props.history} />
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
