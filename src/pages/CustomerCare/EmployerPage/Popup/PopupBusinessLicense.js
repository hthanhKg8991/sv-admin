import React, {Component} from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";
import {publish} from 'utils/event';
import ROLES from "utils/ConstantActionCode";
import CanAction from "components/Common/Ui/CanAction";
import CanRender from "components/Common/Ui/CanRender";
import DropboxMulti from "components/Common/InputValue/DropboxMulti";
import CommonText from "components/Common/Ui/CommonText";

class PopupBusinessLicense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            object: Object.assign({}, props.object),
            object_error: {},
            error: {},
            keyIframe: 0,
        };
        this.hidePopup = this._hidePopup.bind(this);
        this.onUpFile = this._onUpFile.bind(this);
        this.onChangeRivalType = this._onChangeRivalType.bind(this);
        this.onRemoveFile = this._onRemoveFile.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
    }

    _hidePopup() {
        publish(".refresh", {}, 'EmployerDetail');
        this.props.uiAction.deletePopup();
    }

    _onUpFile(event) {
        let files = event.target.files[0];
        const type = files?.name?.split('.').pop();
        if (!["docx", "pdf", "doc"].includes(type)) {
            this.props.uiAction.putToastError("Không hổ trợ định dạng này!");
            return;
        }
        const channel_code = this.props.branch.currentBranch.channel_code;
        let data = new FormData();
        data.append('data', files);
        data.append('name', `${moment().unix()} ${Constant.LICENSE_NAME_BY_CHANNEL[channel_code]}`);
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiCdnDomain, ConstantURL.API_URL_POST_UPLOAD_FILE_LICENSE, {
            up_file: true,
            file: data
        });
        this.inputFile.value = null;
    }

    _onChangeRivalType(value) {
        if (value) {
            this.setState({name_focus: ''}, () => {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_LICENSE_CHANGE_RIVAL_TYPE, {
                    rival_type: value,
                    employer_id: this.state.object.id
                });
            });
        }
    }

    _onRemoveFile() {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa GPKD ?",
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_LICENSE_REMOVE_FILE, {employer_id: this.props.object.id});
                publish(".refresh", {}, 'EmployerDetail');
            }
        });
    }

    _btnApprove() {
        this.setState({name_focus: ''}, () => {
            if (Constant.RIVAL_TYPE_NOT_SELECT.includes(Number(this.state.object.rival_type))) {
                this.setState({name_focus: 'rival_type'});
                return;
            }
            this.props.uiAction.showLoading();
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_LICENSE_APPROVED, {
                employer_id: this.state.object.id,
                file: this.state.object.business_license_info.business_license_file
            });
        });
    }

    _btnEdit() {
        this.setState({name_focus: ''}, () => {
            this.props.uiAction.showLoading();
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_LICENSE_UPLOAD_FILE,
                {
                    file: this.state.object.business_license_info.business_license_file,
                    employer_id: this.state.object.id
                }
            );
        });
    }

    _btnReject() {
        this.setState({name_focus: ''}, () => {
            if (Constant.RIVAL_TYPE_NOT_SELECT.includes(Number(this.state.object.rival_type))) {
                this.setState({name_focus: 'rival_type'});
                return;
            }

            if (!this.state.object.business_license_info.business_license_rejected_reason) {
                this.setState({name_focus: 'reject_reason'});
                return;
            }
            this.props.uiAction.SmartMessageBox({
                title: "Bạn có chắc muốn không duyệt GPKD ?",
                content: "",
                buttons: ['No', 'Yes']
            }, (ButtonPressed) => {
                if (ButtonPressed === "Yes") {
                    this.props.uiAction.showLoading();
                    const params = {
                        employer_id: this.state.object.id,
                        reject_reason: this.state.object.business_license_info.business_license_rejected_reason
                    };
                    this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_EMPLOYER_LICENSE_REJECT,
                        params
                    );
                }
            });
        })
    }

    _renderActionForRole() {
        return this.props.user.isRole([Constant.DIVISION_TYPE_customer_care_member, Constant.DIVISION_TYPE_customer_care_leader]) ? this._renderCustomerBox() : this._renderRootBox();
    }

    _renderCustomerBox() {
        let {object} = this.state;
        //chưa có giấy phép kinh doanh thì được quyền upload
        //đã duyệt hoặc từ chối chì chỉ hiển thị thông tin
        return (
            <>
                <div className="row">
                    <div className="col-sm-12 col-xs-12 mb15 text-right">
                        {object?.business_license_info.business_license_file_url ?
                            <p>Nếu không thể xem trước, vui lòng
                                <a target="_blank" rel="noopener noreferrer" href={object?.business_license_info.business_license_file_url || "#"}
                                   download> tải về tại đây.</a>
                            </p>
                            :
                            <p>NTD chưa upload GPDK</p>
                        }
                    </div>
                </div>
                {(!object.business_license_info.business_license_status ||
                    parseInt(object.business_license_info.business_license_status) === Constant.BUSINESS_LICENSE_STATUS_NEW) && (
                    <>
                        <CanRender actionCode={ROLES.customer_care_employer_business_license}>
                            <div className="col-sm-6 col-xs-12 mb15 mt15">
                                <span className="text-primary text-underline pointer text-bold" onClick={() => {
                                    this.inputFile.click()
                                }}>Chọn file</span>
                                <input type="file" name="file" className="hidden" ref={input => this.inputFile = input}
                                       onChange={this.onUpFile}/>
                                <span className="ml10 text-danger text-underline pointer text-bold"
                                      onClick={this.onRemoveFile}>Xóa</span>
                            </div>
                        </CanRender>
                        <div className="col-sm-6 col-xs-12 mb15 text-right">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={() => {
                                        this.btnEdit()
                                    }}>
                                <span>Cập nhật</span>
                            </button>
                        </div>

                    </>
                )}
            </>
        );
    }

    _renderRootBox() {
        let {object, object_error, name_focus} = this.state;
        let employer_rival_type = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_rival_type);
        let employer_business_license_rejected_reason = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_business_license_rejected_reason);

        return (
            <>
                <div className="row">
                    <div className="col-sm-2 col-xs-12 mb15">
                        <span className="text-primary text-underline pointer text-bold" onClick={() => {
                            this.inputFile.click()
                        }}>Chọn file</span>
                        <input type="file" name="file" className="hidden" ref={input => this.inputFile = input}
                               onChange={this.onUpFile}/>
                        <span className="ml10 text-danger text-underline pointer text-bold"
                              onClick={this.onRemoveFile}>Xóa</span>
                    </div>
                    <div className="col-sm-10 col-xs-10 mb15 text-right">
                        {object?.business_license_info.business_license_file_url ?
                            <p>Nếu không thể xem trước, vui lòng
                                <a target="_blank" rel="noopener noreferrer" href={object?.business_license_info.business_license_file_url || "#"}
                                   download> tải về tại đây.</a>
                            </p>
                            :
                            <p>NTD chưa upload GPDK</p>
                        }
                    </div>
                </div>
                <div className="row">
                    {[Constant.STATUS_ACTIVED, Constant.STATUS_DISABLED, Constant.STATUS_INACTIVED].includes(parseInt(object.business_license_info.business_license_status)) && (
                        <div className="col-sm-offset-2 col-sm-10 col-xs-10 mb15 mt30">
                            <div className="col-sm-5 col-xs-12 mb15 mt15">
                                <CanAction actionCode={ROLES.customer_care_employer_business_license}>
                                    <Dropbox name="rival_type"
                                             label="Loại đối thủ"
                                             data={employer_rival_type}
                                             required={true}
                                             value={object.rival_type}
                                             error={object_error.rival_type}
                                             nameFocus={name_focus}
                                             onChange={this.onChangeRivalType}/>
                                </CanAction>
                            </div>
                            {object?.business_license_info?.business_license_status !== Constant.STATUS_DISABLED && (
                                <div className="col-sm-7 col-xs-12 mb15 mt15">
                                    <CanRender actionCode={ROLES.customer_care_employer_business_license}>
                                        <DropboxMulti name="reject_reason"
                                                      label="Lý do không duyệt"
                                                      data={employer_business_license_rejected_reason}
                                                      required={true}
                                                      nameFocus={name_focus}
                                                      value={Array.isArray(object.business_license_info.business_license_rejected_reason) ? object.business_license_info.business_license_rejected_reason.map(r => Number(r)) : []}
                                                      error={object_error.reject_reason}
                                                      onChange={(value) => {
                                                          object.business_license_info.business_license_rejected_reason = value;
                                                      }}
                                        />
                                    </CanRender>
                                </div>)}
                        </div>
                    )}
                </div>
                <div className="row">
                    <div className="col-sm-12 col-xs-12 mb15 text-right">
                        {parseInt(object.business_license_info.business_license_status) === Constant.BUSINESS_LICENSE_STATUS_NEW && (
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={() => {
                                        this.btnEdit()
                                    }}>
                                <span>Cập nhật</span>
                            </button>
                        )}
                        {[Constant.STATUS_ACTIVED, Constant.STATUS_DISABLED, Constant.STATUS_INACTIVED].includes(parseInt(object.business_license_info.business_license_status)) && (
                            <CanAction actionCode={ROLES.customer_care_employer_approval_license}>
                                {object.business_license_info.business_license_status !== Constant.STATUS_ACTIVED &&
                                <button type="button"
                                        className="el-button el-button-success el-button-small"
                                        onClick={() => {
                                            this.btnApprove()
                                        }}>
                                    <span>Duyệt</span>
                                </button>
                                }
                                {object.business_license_info.business_license_status !== Constant.STATUS_DISABLED &&
                                <button type="button"
                                        className="el-button el-button-bricky el-button-small"
                                        onClick={() => {
                                            this.btnReject()
                                        }}>
                                    <span>Không duyệt</span>
                                </button>
                                }
                            </CanAction>
                        )}
                    </div>
                </div>
            </>
        );
    }

    componentDidMount() {
        this.setState({keyIframe: this.state.keyIframe + 1})
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_UPLOAD_FILE_LICENSE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_UPLOAD_FILE_LICENSE];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = Object.assign({}, this.state.object);
                object.business_license_info.business_license_file = response.data.path_file;
                object.business_license_info.business_license_file_url = response.data.url;
                object.business_license_info.business_license_status = Constant.BUSINESS_LICENSE_STATUS_NEW;
                this.setState({object: object});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_UPLOAD_FILE_LICENSE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LICENSE_CHANGE_RIVAL_TYPE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LICENSE_CHANGE_RIVAL_TYPE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('EmployerGeneralInf');
                let object = Object.assign({}, this.state.object);
                object.rival_type = response.info?.args?.rival_type;
                this.setState({object: object});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_LICENSE_CHANGE_RIVAL_TYPE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LICENSE_UPLOAD_FILE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LICENSE_UPLOAD_FILE];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = Object.assign({}, this.state.object);
                let business_license_info = {...object.business_license_info};
                business_license_info.business_license_status = response.data.business_license_status;
                business_license_info.business_license_rejected_reason = null;
                business_license_info.business_license_upload_at = response.data.business_license_upload_at;
                this.setState({object: {...object, business_license_info: business_license_info}});
            }
            this.props.uiAction.refreshList('EmployerGeneralInf');
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_LICENSE_UPLOAD_FILE);
        }

        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LICENSE_APPROVED]) {
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LICENSE_APPROVED];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                // let object = Object.assign({},this.state.object);
                // let business_license_info = {...object.business_license_info};
                // business_license_info.business_license_upload_at = response.data.business_license_upload_at;
                // business_license_info.business_license_rejected_reason = null;
                // business_license_info.business_license_status = response.data.business_license_status;
                // this.setState({object: {...object, business_license_info : business_license_info}});
                this._hidePopup();
            }
            this.props.uiAction.refreshList('EmployerGeneralInf');
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_LICENSE_APPROVED);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LICENSE_REMOVE_FILE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LICENSE_REMOVE_FILE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                let object = Object.assign({}, this.state.object);
                let business_license_info = {...object.business_license_info};
                business_license_info.business_license_file = null;
                business_license_info.business_license_status = 4;
                business_license_info.business_license_upload_at = response.data.business_license_upload_at;
                this.setState({object: {...object, business_license_info: business_license_info}});
            }
            this.props.uiAction.refreshList('EmployerGeneralInf');
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_LICENSE_REMOVE_FILE);
        }
        if (newProps.api[ConstantURL.API_URL_EMPLOYER_LICENSE_REJECT]) {
            let response = newProps.api[ConstantURL.API_URL_EMPLOYER_LICENSE_REJECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                // let object = Object.assign({},this.state.object);
                // let business_license_info = {...object.business_license_info};
                // business_license_info.business_license_status = response.data.business_license_status;
                // business_license_info.business_license_rejected_reason = response.data.business_license_rejected_reason;
                // business_license_info.business_license_upload_at = response.data.business_license_upload_at;
                // this.setState({object: {...object, business_license_info : business_license_info}});
                this._hidePopup();
            }
            this.props.uiAction.refreshList('EmployerGeneralInf');
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_EMPLOYER_LICENSE_REJECT);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) || JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        let {object, loading} = this.state;
        let license_extension = "";
        if (object.business_license_info.business_license_file) {
            license_extension = object.business_license_info.business_license_file.split(".").pop();
        }
        let business_license_upload_at = object.business_license_info.business_license_upload_at ? moment.unix(object.business_license_info.business_license_upload_at).format("DD/MM/YYYY HH:mm:ss") : null;

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="row padding10">
                        <div className="col-sm-12 col-xs-12 mb15 padding0">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                    Thông tin chung
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2 row-content">Tên NTD</div>
                                <div className="col-sm-9 row-content text-bold padding0 word-break">
                                    {object.name}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2 row-content">Địa chỉ</div>
                                <div className="col-sm-9 row-content text-bold padding0 word-break">
                                    {object.address || "Chưa cập nhật"}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2 row-content">Website</div>
                                <div className="col-sm-9 row-content text-bold padding0 word-break">
                                    {object?.website || "Chưa cập nhật"}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2 row-content">Mô tả công ty</div>
                                <div className="col-sm-9 row-content text-bold padding0 word-break">
                                    {object?.description || "Chưa cập nhật"}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 mb15 padding0">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                    Thông tin liên hệ
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2 col-xs-4 row-content">Người liên hệ</div>
                                <div className="col-sm-9 col-xs-8 row-content text-bold padding0 word-break">
                                    {object?.contact_info?.contact_name}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2 col-xs-4 row-content">Email liên hệ</div>
                                <div className="col-sm-9 col-xs-8 row-content text-bold padding0 word-break">
                                    {object?.contact_info?.contact_email}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2 col-xs-4 row-content">Điện thoại</div>
                                <div className="col-sm-9 col-xs-8 row-content text-bold padding0 word-break">
                                    {object?.contact_info?.contact_phone}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-2 col-xs-4 row-content">Địa chỉ liên hệ</div>
                                <div className="col-sm-8 col-xs-8 row-content text-bold padding0 word-break">
                                    {object?.contact_info?.contact_address}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 mb15 padding0">
                            <div className="row">
                                <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                    GPKD của nhà tuyển dụng: {object?.email}
                                </div>
                                <div className="col-sm-2 col-xs-4 row-content">Trạng thái</div>
                                <div className="col-sm-10 col-xs-8 row-content text-bold padding0 word-break">
                                    {utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_business_license_status, parseInt(object.business_license_info.business_license_status))} &nbsp;
                                </div>
                                {_.includes([Constant.STATUS_DISABLED], object.business_license_info.business_license_status) && (
                                    <div>
                                        <div className="col-sm-2 col-xs-4 row-content">Lý do không duyệt</div>
                                        <div className="col-sm-9 col-xs-8 row-content text-bold padding0 word-break">
                                            <ul className="ml--25">
                                                {Array.isArray(object.business_license_info.business_license_rejected_reason) && object.business_license_info.business_license_rejected_reason.map((c, idx) => (
                                                    <li key={idx.toString()}><CommonText
                                                        idKey={Constant.COMMON_DATA_KEY_employer_business_license_rejected_reason}
                                                        value={Number(c)} notStyle/><br/></li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                <div className="col-sm-2 col-xs-4 row-content">Ngày cập nhật</div>
                                <div className="col-sm-10 col-xs-8 row-content text-bold padding0 word-break">
                                    {business_license_upload_at}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 padding0">
                            {loading ? (
                                    <div className="text-center">
                                        <LoadingSmall/>
                                    </div>
                                ) :
                                <>
                                    {object?.business_license_info?.business_license_file && (
                                        <>
                                            {String(license_extension) === Constant.EXTENSION_PDF &&
                                            <div className="pg-viewer-wrapper mb10">
                                                <iframe
                                                    title="pdf"
                                                    key={this.state.keyIframe}
                                                    src={object?.business_license_info?.business_license_file_url}
                                                    style={{width: "100%", height: "500px"}} frameBorder="0"/>
                                            </div>}
                                        </>
                                    )}
                                    {!object.business_license_info.business_license_file && (
                                        <img style={{width: "100%", height: "200px"}}
                                             alt="img"
                                             src="/assets/img/gpkd_default.png"/>
                                    )}
                                </>
                            }
                        </div>
                        {this._renderActionForRole()}
                    </div>
                </div>
                <div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.hidePopup}>
                            <span>Đóng</span>
                        </button>
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
        user: state.user,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupBusinessLicense);
