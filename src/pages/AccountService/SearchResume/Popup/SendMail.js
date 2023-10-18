import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {getAccountServiceSearchResumeCampaignList,createAccountServiceSearchFilterResumeHistory} from 'api/mix'
import { publish } from "utils/event";

class PopupChangeSendMail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {campaign_id:props.campaign_id},
            object_required: ['campaign_id'],
            object_error: {},
            name_focus: "",
            campaign_list: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
        this.asyncData = this._asyncData.bind(this);
    }

    async _onSave(data, required) {
        const {uiAction,clearCheckSendMail,idKey,check_send_mail} = this.props;
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
                this.setState({ loading: true });
                const res = await createAccountServiceSearchFilterResumeHistory({ ...object, data: this.props.check_send_mail.map(v => ({ seeker_id: v.seeker_info?.id, resume_id: v.id })) });
                if (res) {
                    clearCheckSendMail();
                    uiAction.putToastSuccess(("Thao tác thành công"));
                    uiAction.deletePopup();
                    publish(".refresh", {}, idKey)
                }
                uiAction.hideSmartMessageBox();
                this.setState({ loading: false });
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
        const res = await getAccountServiceSearchResumeCampaignList({ status: Constant.AS_FILTER_RESUME_CAMPAIGN_ACTIVE, per_page: 1000 });
        if (res && Array.isArray(res?.items)) {
            this.setState({campaign_list: res?.items});
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
        const {object, object_required, object_error, campaign_list} = this.state;

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="campaign_id"
                                    label="Chọn campaign"
                                    data={campaign_list}
                                    value={object.campaign_id}
                                    required={object_required.includes("campaign_id")}
                                    error={object_error.campaign_id}
                                    onChange={this.onChange}
                                    key_title={"name"}
                                    key_value={"id"}
                                    readOnly
                                    isShowIconDelete={false}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mt10">
                                <span>Số hồ sơ đã chọn: {this.props.check_send_mail?.length}</span>
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
