import React from "react";
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { bindActionCreators } from "redux";
import { publish } from "utils/event";
import { changeStatusAccountServiceSearchResumeCampaign } from "api/mix";
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox, deletePopup } from "actions/uiAction";
class PopupReject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialForm: {
                "reason": "reason",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const { actions } = this.props;
        actions.deletePopup();
        return true;
    }

    _onSubmit(data, action) {
        const { setErrors } = action;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({ loading: true }, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data) {
        const { actions, idKey, id } = this.props;

        actions.SmartMessageBox({
            title: `Bạn có chắc muốn không duyệt campaign Id: ${id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await changeStatusAccountServiceSearchResumeCampaign({ id, status: Constant.AS_FILTER_RESUME_CAMPAIGN_NOT_APPROVED, reason: data?.reason });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey)
                }
                actions.hideSmartMessageBox();
                actions.deletePopup();
            }
        });
        this.setState({ loading: false });
    };

    render() {
        const { initialForm, loading } = this.state;
        const fieldWarnings = [];
        const validationSchema = Yup.object().shape({
            reason: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255),
        });

        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading" />}
                <FormBase
                    onSubmit={this.onSubmit}
                    initialValues={utils.initFormKey(initialForm)}
                    validationSchema={validationSchema}
                    fieldWarnings={fieldWarnings}
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
        actions: bindActionCreators({ putToastSuccess, deletePopup, SmartMessageBox, hideSmartMessageBox }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupReject);
