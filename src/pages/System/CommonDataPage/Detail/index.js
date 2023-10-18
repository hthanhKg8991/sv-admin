import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import classnames from 'classnames';
import PopupCommonData from '../Popup/PopupCommonData';
import config from 'config';
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: props.child
        };
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupCommonData, "Chỉnh Sửa Tham Số", {object: object});
    }
    _btnDelete(object){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_COMMON_DATA_DELETE, {id: object.id});
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupCommonData, "Thêm Tham Số", {object: {type: this.props.type}});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        this.setState({data_list: newProps.child});
        if (newProps.api[ConstantURL.API_URL_POST_COMMON_DATA_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_COMMON_DATA_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('CommonDataPage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_COMMON_DATA_DELETE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {data_list} = this.state;
        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 crm-section">
                            <div className="top-table">
                                <div className="left btnCreateNTD">
                                    <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                        <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                                    </button>
                                </div>
                            </div>
                            <TableComponent>
                                <TableHeader tableType="TableHeader" width={120}>
                                    Tên
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={120}>
                                    Giá trị
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={120}>
                                    Màu nền
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={120}>
                                    Màu chữ
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={120}>
                                    ordering
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={120}>
                                    from
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={120}>
                                    to
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={120}>
                                    Thao tác
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key)=> {
                                        return(
                                            <tr key={key} className={classnames("el-table-row", key % 2 !== 0 ? "tr-background" : "")}>
                                                <td>
                                                    <div className="cell" title={item.name}>{item.name}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={item.value}>{item.value}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={item.background_color} >
                                                        <span style={{margin: '0px 5px 0px 0px',display: 'inline-block', width:'15px', height:'15px', background:item.background_color}}></span>
                                                        {item.background_color}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={item.text_color}>
                                                        <span style={{margin: '0px 5px 0px 0px',display: 'inline-block', width:'15px', height:'15px', background:item.text_color}}></span>
                                                        {item.text_color}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={item.ordering}>{item.ordering}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={item.from}>{item.from}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={item.to}>{item.to}</div>
                                                </td>
                                                <td>
                                                    <div className="cell">
                                                        <div className="text-underline pointer">
                                                            <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
                                                        </div>
                                                        <div className="text-underline pointer">
                                                            <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
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
