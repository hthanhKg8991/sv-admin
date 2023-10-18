import React from "react";
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { putToastError, putToastSuccess, showLoading, hideLoading, deletePopup } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { publish } from "utils/event";
import { createAccountServiceSearchResumeCampaign, updateAccountServiceSearchResumeCampaign } from "api/mix";
class PopupAddEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { ...props.detail, job_id: props.detail?.job_id === "0" ? "" : props.detail?.job_id, content: !props.detail?.content ? "" : props.detail?.content },
            loading: false,
            initialForm: {
                "id": "id",
                "name": "name",
                "employer_id": "employer_id",
                "quantity_cv": "quantity_cv",
                "job_id": "job_id",
                "content": "content",
                "file":"file"
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

    _onSubmit(data) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({ loading: true }, () => {
            this.submitData(dataSubmit);
        });
    }

    async submitData(data) {
        const { actions, idKey } = this.props;
        let res;
        if (data?.id > 0) {
            data.id = data.id;
            res = await updateAccountServiceSearchResumeCampaign(data);
        } else {
            res = await createAccountServiceSearchResumeCampaign(data);
        }
        if (res) {
            publish(".refresh", {}, idKey);
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
        this.setState({ loading: false });
    };

    render() {
        const { initialForm, item, loading } = this.state;
        const fieldWarnings = [];
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255),
            employer_id: Yup.string().required(Constant.MSG_REQUIRED),
            quantity_cv: Yup.number().typeError(Constant.MSG_NUMBER_ONLY).required(Constant.MSG_REQUIRED).positive(Constant.MSG_POSITIVE_ONLY).test('len', 'Số CV quá lớn', val => val < 99999999),
            content: Yup.string().min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255).nullable()
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">
                {
                    loading && <div className="dialog-popup-body" style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: "0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "99999"
                    }}>
                        <div className="form-container">
                            <div className="popupContainer text-center">
                                <LoadingSmall />
                            </div>
                        </div>
                    </div>
                }
                <FormBase
                    onSubmit={this.onSubmit}
                    initialValues={dataForm}
                    validationSchema={validationSchema}
                    fieldWarnings={fieldWarnings}
                    FormComponent={(props) => <FormComponent {...props} channel_code={this.props?.detail?.channel_code} />}
                >
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
        actions: bindActionCreators({ putToastSuccess, putToastError, showLoading, hideLoading, deletePopup }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupAddEdit);
