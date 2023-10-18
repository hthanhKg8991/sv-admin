import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupRoom from "../Popup/PopupRoom";
import PopupChangeRoomForTeam from "../Popup/PopupChangeRoomForTeam";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import config from 'config';
import classnames from 'classnames';
import queryString from 'query-string';
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import _ from "lodash";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataList: [],
            parentItem: props.item,
            page: Constant.PAGE_DEFAULT,
            per_page:Constant.UN_LIMIT_PER_PAGE
        };
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.getUrl = this._getUrl.bind(this);
        this.btnChangeRoom = this._btnChangeRoom.bind(this);
    }

    _btnEdit(){
        this.props.uiAction.createPopup(PopupRoom, "Chỉnh Sửa Phòng", {object: this.props.item, id: this.props.item.id});
        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    _refreshList(delay = 0){
        let args = {
            room_id: this.state.parentItem.id,
            page: this.state.page,
            per_page: this.state.per_page
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_TEAM_LIST, args, delay);
    }

    _btnChangeRoom(data){
        let title = "Chuyển Phòng";
        this.props.uiAction.createPopup(PopupChangeRoomForTeam, title, {team: data});
    }

    _btnDelete(){
        let {parentItem} = this.state;
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xoá Phòng ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_ROOM_DELETE, {id: parentItem.id});
            }
        });
    }

    _getUrl($uri, params) {
        return $uri + "?"  + queryString.stringify(params);
    }

    componentDidMount(){
        this.refreshList();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_TEAM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_TEAM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({dataList: _.get(response, 'data.items', [])});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_TEAM_LIST);
        }

        if (newProps.api[ConstantURL.API_URL_POST_ROOM_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_ROOM_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('RoomPage');
            }
            this.props.uiAction.hideLoading();
            this.props.uiAction.hideSmartMessageBox();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_ROOM_DELETE);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }
    render () {
        let {dataList, loading} = this.state;
        let branch_list = utils.convertArrayToObject(this.props.branch.branch_list, 'code');
        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 crm-section">
                            <div className="top-table">
                                <div className="left">
                                    <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnEdit}>
                                        <span>Chỉnh sửa</span>
                                    </button>
                                    <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnDelete}>
                                        <span>Xoá</span>
                                    </button>
                                </div>
                            </div>
                            {loading ? (
                                <div className="text-center">
                                    <LoadingSmall />
                                </div>
                            ) : (
                                    <TableComponent DragScroll={false}>
                                    <TableHeader tableType="TableHeader" width={50}>
                                        Mã
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Chi nhánh
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader"  width={400}>
                                        Tên nhóm
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader"  width={400}>
                                        Thao tác
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {dataList.map((item, key)=> {
                                            let queryString = {
                                                item_active: item.id,
                                            };
                                            let branch_code = branch_list[item.branch_code] ? branch_list[item.branch_code].name : item.branch_code;
                                            return(
                                                <tr key={key} className={classnames("el-table-row", key % 2 !== 0 ? "tr-background" : "")}>
                                                    <td>
                                                        <div className="cell" >{item.id}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">{branch_code}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={item.name}>
                                                            <a target="_blank" rel="noopener noreferrer" href={this.getUrl(Constant.BASE_URL_QC_CUSTOMER_SERVICE, queryString)}>
                                                                <span>{item.name}</span>
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-danger" onClick={()=>{this.btnChangeRoom(item)}}>Chuyển Phòng</span>
                                                            </div>
                                                        </div>
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
        sys: state.sys,
        refresh: state.refresh,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
