import React,{Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PopupPlanDailyRevenue  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},props.object),
            object_error: {},
            object_required:['employer_name','quantity','revenue']
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(object){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();

        if (!object.achievement_id){
            object.date = this.props.date;
            object.team_id = this.props.team_id;
            object.staff_id = this.props.staff_id;
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_PLAN_DAILY_REVENUE_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_PLAN_DAILY_REVENUE_UPDATE, object);
        }
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        this.props.uiAction.hideLoading();
        if (newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('PlanDailyRevenueMemberDetail',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenueMember',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenueTeam',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenuePage',{update: true});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_DAILY_REVENUE_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('PlanDailyRevenueMemberDetail',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenueMember',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenueTeam',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenuePage',{update: true});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_DAILY_REVENUE_UPDATE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {object, object_error, object_required, name_focus} = this.state;
        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="employer_name" label="Tên NTD" required={object_required.includes('employer_name')}
                                        error={object_error.employer_name} value={object.employer_name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <Input2 type="text" name="quantity" label="Tổng số phiếu" isNumber required={object_required.includes('quantity')}
                                        error={object_error.quantity} value={object.quantity} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <Input2 type="text" name="revenue" label="Tổng giá trị" isNumber required={object_required.includes('revenue')}
                                        error={object_error.revenue} value={object.revenue} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}
function mapStateToProps(state) {
    return {
        api: state.api,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupPlanDailyRevenue);
