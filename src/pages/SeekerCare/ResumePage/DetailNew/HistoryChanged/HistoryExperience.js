import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from "moment/moment";

class HistoryExperience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            loading: false,
        };
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }
    _refreshList(){
        let url = ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL_OPTION + 'experience';
        this.setState({itemActive: -1});
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, url, {resume_revision_id: this.props.resume_revision_id});
        });
    }
    _activeItem(key){
        let itemActive = this.state.itemActive;
        itemActive = String(itemActive) !== String(key) ? key : -1;
        this.setState({itemActive: itemActive});
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        let url = ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL_OPTION + 'experience';
        if (newProps.api[url]){
            let response = newProps.api[url];
            if (response.code === Constant.CODE_SUCCESS) {
                if(response.data.json_content_change){
                    this.setState({data_list: response.data.json_content_change});
                }
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(url);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        if (this.state.loading){
            return(
                <div className="text-center">
                    <LoadingSmall />
                </div>
            )
        }
        let {data_list, itemActive} = this.state;

        let currencyList = utils.convertArrayToObject(this.props.sys.currency.items, 'id');
        return (
            <TableComponent allowDragScroll={false} className="mt15">
                <TableHeader tableType="TableHeader" width={150}>
                    Tên Công ty/Tổ chức
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Chức danh
                </TableHeader>
                <TableHeader tableType="TableHeader" width={100}>
                    Mức lương
                </TableHeader>
                <TableHeader tableType="TableHeader" width={100}>
                    Tiền tệ
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Thời gian
                </TableHeader>
                <TableHeader tableType="TableHeader" width={200}>
                    Mô tả công việc
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Thành tích đạt được
                </TableHeader>
                <TableBody tableType="TableBody">
                    {data_list.map((item, key)=> {
                        let startEndDate;
                        if (item?.start_date) {
                            startEndDate = `${moment.unix(item?.start_date).format("MM/YYYY")} - 
                            ${item?.is_current_work === 1 ? 
                                'Hiện tại' : 
                                moment.unix(item?.end_date).format("MM/YYYY")}`;
                        } else {
                            // Sai format
                            startEndDate = `${item?.start_text || ""} - ${item?.end_text || ""}`;
                        }

                        let startEndDateOld;
                        if (item?.old_data?.start_date) {
                            startEndDateOld = `${moment.unix(item?.old_data?.start_date).format("MM/YYYY")} - 
                            ${item?.old_data?.is_current_work === 1 ? 
                                'Hiện tại' : 
                                moment.unix(item?.old_data?.end_date).format("MM/YYYY")}`;
                        } else {
                            // Sai format
                            startEndDateOld = `${item?.old_data?.start_text || ""} - ${item?.old_data?.end_text || ""}`;
                        }

                        let data_change = {
                            company_name: item?.company_name,
                            position: item?.position,
                            salary: item?.salary > 0 ? utils.formatNumber(item?.salary, 0, ".", "") : undefined,
                            salary_unit: currencyList[item?.salary_unit] ? currencyList[item?.salary_unit].name : item?.salary_unit,
                            start_end_date: startEndDate,
                            description: item?.description_html,
                            achieved: item?.achieved_html
                        };
                        let old_data = {
                            company_name: item?.old_data?.company_name,
                            position: item?.old_data?.position,
                            salary: item?.old_data?.salary > 0 ? utils.formatNumber(item?.old_data?.salary, 0, ".", "") : undefined,
                            salary_unit: currencyList[item?.old_data?.salary_unit] ? currencyList[item?.old_data?.salary_unit].name : item?.old_data?.salary_unit,
                            start_end_date: startEndDateOld,
                            description: item?.old_data?.description_html,
                            achieved: item?.old_data?.achieved_html
                        };
                        return(
                            <React.Fragment key={key}>
                                <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(key) ? 'active' : '')} onClick={()=>{this.activeItem(key)}}>
                                    {Object.keys(old_data).map((name, key) => {
                                        let cl = '';
                                        let value = data_change[name];

                                        if(old_data[name] === undefined) cl = 'textBlue';
                                        else if(String(old_data[name]) !== String(data_change[name])) cl = 'textWarning';

                                        if(item?.old_data && parseInt(item?.old_data?.status) === Constant.STATUS_DELETED){
                                            cl = 'textRed lineThrough';
                                            value = old_data[name];
                                        }
                                        if(item?.status && parseInt(item?.status) === Constant.STATUS_DELETED){
                                            cl += ' lineThrough';
                                        }
                                        return(
                                            <td key={key}>
                                                <div className={classnames("cell", cl)} title={value}>
                                                    <div dangerouslySetInnerHTML={{__html: value}} />
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                                {String(itemActive) === String(key) && (
                                    <tr className={classnames("el-table-item")} onClick={()=>{this.activeItem(key)}}>
                                        {Object.keys(old_data).map((name, key) => {
                                            return(
                                                <td key={key}>
                                                    <div className="cell" title={old_data[name]}>
                                                        <div dangerouslySetInnerHTML={{__html: old_data[name]}} />
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}
                </TableBody>
            </TableComponent>
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
export default connect(mapStateToProps,mapDispatchToProps)(HistoryExperience);
