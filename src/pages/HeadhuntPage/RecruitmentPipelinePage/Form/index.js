import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {
    putToastError,
    putToastSuccess,
    showLoading,
    hideLoading,
    deletePopup,
    hideSmartMessageBox,
    SmartMessageBox
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {createHeadhuntApplicant, updateHeadhuntApplicant} from "api/headhunt";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.object,
            loading: false,
            initialForm: {
                "campaign_id": "campaign_id",
                "seeker_email": "seeker_email",
                "seeker_phone": "seeker_phone",
                "seeker_name": "seeker_name",
                "resume_title": "resume_title",
                "data_source": "data_source",
                "cv_file": "cv_file",
                "cv_file_url": "cv_file_url",
                "seeker_address": "seeker_address",
                "seeker_date_of_birth": "seeker_date_of_birth",
                "revenue_expected": "revenue_expected",
                "applicant_channel_code": "channel_code",
                "recruiter_staff_login_name": "recruiter_staff_login_name",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
        return true;
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
        const {actions, object, idKey, applicant_info} = this.props;
        let res;
        data.confirm_applicant_info = 0;
        if (applicant_info?.id > 0) {
            data.applicant_info_id = applicant_info.id;
            data.id = object.id;
            delete data['seeker_email'];
            delete data['seeker_phone'];
            delete data['seeker_name'];
            res = await updateHeadhuntApplicant(data);
        } else {
            res = await createHeadhuntApplicant(data);
        }
        if (res) {
            const {data: dataRes, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                publish(".refresh", {}, idKey);
                actions.putToastSuccess("Thao tác thành công!");
                actions.deletePopup();
            } else if (code === Constant.CODE_VALIDATION_DUPLICATE) {
                actions.SmartMessageBox({
                    title: msg,
                    content: "",
                    buttons: ['No', 'Yes']
                }, async (ButtonPressed) => {
                    if (ButtonPressed === "Yes") {
                        data.confirm_applicant_info = 1;
                        let resConfirm;
                        if (applicant_info?.id > 0) {
                            resConfirm = await updateHeadhuntApplicant(data);
                        } else {
                            resConfirm = await createHeadhuntApplicant(data);
                        }
                        const {data: dataResConfirm, code: codeConfirm, msg: msgConfirm} = resConfirm;
                        if (codeConfirm === Constant.CODE_SUCCESS) {
                            publish(".refresh", {}, idKey);
                            actions.putToastSuccess("Thao tác thành công!");
                            actions.deletePopup();

                        } else {
                            setErrors(dataResConfirm);
                            actions.putToastError(msgConfirm);
                        }
                        actions.hideSmartMessageBox();
                    }
                });
            } else {
                setErrors(dataRes);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, item, loading} = this.state;
        const {object, applicant_info} = this.props;
        const validationSchema = Yup.object().shape({
            campaign_id: Yup.string().required(Constant.MSG_REQUIRED),
            resume_title: Yup.string().required(Constant.MSG_REQUIRED),
            data_source: Yup.string().required(Constant.MSG_REQUIRED),
            recruiter_staff_login_name: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            applicant_channel_code: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            ...(applicant_info?.id > 0 ? {} : {
                seeker_email: Yup.string().required(Constant.MSG_REQUIRED).email(Constant.MSG_EMAIL_INVALID),
                seeker_phone: Yup.string().required(Constant.MSG_REQUIRED),
                seeker_name: Yup.string().required(Constant.MSG_REQUIRED),
            })
        });

        const dataForm = item
            ? utils.initFormValue(initialForm, {...(applicant_info || {}), ...item})
            : utils.initFormKey(initialForm);
        if (item) {
            dataForm.seeker_email = item.email;
            dataForm.seeker_phone = item.phone;
            dataForm.seeker_name = item.name;
            dataForm.seeker_date_of_birth = item.date_of_birth;
            dataForm.seeker_address = item.address;
        }
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          isEdit={object?.id > 0}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
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
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            showLoading,
            hideLoading,
            deletePopup,
            hideSmartMessageBox,
            SmartMessageBox
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
