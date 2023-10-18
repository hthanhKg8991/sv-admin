import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import classnames from 'classnames';
import moment from "moment";
import config from 'config';
import HistoryDetail from "./HistoryDetail";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list:[],
            page:1,
            per_page:5,
            pagination_data:{},
            loading: true
        };
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
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
    _refreshList(){
        let args = {
            per_page: this.state.per_page,
            page: this.state.page
        };
        args['order_by[ordering]'] = 'ASC';
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LOG_LIST, args);
    }
    _activeItem(key){
        let itemActive = this.state.itemActive;
        itemActive = itemActive === key ? -1 : key;
        this.setState({itemActive: itemActive});
    }
    _hidePopup(){
        this.props.uiAction.deletePopup();
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LOG_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LOG_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LOG_LIST);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        if (this.state.loading){
            return(
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        let {data_list} = this.state;
        let branch_list = utils.convertArrayToObject(this.props.branch.branch_list, 'code');
        let note_hotline_log = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_note_hotline_log);
        return (
            <div className="dialog-popup-body">
                <div className="form-container">
                    <div className="popupContainer">
                        <div className="body-table el-table crm-section">
                            <TableComponent>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Người cập nhật
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Thời gian cập nhật
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={100}>
                                    Chi nhánh
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Tuần
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Lý do
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key)=> {
                                        let created_at = moment.unix(item.created_at);
                                        let week = moment(created_at).week();
                                        let data = {
                                            created_by: item.created_by,
                                            created_at: created_at.format("DD/MM/YYYY HH:mm:ss"),
                                            branch_code: branch_list[item.branch_code] ? branch_list[item.branch_code].name : item.branch_code,
                                            week: `${week}/${created_at.format("YYYY")} (${created_at.week(week).isoWeekday(1).format("DD/MM/YYYY")} - ${created_at.week(week).isoWeekday(7).format("DD/MM/YYYY")})`,
                                            note: note_hotline_log[item.note] ? note_hotline_log[item.note] : item.note
                                        };
                                        return(
                                            <React.Fragment key={key}>
                                                <tr className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""), (this.state.itemActive === item.id ? "active" : ""))} onClick={()=>{this.activeItem(item.id)}}>
                                                    {Object.keys(data).map((name, key) => {
                                                        return(
                                                            <td key={key}>
                                                                <div className="cell" title={data[name]}>{data[name]}</div>
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                                {this.state.itemActive === item.id && (
                                                    <tr className="el-table-item">
                                                        <td colSpan={5}>
                                                            <HistoryDetail item={item}/>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
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
        branch: state.branch
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(index);
