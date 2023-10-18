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
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from "moment/moment";

class HistoryDiploma extends Component {
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
        let url = ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL_OPTION + 'diploma';
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
        let url = ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL_OPTION + 'diploma';
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

        let certificate_rate = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_certificate_rate);
        return (
            <TableComponent allowDragScroll={false} className="mt15">
                <TableHeader tableType="TableHeader" width={180}>
                    Bằng cấp
                </TableHeader>
                <TableHeader tableType="TableHeader" width={180}>
                    Trường
                </TableHeader>
                <TableHeader tableType="TableHeader" width={180}>
                    Chuyên ngành
                </TableHeader>
                <TableHeader tableType="TableHeader" width={180}>
                    Thời gian học
                </TableHeader>
                <TableHeader tableType="TableHeader" width={100}>
                    Loại tốt nghiệp
                </TableHeader>
                <TableBody tableType="TableBody">
                    {data_list.map((item, key)=> {
                        let data_change = {
                            title: item.title,
                            school_name: item.school_name,
                            specialized: item.specialized,
                            start_end_date: item.start_date && item.end_date ? `${moment.unix(item.start_date).format("DD/MM/YYYY")} - ${moment.unix(item.end_date).format("DD/MM/YYYY")}` : '',
                            gra_diploma: certificate_rate[item.gra_diploma] ? certificate_rate[item.gra_diploma] : item.gra_diploma
                        };
                        let old_data = {
                            title: item.old_data.title,
                            school_name: item.old_data.school_name,
                            specialized: item.old_data.specialized,
                            start_end_date: item.old_data.start_date && item.old_data.end_date ? `${moment.unix(item.old_data.start_date).format("DD/MM/YYYY")} - ${moment.unix(item.old_data.end_date).format("DD/MM/YYYY")}` : undefined,
                            gra_diploma: certificate_rate[item.old_data.gra_diploma] ? certificate_rate[item.old_data.gra_diploma] : item.old_data.gra_diploma
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
export default connect(mapStateToProps,mapDispatchToProps)(HistoryDiploma);
