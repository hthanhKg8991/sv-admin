import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {createMultipleListContact, getListListContactFull} from "api/emailMarketing";


class PopupChangeSendMail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['list_contact_id'],
            object_error: {},
            name_focus: "",
            list_contact: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
        this.asyncData = this._asyncData.bind(this);
    }

    async _onSave(data, required) {
        const {uiAction,clearCheckSendMail} = this.props;
        this.setState({object_error: {}, name_focus: "", loading: true});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field, loading: false, object_error: check.fields});
            return;
        }
        uiAction.SmartMessageBox({
            title: "Bạn có muốn gửi email cho danh sách ứng viên này?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await createMultipleListContact({...object, data: this.props.check_send_mail.map(v=> ({name:v.seeker_info?.name , email: v.seeker_info?.email}))});
                if (res) {
                    clearCheckSendMail();
                    uiAction.putToastSuccess(("Thao tác thành công"));
                    uiAction.hideSmartMessageBox();
                    uiAction.deletePopup();
                }
            }
        });
        this.setState({loading: false});

    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = {...this.state.object};
        object[name] = value;
        this.setState({object: object});
    }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    async _asyncData() {
        const res = await getListListContactFull({status: Constant.STATUS_ACTIVED});
        if (res) {
            this.setState({list_contact: res});
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        if (this.state.loading){
            return(
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        const {object, object_required, object_error, list_contact} = this.state;

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="list_contact_id"
                                         label="Chọn list"
                                         data={list_contact}
                                         value={object.list_contact_id}
                                         required={object_required.includes("list_contact_id")}
                                         error={object_error.list_contact_id}
                                         onChange={this.onChange}
                                         key_title={"name"}
                                         key_value={"id"}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.onClose}>
                            <span>Đóng</span>
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
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeSendMail);
