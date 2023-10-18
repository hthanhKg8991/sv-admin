import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import queryString from 'query-string';
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import PopupInfoContract from '../Popup/PopupInfoContract';
import moment from 'moment/moment';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            object: props.item,
        };
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.getUrl = this._getUrl.bind(this);
    }

    _btnEdit(){
        this.props.uiAction.createPopup(PopupInfoContract, "Chỉnh Sửa Thông tin", {object: this.props.item, id: this.props.item.id});
        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    _btnDelete(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xoá Thông tin hợp đồng ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_INFO_CONTRACT_DELETE, {id: this.state.object.id});
            }
        });
    }

    _getUrl($uri, params) {
        return $uri + "?"  + queryString.stringify(params);
    }

    componentDidMount(){

    }

    componentWillReceiveProps(newProps) {

        if (newProps.api[ConstantURL.API_URL_POST_ROOM_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_ROOM_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('InfoContractPage');
            }
            this.setState({loading: false});
            this.props.uiAction.hideSmartMessageBox();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_ROOM_DELETE);
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        return  utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }
    render () {
        let { object } = this.state;
        return (
            <div className="relative content-box">
                <div className="row">
                    <div className="col-sm-12 col-xs-12">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            Thông tin chung
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{object.id}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Người đại diện</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{object.representative}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Chức vụ</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{object.position}</div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Ngày cập nhật</div>
                            <div className="col-sm-8 col-xs-8 text-bold">{moment.unix(object.updated_at).format("DD/MM/YYYY HH:mm:ss")}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-xs-12 mt15">
                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnEdit}><span>Chỉnh sửa</span>
                        </button>

                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnDelete}>
                            <span>Xóa</span>
                        </button>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
