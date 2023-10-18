import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import PopupPermission from '../Popup/PopupPermission';
import config from 'config';
import queryString from 'query-string';
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";

class index  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},props.object)
        };
        this.btnActive = this._btnActive.bind(this);
        this.btnBlock = this._btnBlock.bind(this);
        this.btnPermission = this._btnPermission.bind(this);
        this.showPopup = this._showPopup.bind(this);
        this.openListAccount = this._openListAccount.bind(this);
    }
    _openListAccount() {
        const {object, history} = this.props;
        history.push(`${Constant.BASE_URL_AUTH_STAFF}?${queryString.stringify({division_code: object.code})}`);
    }
    _btnActive(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn kích hoạt bộ phận ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                let id = this.state.object.id;
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_DIVISION_UPDATE + id, {
                    id: id,
                    status: Constant.DIVISION_STATUS_ACTIVED
                });
            }
        });
    }
    _btnBlock(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn tạm khóa bộ phận ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                let id = this.state.object.id;
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_DIVISION_BLOCK, {
                    id: id,
                });
            }
        });
    }
    _btnPermission(){
        this.props.uiAction.createPopup(PopupPermission, "Phân Quyền Chức Năng",{object: this.state.object});
    }
    _showPopup(){
        let query = queryString.parse(window.location.search);
        if(query.action_active){
            switch (query.action_active){
                case 'edit':
                    this.btnEdit();
                    break;
                case 'permission':
                    this.btnPermission();
                    break;
                default:
                    break;
            }
        }
    }
    componentWillMount(){
        this.showPopup();
    }

    componentWillReceiveProps(newProps) {
        let id = newProps.object ? newProps.object.id : '';
        if (newProps.api[`${ConstantURL.API_URL_POST_DIVISION_UPDATE}${id}`]){
            let response = newProps.api[`${ConstantURL.API_URL_POST_DIVISION_UPDATE}${id}`];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('DivisionPage');
                publish(".refresh", {}, "DivisionList");
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(`${ConstantURL.API_URL_POST_DIVISION_UPDATE}${id}`);
        }

        if (newProps.api[ConstantURL.API_URL_POST_DIVISION_BLOCK]){
            let response = newProps.api[ConstantURL.API_URL_POST_DIVISION_BLOCK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('DivisionPage');
                publish(".refresh", {}, "DivisionList");
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DIVISION_BLOCK);
        }
       
        this.setState({object: newProps.object});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {object} = this.state;
        let status = parseInt(object.status);
        let keyPress = [];
        if (status) {
            keyPress = ["1","2","3"];
            if ([Constant.DIVISION_STATUS_ACTIVED].includes(status)) {
                keyPress.push("5");
                keyPress.push("6");
            }
            if ([Constant.DIVISION_STATUS_LOCKED].includes(status)) {
                keyPress.push("4");
            }
        }
        return (
            <div className="content-box">
                <div className="row">
                    <div className="col-sm-12 col-xs-12 mt15">
                        {/*{keyPress.includes("1") && (*/}
                        {/*    <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnEdit}>*/}
                        {/*        <span>Chỉnh sửa</span>*/}
                        {/*    </button>*/}
                        {/*)}*/}
                        {keyPress.includes("2") && (
                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnPermission}>
                                <span>Phân quyền chức năng</span>
                            </button>
                        )}
                        {/*{keyPress.includes("3") && (*/}
                            {/*<button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnCopy}>*/}
                                {/*<span>Sao chép</span>*/}
                            {/*</button>*/}
                        {/*)}*/}
                        {keyPress.includes("4") && (
                            <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnActive}>
                                <span>Kích hoạt </span>
                            </button>
                        )}
                        {keyPress.includes("5") && (
                            <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnBlock}>
                                <span>Tạm khóa </span>
                            </button>
                        )}
                        {keyPress.includes("6") && (
                            <button type="button" className="el-button el-button-info el-button-small" onClick={this.openListAccount}>
                                <span>Danh sách tài khoản</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        refresh: state.refresh,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
