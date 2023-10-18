import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import Dropbox from 'components/Common/InputValue/Dropbox';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from "moment/moment";
import classnames from 'classnames';

class PopupChangeBasket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list:[],
            page:1,
            per_page:5,
            pagination_data:{},
            staff_list: [],
            basket: {},
            basket_error: {},
            basket_required: ['assigned_staff_id', 'reason'],
            name_focus: ''
        };
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getCustomerCare = this._getCustomerCare.bind(this);
        this.onSave = this._onSave.bind(this);
    }
    _changePage(newpage){
        this.setState({page: newpage},()=>{
            this.refreshList();
        });
    }
    _changePerPage(newperpage){
        this.setState({page: 1});
        this.setState({per_page: newperpage},()=>{
            this.refreshList();
        });
    }
    _refreshList(delay = 0){
        let args = {
            seeker_id: this.props.object.id,
            per_page: this.state.per_page,
            page: this.state.page
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_SEEKER_HISTORY_LIST_ASSIGNMENT, args, delay);
    }
    _hidePopup(){
        this.props.uiAction.deletePopup();
    }
    _onChange(value, name){
        let basket_error = this.state.basket_error;
        delete basket_error[name];
        this.setState({basket_error: basket_error});
        this.setState({name_focus: ""});
        let basket = Object.assign({},this.state.basket);
        basket[name] = value;
        this.setState({basket: basket});
    }
    _getCustomerCare(){
        let args = {
            'division_code[0]': Constant.DIVISION_TYPE_seeker_care_leader,
            'division_code[1]': Constant.DIVISION_TYPE_seeker_care_member,
          execute: true,
          scopes: true,
          status: Constant.STATUS_ACTIVED,
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, args);
    }
    _onSave(event){
        event.preventDefault();
        this.setState({basket_error: {}});
        this.setState({name_focus: ""});
        let basket = this.state.basket;
        let check = utils.checkOnSaveRequired(basket, this.state.basket_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        basket.seeker_id = this.props.object.id;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_CHANGE_ASSIGNER, basket);
    }
    componentWillMount(){
        this.refreshList();
        this.getCustomerCare();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_SEEKER_HISTORY_LIST_ASSIGNMENT]){
            let response = newProps.api[ConstantURL.API_URL_GET_SEEKER_HISTORY_LIST_ASSIGNMENT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SEEKER_HISTORY_LIST_ASSIGNMENT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SEEKER_CHANGE_ASSIGNER]){
            let response = newProps.api[ConstantURL.API_URL_POST_SEEKER_CHANGE_ASSIGNER];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({basket: {}});
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }else{
                this.setState({basket_error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SEEKER_CHANGE_ASSIGNER);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {basket, basket_error, basket_required, name_focus, staff_list, data_list} = this.state;
        let employer_discharged_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_discharged_reason);
        let employer_discharged_reason_arr = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_discharged_reason);

        return (
            <div className="dialog-popup-body">
                <div className="relative form-container">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <form onSubmit={this.onSave}>
                                <div className="col-sm-12 sub-title-form mb15">
                                    <span>Chuyển giỏ</span>
                                </div>
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <Dropbox name="assigned_staff_id" label="CSKH" data={staff_list} key_value="id" key_title="login_name"
                                             required={basket_required.includes('assigned_staff_id')} nameFocus={name_focus}
                                             value={basket.assigned_staff_id} error={basket_error.assigned_staff_id}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <Dropbox name="reason" label="Lý do chuyển" data={employer_discharged_reason_arr}
                                                  required={basket_required.includes('reason')} nameFocus={name_focus}
                                                  value={basket.reason} error={basket_error.reason}
                                                  onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb15">
                                    <button type="submit" className="el-button el-button-success el-button-small">
                                        <span>Chuyển</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="body-table el-table crm-section">
                            <TableComponent>
                                <TableHeader tableType="TableHeader" width={250}>
                                    CSKH
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={230}>
                                    Lý do
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={130}>
                                    Ngày chuyển
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={130} dataField="created_by">
                                    người chuyển
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key)=> {
                                        let from_staff_username = item.from_staff_username ? item.from_staff_username : '';
                                        let to_staff_username = item.to_staff_username ? item.to_staff_username : '';
                                        let reason = employer_discharged_reason[item.reason] || "Chưa có lý do";
                                        let data = {
                                            staff_username: from_staff_username + ' -> ' + to_staff_username,
                                            reason: reason,
                                            created_at: moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
                                            created_by: item.created_by,
                                        };
                                        return (
                                            <tr key={key} className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                                {Object.keys(data).map((name, k) => {
                                                    return(
                                                        <td key={k}>
                                                            <div className="cell" title={data[name]}>{data[name]}</div>
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
                        </div>
                        <div className="crm-section">
                            <Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={false}/>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.hidePopup}>
                            <span>Đóng</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupChangeBasket);
