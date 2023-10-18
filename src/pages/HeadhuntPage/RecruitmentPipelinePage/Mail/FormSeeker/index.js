import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {sendEmailTransactionMarketingCampaign} from "api/emailMarketing";
import {sendEmailTransactionMarketingCampaignHeadhunt} from "api/headhunt";

class FormMailSeeker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.object ?  {
                campaign_detail_to_name: props.object.seeker_name,
                campaign_detail_to_email: props.object.seeker_email,
            } : null,
            loading: false,
            initialForm: {
                "id": "id",
                "name": "name",
                "campaign_detail_to_name": "campaign_detail_to_name",
                "campaign_detail_to_email": "campaign_detail_to_email",
                "content": "content",
                "cv_file_url":"cv_file_url",
                "email_template":"email_template",
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
        const {actions, idKey, applicant_id} = this.props;
        const payload = {
            action_code: "sent_email_to_applicant",
            id: applicant_id,
            email_marketing: data
        }
        const res = await sendEmailTransactionMarketingCampaignHeadhunt(payload);
        if (res) {
            publish(".refresh", {}, idKey);
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            campaign_detail_to_name: Yup.string().required(Constant.MSG_REQUIRED),
            campaign_detail_to_email: Yup.string().required(Constant.MSG_REQUIRED),
            name: Yup.string().required(Constant.MSG_REQUIRED),
            content: Yup.string().required(Constant.MSG_REQUIRED),
            email_template: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Gửi</span>
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
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(FormMailSeeker);
