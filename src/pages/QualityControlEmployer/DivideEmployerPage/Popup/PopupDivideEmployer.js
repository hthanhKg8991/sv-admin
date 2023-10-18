import React, { Component } from "react";
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import Dropbox from 'components/Common/InputValue/Dropbox';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import TableDivide from "./Table";

class PopupDivideEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {
                acc_out_list: [],
                acc_add_list: [],
                acc_not_out_list: [],
                acc_not_add_list: [],
            },
            tableInfo: {},
            object_required: ['type', 'is_option', 'branch_code', 'room_id', 'source_type'],
            object_error: {},
            name_focus: "",
            staff_list: [],
            room_list: [],
        };
        this.onSave = this._onSave.bind(this);
        this.getRoom = this._getRoom.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeTable = this._onChangeTable.bind(this);
        this.getDetailRoom = this._getDetailRoom.bind(this);
    }

    _onSave(data) {
        this.setState({ object_error: {} });
        this.setState({ name_focus: "" });
        const { tableInfo } = this.state;
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({ name_focus: check.field });
            this.setState({ object_error: check.fields });
            return;
        }
        let object_required = [
            'vip_number',
            'past_vip_admin_not_verified_number', 'past_vip_admin_verified_number', 'past_vip_web_not_verified_number', 'past_vip_web_verified_number',
            'not_vip_admin_not_verified_number', 'not_vip_admin_verified_number', 'not_vip_web_not_verified_number', 'not_vip_web_verified_number'
        ];
        // if (object.source !== Constant.DIVIDE_SIZE && utils.checkOnSaveRequired1InAll(tableInfo, object_required)) {
        //     this.props.uiAction.putToastError("Vui lòng nhập số lượng cần rút");
        //     return;
        // }
        if (object.acc_out_list.length) {
            object.acc_not_out_list = [];
        }
        if (object.acc_add_list.length) {
            object.acc_not_add_list = [];
        }
        this.props.uiAction.showLoading();
        object.tableInfo = tableInfo;
        this.props.apiAction.requestApi(apiFn.fnPost,
            config.apiEmployerDomain,
            ConstantURL.API_URL_POST_TOOL_SHARE_ACCOUNT_CREATE,
            object);
    }

    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        if((name === 'branch_code' && !value) || (name === "room_id" && !value)){
            object.acc_out_list = [];
            object.acc_add_list = [];
            object.acc_not_out_list = [];
            object.acc_not_add_list = [];
        }
        if(name === "room_id" && value){
            this.getDetailRoom(value)
        }
        if(name === "branch_code" && value){
            this.getRoom(value);
        }
        this.setState({object});
    }

    _onChangeTable(value,name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object = Object.assign({}, this.state.tableInfo);
        object[name] = value;
        this.setState({ tableInfo: object });
    }

    _getDetailRoom(id) {
        let args = {
            id,
            include_staff: "true",
        };
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_ROOM_DETAIL, args);
    }

    _getRoom(branch_code) {
        let args = {
            'status': Constant.STATUS_ACTIVED,
            'per_page': 1000,
            branch_code
        };
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiAuthDomain,
            ConstantURL.API_URL_GET_ROOM_LIST,
            args);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_TOOL_SHARE_ACCOUNT_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_TOOL_SHARE_ACCOUNT_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('DivideEmployerPage');
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_TOOL_SHARE_ACCOUNT_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_GET_ROOM_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_ROOM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ room_list: response.data.items || [] });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ROOM_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_ROOM_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_ROOM_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ staff_list: response.data.staff || [] });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ROOM_DETAIL);
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        let { object, object_error, object_required, name_focus, staff_list, room_list, tableInfo } = this.state;
        let divide_type = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_divide_type);
        let divide_source = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_divide_source);
        let divide_option = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_divide_option);
        let branch_list = this.props.branch.branch_list.filter(c => c.channel_code === this.props.branch.currentBranch.channel_code);

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 padding0">
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="source_type" label="Cách chia tài khoản"
                                                 outNumber
                                                 data={divide_source}
                                                 required={object_required.includes('source_type')}
                                                 error={object_error.source_type}
                                                 value={object.source_type}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="type" label="Hình thức chia tài khoản"
                                                 outNumber
                                                 data={divide_type}
                                                 required={object_required.includes('type')}
                                                 error={object_error.type} value={object.type}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="is_option" label="Hình thức rút" outNumber
                                                 data={divide_option}
                                                 required={object_required.includes('is_option')}
                                                 error={object_error.is_option}
                                                 value={object.is_option}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="branch_code" label="Chi nhánh"
                                                 data={branch_list}
                                                 required={object_required.includes('branch_code')}
                                                 key_value="code" key_title="name"
                                                 error={object_error.branch_code}
                                                 value={object.branch_code}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="room_id" label="Chọn phòng" data={room_list}
                                                 required={object_required.includes('room_id')}
                                                 key_value="id" key_title="name"
                                                 error={object_error.room_id} value={object.room_id}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                                {Constant.DIVISION_TYPE_DISCHARGE === parseInt(object.type) && (
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <div>Xả tài khoản là lấy trong giỏ người rút 1 số lượng rồi
                                            chia đều số đó cho
                                            những người nhận.
                                        </div>
                                        <div>Ví dụ: trường hợp hủy tài khoản CSKH</div>
                                        <div>+ Tài khoản CSKH bị xả: A</div>
                                        <div>+ Tài khoản CSKH được nhận: B, C</div>
                                        <div>+ Số lượng tài khoản rút: 10 free</div>
                                        <div>Kết quả</div>
                                        <div>+ Tài khoản A bị rút: 10 free</div>
                                        <div>+ Mỗi tài khoản B, C nhận được là 10:2 = 5 free</div>
                                    </div>
                                )}
                                {Constant.DIVISION_TYPE_DRAW === parseInt(object.type) && (
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <div>Rút tài khoản là lấy từ mỗi giỏ của người rút 1 số
                                            lượng rồi nhân lên cho
                                            từng người nhận.
                                        </div>
                                        <div>Ví dụ: trường hợp tạo tài khoản CSKH mới</div>
                                        <div>+ Tài khoản CSKH bị rút: A</div>
                                        <div>+ Tài khoản CSKH được nhận: B, C</div>
                                        <div>+ Số lượng tài khoản rút: 10 free</div>
                                        <div>Kết quả</div>
                                        <div>+ Tài khoản A bị rút: 10x2=20 free</div>
                                        <div>+ Mỗi tài khoản B, C nhận được là 10 free</div>
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 text-bold">
                                    Tài khoản rút <span className="textRed">(mặc định không chọn là Tất cả CSKH)*</span>
                                </div>
                                <div className="col-sm-6 col-xs-12 text-bold">
                                    Tài khoản nhận <span className="textRed">(mặc định không chọn là chia theo danh sách nhận tài khoản xả)*</span>
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DropboxMulti name="acc_out_list" label="" data={staff_list}
                                                  required={object_required.includes('acc_out_list')}
                                                  key_value="login_name" key_title="login_name"
                                                  error={object_error.acc_out_list}
                                                  value={object.acc_out_list}
                                                  nameFocus={name_focus}
                                                  onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DropboxMulti name="acc_add_list" label="" data={staff_list}
                                                  required={object_required.includes('acc_add_list')}
                                                  key_value="login_name" key_title="login_name"
                                                  error={object_error.acc_add_list}
                                                  value={object.acc_add_list}
                                                  nameFocus={name_focus}
                                                  onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    {!object.acc_out_list.length && (
                                        <DropboxMulti name="acc_not_out_list"
                                                      label="Trừ cá nhân (tài khoản rút)"
                                                      data={staff_list}
                                                      required={object_required.includes(
                                                          'acc_not_out_list')}
                                                      key_value="login_name" key_title="login_name"
                                                      error={object_error.acc_not_out_list}
                                                      value={object.acc_not_out_list}
                                                      nameFocus={name_focus}
                                                      onChange={this.onChange}
                                        />
                                    )}
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    {!object.acc_add_list.length && (
                                        <DropboxMulti name="acc_not_add_list"
                                                      label="Trừ cá nhân (tài khoản nhận)"
                                                      data={staff_list}
                                                      required={object_required.includes(
                                                          'acc_not_add_list')}
                                                      key_value="login_name" key_title="login_name"
                                                      error={object_error.acc_not_add_list}
                                                      value={object.acc_not_add_list}
                                                      nameFocus={name_focus}
                                                      onChange={this.onChange}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* <TableDivide tableInfo={tableInfo} source={object.source_type}
                                         onChange={this.onChangeTable} object_error={object_error}/> */}
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit"
                                className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupDivideEmployer);
