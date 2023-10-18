import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import config from 'config';
import classnames from 'classnames';
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import queryString from "query-string";
import {Link} from "react-router-dom";
import SpanCommon from "components/Common/Ui/SpanCommon";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            item: props.item
        };
        this.refreshList = this._refreshList.bind(this);
    }
    _refreshList(delay = 0){
        let args = {
            blacklist_keyword_id: this.props.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_EMPLOYER_BY_BLACKLIST_ID, args, delay);
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_EMPLOYER_BY_BLACKLIST_ID]){
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_EMPLOYER_BY_BLACKLIST_ID];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_EMPLOYER_BY_BLACKLIST_ID);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {data_list, loading} = this.state;
        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 row-content row-title">
                            Nhà tuyển dụng có thông tin chứa từ khóa cấm
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 crm-section">
                            {loading ? (
                                <div className="text-center">
                                    <LoadingSmall />
                                </div>
                            ) : (
                                <TableComponent>
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Nhà tuyển dụng
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader"  width={150}>
                                        Email đăng nhập
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Điện thoại liên hệ
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Ngày đăng ký
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Đăng nhập gần nhất
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Loại TK
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        CSKH
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {data_list.map((item, key)=> {
                                            let status = utils.parseStatus(item.status, item.last_revision_status);
                                            let data = {
                                                name: item.id + ' - ' + item.name,
                                                email: item.email,
                                                phone: item.phone,
                                                created_at: moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
                                                last_logged_in_at: item.last_logged_in_at ? moment.unix(item.last_logged_in_at).format("DD/MM/YYYY HH:mm:ss") : '',
                                                assigned_staff_username: item.assigned_staff_username,
                                            };
                                            return(
                                                <tr key={key} className={classnames("el-table-row", key % 2 !== 0 ? "tr-background" : "")}>
                                                    <td>
                                                        <div className="cell" title={data.name}>
                                                            <Link target={"_blank"} to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                                                action: "detail",
                                                                id: item?.id
                                                                })}`}>
                                                                <span className="text-link">{data.name}</span>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={data.email}>{data.email}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={data.phone}>{data.phone}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={data.created_at}>{data.created_at}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={data.last_logged_in_at}>{data.last_logged_in_at}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">
                                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status} value={status}/>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={data.assigned_staff_username}>{data.assigned_staff_username}</div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
