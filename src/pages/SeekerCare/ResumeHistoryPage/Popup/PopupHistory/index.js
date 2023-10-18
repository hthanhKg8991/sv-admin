import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import HistoryDetail from "./HistoryDetail";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import classnames from 'classnames';
import moment from "moment";
import config from 'config';
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
            seeker_id: this.props.object.id,
            per_page: this.state.per_page,
            page: this.state.page
        };

        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_SEEKER_REVISION_LIST, args);
        });
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
        if (newProps.api[ConstantURL.API_URL_GET_SEEKER_REVISION_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_SEEKER_REVISION_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                if (this.state.page === 1 && response.data.items[0]){
                    let id = response.data.items[0].id;
                    this.setState({itemActive: id});
                    this.setState({itemApprove: id});
                }
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SEEKER_REVISION_LIST);
            this.setState({loading: false});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let seeker_rejected_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_rejected_reason);
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
                                    Trạng thái
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Người duyệt
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Ngày duyệt/không duyệt
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Lý do
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {this.state.data_list.map((item, key)=> {
                                        let updated_at = parseInt(item.updated_at);

                                        let rejected_reason = '';
                                        item.rejected_reason.forEach((reason) => {
                                            rejected_reason += '- ' + seeker_rejected_reason[reason] + "\n";
                                        });
                                        rejected_reason = item.rejected_reason_note ? rejected_reason + '- ' + item.rejected_reason_note : rejected_reason.substr(0, rejected_reason.length - 1);

                                        let i = {
                                            updated_by: item.updated_by,
                                            updated_at: updated_at ? moment.unix(updated_at).format('DD/MM/YYYY HH:mm:ss') : '',
                                            revision_status: seeker_status[item.revision_status],
                                            approved_by: item.approved_by,
                                            approved_at: [Constant.STATUS_ACTIVED, Constant.STATUS_DISABLED].includes(parseInt(item.revision_status)) ? moment.unix(updated_at).format('DD/MM/YYYY HH:mm:ss') : '',
                                            rejected_reason: rejected_reason
                                        };
                                        return(
                                            <React.Fragment key={key}>
                                                <tr className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""), (this.state.itemActive === item.id ? "active" : ""))} onClick={()=>{this.activeItem(item.id)}}>
                                                    <td>
                                                        <div className="cell" title={i.updated_by}>{i.updated_by}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={i.updated_at}>{i.updated_at}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={i.revision_status}>{i.revision_status}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={i.approved_by}>{i.approved_by}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={i.approved_at}>{i.approved_at}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={i.rejected_reason}>{i.rejected_reason}</div>
                                                    </td>
                                                </tr>
                                                {this.state.itemActive === item.id && (
                                                    <tr className="el-table-item">
                                                        <td colSpan={6}>
                                                            <HistoryDetail id={item.id} page={this.state.page} itemApprove={this.state.itemApprove} {...this.props}/>
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
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(index);
