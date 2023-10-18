import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "pages/CustomerCare/OpportunityPage/Form/FormComponentSendReport";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, deletePopup, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {sendOpportunityReportPriceEmail} from "api/saleOrder"

class PopupSendReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                ...props.object,
                email_receives: props?.employer_email ? [props?.employer_email] : [],
                opportunity_id: props?.opportunity_id,
            },
            loading: false,
            submitSendMail: null,
            initialForm: {
                "opportunity_id": "opportunity_id",
                "subject": "subject",
                "content": "content",
                "email_receives": "email_receives",
                "attach_files": "attach_files",
                "cc": "cc",
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

    async submitData(data) {
        const {actions, idKey} = this.props;
        this.setState({loading: true});
        const res = await sendOpportunityReportPriceEmail({
            ...data, 
            attach_files: !!data?.attached_file_url_url 
                ? Array.isArray(data?.attached_file_url_url) ? data?.attached_file_url_url : [data?.attached_file_url_url]
                : []
        });
        
        if (res?.code === Constant.CODE_SUCCESS){
            actions.putToastSuccess("Gửi báo giá thành công");
            actions.deletePopup();
            publish(".refresh", {}, idKey)
        }else{
            actions.putToastError(res?.msg)
        }
        this.setState({loading: false});
    };
    render() {
        const {initialForm, item, loading} = this.state;
        const {type} = this.props;
        const validationSchema = Yup.object().shape({
            subject: Yup.string().required(Constant.MSG_REQUIRED),
            opportunity_id: Yup.string().required(Constant.MSG_REQUIRED),
            content: Yup.string().required(Constant.MSG_REQUIRED),
            email_receives: Yup.array().of(Yup.string().email(Constant.MSG_EMAIL_INVALID)).min(1, Constant.MSG_REQUIRED),
            cc: Yup.array().of(Yup.string().email(Constant.MSG_EMAIL_INVALID)),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={{...dataForm,type}}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          isEdit={!!item}
                          validateOnBlur={false}
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
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup, SmartMessageBox, hideSmartMessageBox}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupSendReport);
