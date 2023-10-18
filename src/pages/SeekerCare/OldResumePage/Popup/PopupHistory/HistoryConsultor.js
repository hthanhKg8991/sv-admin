import React,{Component} from "react";
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
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class HistoryConsultor extends Component {
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
        let url = ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL_OPTION + 'consultor';
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
        let url = ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL_OPTION + 'consultor';
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

        return (
            <TableComponent allowDragScroll={false} className="mt15">
                <TableHeader tableType="TableHeader" width={180}>
                    Họ và tên
                </TableHeader>
                <TableHeader tableType="TableHeader" width={180}>
                    Tên Công ty/Tổ chức
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Chức vụ
                </TableHeader>
                <TableHeader tableType="TableHeader" width={100}>
                    Số điện thoại
                </TableHeader>
                <TableHeader tableType="TableHeader" width={150}>
                    Email
                </TableHeader>
                <TableBody tableType="TableBody">
                    {data_list.map((item, key)=> {
                        let data_change = {
                            name: item.name,
                            company_name: item.company_name,
                            position: item.position,
                            phone: item.phone,
                            email: item.email,
                        };
                        let old_data = {
                            name: item.old_data.name,
                            company_name: item.old_data.company_name,
                            position: item.old_data.position,
                            phone: item.old_data.phone,
                            email: item.old_data.email,
                        };
                        return(
                            <React.Fragment key={key}>
                                <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(key) ? 'active' : '')} onClick={()=>{this.activeItem(key)}}>
                                    {Object.keys(old_data).map((name, key) => {
                                        let cl = '';
                                        let value = data_change[name];

                                        if(old_data[name] === undefined) cl = 'textBlue';
                                        else if(String(old_data[name]) !== String(data_change[name])) cl = 'textWarning';

                                        if(item.old_data && parseInt(item.old_data.status) === Constant.STATUS_DELETED){
                                            cl = 'textRed lineThrough';
                                            value = old_data[name];
                                        }
                                        return(
                                            <td key={key}>
                                                <div className={classnames("cell", cl)} title={value}>{value}</div>
                                            </td>
                                        )
                                    })}
                                </tr>
                                {String(itemActive) === String(key) && (
                                    <tr className={classnames("el-table-item")} onClick={()=>{this.activeItem(key)}}>
                                        {Object.keys(old_data).map((name, key) => {
                                            return(
                                                <td key={key}>
                                                    <div className="cell" title={old_data[name]}>{old_data[name]}</div>
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
export default connect(mapStateToProps,mapDispatchToProps)(HistoryConsultor);
