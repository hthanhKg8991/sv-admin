import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import Pagination from "components/Common/Ui/Pagination";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as utils from "utils/utils";

class PopupHistoryReportSeeker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            page: 1,
            per_page: Constant.PER_PAGE_LIMIT,
            pagination_data: {}
        };
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
        this.refreshList = this._refreshList.bind(this);
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
    _refreshList(delay){
        let args = {
            employer_id: this.props.object.id,
            report_type: Constant.EMPLOYER_REPORT_TYPE_SEEKER,
            per_page: this.state.per_page,
            page: this.state.page
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_REPORT, args, delay);
    }
    _hidePopup(){
        this.props.uiAction.deletePopup();
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_REPORT]){
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_REPORT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_REPORT);
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
        let employer_report_abuse = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_report_abuse);
        return (
            <div className="dialog-popup-body">
                <div className="relative form-container">
                    <div className="popupContainer">
                        <div className="body-table el-table crm-section">
                            <TableComponent data={data_list}>
                                <TableHeader tableType="TableHeader" width={200} dataField="cache_seeker" fieldObject={['name','email']}>
                                    Ứng viên
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={400} dataField="reason" content={employer_report_abuse}>
                                    Lý do báo xấu
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150} dataField="updated_at" timeStamp={true}>
                                    Thời gian báo xấu
                                </TableHeader>
                            </TableComponent>
                        </div>
                        <div className="crm-section">
                            <Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={false}/>
                        </div>
                    </div>
                    <div>
                        <hr className="v-divider margin0" />
                        <div className="v-card-action">
                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.hidePopup}>
                                <span>Đóng</span>
                            </button>
                        </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupHistoryReportSeeker);
