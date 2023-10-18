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
import {
    changeStatusPipelineByCampaignHeadhunt,
    getListFullHeadhuntApplicantStatus,
    guaranteeApplicantHeadhunt
} from "api/headhunt";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            list_status: [],
            checked_default: [],
            initialForm: {
                "campaign_id": "campaign_id",
                "list_campaign_applicant_status": "list_campaign_applicant_status",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.getApplicantStatus = this._getApplicantStatus.bind(this);
    }

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
        return true;
    }

    _onSubmit(data) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit);
        });
    }

    async submitData(data) {
        const {actions} = this.props;
        delete data["list_status"];
        data.list_campaign_applicant_status = data.list_campaign_applicant_status?.filter(v => !!v.checked) || [];
        const res = await changeStatusPipelineByCampaignHeadhunt(data);
        if (res) {
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
    };

    async _getApplicantStatus() {
        const res = await getListFullHeadhuntApplicantStatus({is_disabled: Constant.HEADHUNT_APPLICANT_STATUS_UN_DISABLE});
        if (res) {
            const checked_default = res.filter(v => v.is_default === Constant.HEADHUNT_APPLICANT_STATUS_DEFAULT).map(v => ({
                applicant_status_code: v.code,
                index: v.code,
                checked: true
            }))
            this.setState({list_status: res, checked_default})
        }
    }

    componentDidMount() {
        this.getApplicantStatus();
    }

    render() {
        const {initialForm, loading, list_status} = this.state;
        const validationSchema = Yup.object().shape({
            campaign_id: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = utils.initFormKey(initialForm);
        dataForm.list_campaign_applicant_status = [];

        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={{...dataForm, list_status}}
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
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
