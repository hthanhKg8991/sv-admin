import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, deletePopup, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {createCampaign, sendEmailMarketingCampaign, toggleCampaign, updateCampaign} from "api/emailMarketing";
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.object,
            loading: false,
            submitSendMail: null,
            initialForm: {
                "name": "name",
                "campaign_group_id": "campaign_group_id",
                "list_contact_id": "list_contact_id",
                "from_name": "from_name",
                "from_email": "from_email",
                "utm": "utm",
                "attached_file_url": "attached_file_url",
                "content": "content",
                "hour_send": "hour_send",
                "date_send": "date_send",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.onSend = this._onSend.bind(this);
        this.onToggle = this._onToggle.bind(this);
    }

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
        return true;
    }
    async _onSend(data, type) {
        const {actions,idKey} = this.props;
        const {item} = this.state;
        let msg;
        let res;
        if (type === 'mail'){
            res = await sendEmailMarketingCampaign({...data,campaign_detail_type: Constant.TYPE_SEND_EMAIL_MARKETING_CAMPAIGN, id: item.id});
            msg = "Gửi mail thành công";
        }else {
            res = await sendEmailMarketingCampaign({...data,campaign_detail_type: Constant.TYPE_SEND_EMAIL_MARKETING_CAMPAIGN_TEST,id: item.id});
            msg = "Gửi mail test thành công";
        }
        if (res){
            actions.putToastSuccess(msg);
            actions.deletePopup();
            publish(".refresh", {}, idKey)
        }
        this.setState({submitSendMail: null, loading: false});
    }
    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        const {actions, object, idKey, type} = this.props;
        const {submitSendMail} = this.state;
        if (type === Constant.EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_MARKETING){
            // hour - 86399 === 1 ngày
            const toTimestamp = (strDate) => {
                const dt = Date.parse(strDate);
                return dt / 1000;
            }
            const d = moment.unix(data.date_send).format("MM/DD/YYYY");
            const h = `${Number(data.hour_send) <10 ? "0": "" }${data.hour_send}:00:00`;
            const date = `${d} ${h}`;
            data.sending_schedule = toTimestamp(date)
        }
        data.type = type;

        let res;
        if (object?.id > 0) {
            data.id = object.id;
            res = await updateCampaign(data);
        } else {
            res = await createCampaign(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {


                if (submitSendMail){
                    this.onSend(data, submitSendMail);
                }else {
                    actions.deletePopup();
                    actions.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, idKey);

                }
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }

        }
        this.setState({loading: false});
    };
    _onToggle() {
        const {actions, object, idKey} = this.props;
        if (object){
            actions.SmartMessageBox({
                title: 'Bạn có chắc muốn thay đổi trạng thái',
                content: "",
                buttons: ['No', 'Yes']
            }, async (ButtonPressed) => {
                actions.hideSmartMessageBox();
                if (ButtonPressed === "Yes") {
                    const res = await toggleCampaign({id: object.id});
                    if (res) {
                        actions.putToastSuccess('Thao tác thành công');
                        actions.deletePopup();
                        publish(".refresh", {}, idKey);
                    }
                }
            });
        }
    }
    render() {
        const {initialForm, item, loading, submitSendMail} = this.state;
        const {type, object} = this.props;
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED),
            campaign_group_id: Yup.string().required(Constant.MSG_REQUIRED),
            from_name: Yup.string().required(Constant.MSG_REQUIRED),
            from_email: Yup.string().required(Constant.MSG_REQUIRED),
            content: Yup.string().required(Constant.MSG_REQUIRED),
            ...type === Constant.EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_MARKETING ?
                {
                    list_contact_id: Yup.string().required(Constant.MSG_REQUIRED),
                    hour_send: Yup.string().required(Constant.MSG_REQUIRED),
                    date_send: Yup.string().required(Constant.MSG_REQUIRED),
                }
                : {}

        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.hour_send = item ? Number(moment.unix(item.sending_schedule).format('HH')) : null;
        dataForm.date_send = item ? item.sending_schedule : null;
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={{...dataForm,type}}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          isEdit={!!item}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            {(!item || item.status !== Constant.EMAIL_MARKETING_CAMPAIGN_SENT) && (
                                <>
                                    <button type="submit" className="el-button el-button-success el-button-small">
                                        <span>Lưu</span>
                                    </button>
                                    {item && (
                                        <>
                                            <CanRender actionCode={ROLES.email_marketing_campaign_crud}>
                                                {object.status === Constant.EXPERIMENT_STATUS_ACTIVE ? (
                                                    <>
                                                        <button type="button" className="el-button el-button-bricky el-button-small"
                                                                onClick={this.onToggle}>
                                                            Ngưng hoạt động
                                                        </button>
                                                        <button type="submit" className="el-button el-button-info el-button-small"
                                                                onClick={()=>{
                                                            this.setState({submitSendMail: "test", loading: true})
                                                        }} >
                                                            {submitSendMail === "test" ? (
                                                                <i className="fa fa-spinner" aria-hidden="true" />
                                                            ) : (
                                                                <span>Gửi mail test</span>
                                                            )}
                                                        </button>
                                                        <button type="submit" className="el-button el-button-info el-button-small"
                                                                onClick={()=>{
                                                                    this.setState({submitSendMail: "mail", loading: true})
                                                                }}
                                                                style={{backgroundColor: "#009688"}}
                                                        >
                                                            {submitSendMail === "mail" ? (
                                                                <i className="fa fa-spinner" aria-hidden="true" />
                                                            ) : (
                                                                <span>Gửi</span>
                                                            )}
                                                        </button>
                                                    </>

                                                ) : (
                                                    <button type="button" className="el-button el-button-info el-button-small"
                                                            style={{backgroundColor: "#009688"}}
                                                            onClick={this.onToggle}>
                                                        Hoạt động
                                                    </button>
                                                )}

                                            </CanRender>
                                        </>
                                    )}
                                </>
                            )}

                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
                                <span>Đóng</span>
                            </button>
                        </div>
                    </div>

                </FormBase>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup, SmartMessageBox, hideSmartMessageBox}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
