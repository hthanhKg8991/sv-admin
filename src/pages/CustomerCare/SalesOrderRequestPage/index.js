import React, {Component} from "react";
import {connect} from "react-redux";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {bindActionCreators} from "redux";
import ListJobBasic from "./ListJobBasic";
import ListJobBox from "./ListJobBox";
import ListEffect from "./ListEffect";
import ListEmployerPackage from "./ListEmployerPackage";
import ListBanner from "./ListBanner";
import ListMinisite from "./ListMinisite";
import * as uiAction from "actions/uiAction";

class SalesOrderRequestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.refreshList = this._refreshList.bind(this);
    }
    _refreshList(delay = 0){
        this.props.uiAction.refreshList('ListJobBasic', {delay});
        this.props.uiAction.refreshList('ListJobBox', {delay});
        this.props.uiAction.refreshList('ListEffect', {delay});
        this.props.uiAction.refreshList('ListEmployerPackage', {delay});
        this.props.uiAction.refreshList('ListBanner', {delay});
        this.props.uiAction.refreshList('ListMinisite', {delay});
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.refresh['SalesOrderRequestPage']){
            let delay = newProps.refresh['SalesOrderRequestPage'].delay ? newProps.refresh['SalesOrderRequestPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('SalesOrderRequestPage');
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
                    <CustomFilter name="SalesOrderRequestPage" />
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <ListJobBasic />
                    <ListJobBox />
                    <ListEffect />
                    <ListEmployerPackage />
                    <ListBanner />
                    <ListMinisite />
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
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(SalesOrderRequestPage);
