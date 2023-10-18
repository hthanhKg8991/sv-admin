import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import PlanTomorrow from './PlanTomorrow';
import PlanTargetInWeek from './PlanTargetInWeek';
import * as uiAction from "actions/uiAction";


class index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.onRefresh = this._onRefresh.bind(this);
        this.refreshList = this._refreshList.bind(this);
    }
    _onRefresh(){
        this.refreshList();
    }
    _refreshList(delay = 0){
        this.props.uiAction.refreshList('PlanTomorrow',{delay});
        this.props.uiAction.refreshList('PlanTargetInWeek',{delay});
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.refresh['PlanTomorrowPage']){
            let delay = newProps.refresh['PlanTomorrowPage'].delay ? newProps.refresh['PlanTomorrowPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('PlanTomorrowPage');
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
                <div className="col-search">
                    <CustomFilter name="PlanTomorrowPage" />
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Mục Tiêu Ngày Hôm Sau</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={this.onRefresh}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <PlanTomorrow />
                            <PlanTargetInWeek />
                        </div>
                    </div>
                </div>
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
