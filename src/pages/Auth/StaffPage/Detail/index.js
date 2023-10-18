import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PopupStaff from '../Popup/PopupStaff';
import moment from 'moment-timezone';
import config from 'config';
import queryString from 'query-string';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import CanRender  from "components/Common/Ui/CanRender"
import * as apiAction from "actions/apiAction";
import ROLES from "utils/ConstantActionCode";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import RevertPassword from "pages/Auth/StaffPage/Popup/RevertPassword";
import {updateAllowReceiveEmployer} from 'api/auth'

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class index  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},props.object),
            data_group_list: [],
            loading: true
        };
        this.getDataGroup = this._getDataGroup.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnRevertPass = this._btnRevertPass.bind(this);
        this.btnActive = this._btnActive.bind(this);
        this.btnBlock = this._btnBlock.bind(this);
        this.btnOffReceiveCus = this._btnOffReceiveCus.bind(this);
        this.showPopup = this._showPopup.bind(this);
    }
    _getDataGroup(){
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST, {execute: true});
    }

    _btnEdit(){
        this.props.uiAction.createPopup(PopupStaff, "Chỉnh Sửa Người dùng",{
            object: this.state.object,
            data_group_list:this.state.data_group_list
        });
        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    _btnRevertPass(){
        this.props.uiAction.createPopup(RevertPassword, "Khôi phục mật khẩu",{
            object: this.state.object
        });
    }

    _btnActive(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn kích hoạt người dùng ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_STAFF_ACTIVE, {
                    staff_id: this.state.object.id,
                });
            }
        });
    }

    _btnBlock(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn tạm khóa người dùng ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_STAFF_LOCK, {
                    staff_id: this.state.object.id,
                });
            }
        });
    }

    _btnOffReceiveCus(){
        const {object} = this.state
        const mes = object?.allow_receive_employer === Constant.NOT_ALLOW_RECEIVE_EMPLOYER
            ? "Bạn có chắc muốn tắt chia giỏ người dùng ?"
            : "Bạn có chắc muốn mở chia giỏ người dùng ?"
        this.props.uiAction.SmartMessageBox({
            title: mes,
            content: "",
            buttons: ['No','Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                const res = await updateAllowReceiveEmployer({
                    allow_receive_employer: object?.allow_receive_employer === Constant.NOT_ALLOW_RECEIVE_EMPLOYER
                        ? Constant.ALLOW_RECEIVE_EMPLOYER
                        : Constant.NOT_ALLOW_RECEIVE_EMPLOYER,
                    staff_id: this.state.object.id
                })
                this.props.uiAction.hideLoading();
                this.props.uiAction.refreshList('StaffPage');
                this.props.uiAction.hideSmartMessageBox()
            }
        });
    }

    _showPopup(){
        let query = queryString.parse(window.location.search);
        if(query.action_active){
            switch (query.action_active){
                case 'edit':
                    this.btnEdit();
                    break;
                default:
                    break;
            }
        }
    }
    componentDidMount(){
        this.getDataGroup();
        this.showPopup();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_group_list: response.data});
            }
            this.setState({loading: false});
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_ACTIVE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_ACTIVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('StaffPage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_STAFF_ACTIVE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_LOCK]) {
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_LOCK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('StaffPage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_STAFF_LOCK);
        }
        this.setState({object: newProps.object});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div className="row content-box">
                    <div className="relative card-body text-center">
                        <LoadingSmall />
                    </div>
                </div>
            )
        }
        let {object, data_group_list} = this.state;

        let language_code = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_language_code);
        let staffModeList = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_staff_mode);
        let staffLevelList = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_staff_level);
        let employerCareList = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_care_type);
        let status = parseInt(object.status);

        let keyPress = ["1", "2"];
        if (status) {
            if ([Constant.DIVISION_STATUS_ACTIVED].includes(status)) {
                keyPress.push("4");
            }
            if ([Constant.DIVISION_STATUS_LOCKED].includes(status)) {
                keyPress.push("3");
            }
        }
        if(object?.division_code){
            const allowShowButton = [Constant.DIVISION_TYPE_customer_care_leader, Constant.DIVISION_TYPE_customer_care_member]
            if(allowShowButton.includes(object?.division_code)){
                keyPress.push("5");
            }
        }
        let group = data_group_list.filter(c => c.code === object.data_group_code);
        let group_name = object.data_group_code;
        if (group.length){
            group_name = group[0].name;
        }
        return (
            <div className="content-box">
                <div className="row">
                    <div className="col-sm-4 col-xs-4 col-xs-12">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">Tài Khoản</div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Nhóm dữ liệu</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <span>{group_name}</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Cấp bậc</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <span>{staffLevelList[object.customer_care_level]}&nbsp;</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Phòng</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <span>{object.room_name}</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Nhóm chăm sóc</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <span>{employerCareList[object.employer_care_type]}&nbsp;</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Ngôn ngữ</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <span>{language_code[object.language_code]}&nbsp;</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 col-xs-4">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">Liên hệ</div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Điện thoại</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <span>{object.phone}</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Line tổng đài</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <span>{object.xlite_id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 col-xs-4">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">Khác</div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Mã nhân viên</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <span>{object?.code}</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Chế độ</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <span><span>{staffModeList[object.mode]}&nbsp;</span></span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Thời gian làm việc</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <span>{moment.unix(object.start_working_date).format("DD/MM/YYYY")} - {object.end_working_date ? moment.unix(object.end_working_date).format("DD/MM/YYYY") : "nay"}</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ghi chú</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <span>{object.note}</span>
                            </div>
                        </div>
                        {
                            keyPress.includes("5") && 
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Trạng thái chia giỏ</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    <span>
                                        {
                                            object?.allow_receive_employer === Constant.NOT_ALLOW_RECEIVE_EMPLOYER
                                            ? "Tạm khóa"
                                            : "Hoạt động"
                                        }
                                    </span>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="col-sm-12 col-xs-12 mt15">
                        {keyPress.includes("1") && (
                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnEdit}>
                                <span>Chỉnh sửa</span>
                            </button>
                        )}
                        {keyPress.includes("2") && (
                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnRevertPass}>
                                <span>Khôi phục mật khẩu</span>
                            </button>
                        )}
                        {keyPress.includes("3") && (
                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnActive}>
                                <span>Kích hoạt</span>
                            </button>
                        )}
                        {keyPress.includes("4") && (
                            <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnBlock}>
                                <span>Tạm khóa</span>
                            </button>
                        )}
                        {keyPress.includes("5") && (
                            <CanRender actionCode={ROLES.auth_staff_update_allow_receive_employer}>
                                <button type="button" className={
                                    `el-button ${object?.allow_receive_employer === Constant.NOT_ALLOW_RECEIVE_EMPLOYER ? 'el-button-primary' : 'el-button-bricky'} el-button-small`
                                } onClick={this.btnOffReceiveCus}>
                                    <span>
                                        {
                                            object?.allow_receive_employer === Constant.NOT_ALLOW_RECEIVE_EMPLOYER 
                                            ? "Bật chia giỏ" 
                                            : "Tắt chia giỏ"
                                        }
                                    </span>
                                </button>
                            </CanRender>
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
