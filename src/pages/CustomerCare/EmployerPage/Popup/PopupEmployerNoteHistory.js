import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import config from 'config';
import classnames from 'classnames';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupEmployerNoteHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list:[],
            page:1,
            per_page:5,
            pagination_data:{},
        };
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
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
            employer_id: this.props.employer.id,
            per_page: this.state.per_page,
            page: this.state.page
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_NOTE_LIST, args);
        this.props.uiAction.showLoading();
    }
    _hidePopup(){
        this.props.uiAction.deletePopup();
    }
    _btnDelete(id){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa ghi chú ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_NOTE_DELETE, {id});
                this.props.uiAction.showLoading();
            }
        });
    }
    componentDidMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        this.props.uiAction.hideLoading();
        if (newProps.api[ConstantURL.API_URL_EMPLOYER_NOTE_LIST]){
            let response = newProps.api[ConstantURL.API_URL_EMPLOYER_NOTE_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_EMPLOYER_NOTE_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_EMPLOYER_NOTE_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_EMPLOYER_NOTE_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();

                this.props.asyncDataNote();
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_EMPLOYER_NOTE_DELETE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        return (
            <div className="dialog-popup-body">
                <div className="form-container">
                    <div className="popupContainer">
                        <div className="body-table el-table crm-section">
                            <TableComponent>
                                <TableHeader tableType="TableHeader" width={300}>
                                    Ghi chú
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Thời gian ghi chú
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={200}>
                                    Người tạo
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={100}>
                                    Thao tác
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {this.state.data_list.map((item,key)=> {
                                        let created_at = moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss");
                                        return (
                                            <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                <td>
                                                    <div className="cell" title={item.note}>
                                                        {item.note}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={created_at}>
                                                        {created_at}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={item.created_by}>
                                                        {item.created_by}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell">
                                                        {item.created_by === this.props.user.login_name && (
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-danger" onClick={this.btnDelete.bind(this,item.id)}>Xóa</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
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
        user: state.user,
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupEmployerNoteHistory);
