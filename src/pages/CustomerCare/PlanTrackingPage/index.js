import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PlanTrackingMonth from './PlanTrackingMonth';
import PlanTrackingWeek from './PlanTrackingWeek';
import * as uiAction from "actions/uiAction";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.refreshList = this._refreshList.bind(this);
    }

    _refreshList(delay = 0){
        this.props.uiAction.refreshList('PlanTrackingMonth', {delay});
        this.props.uiAction.refreshList('PlanTrackingWeek', {delay});
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.refresh['PlanTrackingPage']){
            let delay = newProps.refresh['PlanTrackingPage'].delay ? newProps.refresh['PlanTrackingPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('PlanTrackingPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        return (
            <div className="row-body">
                <React.Fragment>
                    <div className="col-search">
                        <CustomFilter name="PlanTrackingPage" />
                        <ComponentFilter history={this.props.history}/>
                    </div>
                    <div className="col-result">
                        <div className="box-card">
                            <div className="box-card-title">
                                <span className="title left">Danh Sách Kế Hoạch Trong Tháng</span>
                                <div className="right">
                                    <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                        <i className="fa fa-refresh"/>
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <PlanTrackingMonth />
                                <PlanTrackingWeek />
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        refresh: state.refresh,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
