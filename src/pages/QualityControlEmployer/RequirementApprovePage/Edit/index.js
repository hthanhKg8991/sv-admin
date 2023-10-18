import React from "react";
import { sendRequestEmployer } from "api/employer";
import * as Constant from "utils/Constant";
import { publish } from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "pages/QualityControlEmployer/RequirementApprovePage/Edit/FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import { putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            type: null,
            loading: false,
            initialForm: {
                email: "email",
                name: "name",
                address: "address",
                type: "type",
                employer_id: "employer_id",
                new_data: "new_data",
                file: "file",
                reason_request: "reason_request",
            }
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.changeType = this._changeType.bind(this);
    }

    _changeType(type) {
        this.setState({ type })
    }

    _goBack() {
        const { history } = this.props;
        history.goBack();
        return true;
    }

    _onSubmit(data) {
        this.setState({ loading: true }, () => {
            this.submitData(data);
        });
    }

    async submitData(data) {
        const { actions, idKey } = this.props;
        const resSubmit = await sendRequestEmployer(data);
        if (resSubmit) {
            this.setState({ loading: false }, () => {
                actions.putToastSuccess("Thao tác thành công!");
                publish(publish(".refresh", {}, idKey))
            });
        } else {
            this.setState({ loading: false });
        }
    };



    render() {
        const validate = {
            [Constant.REASON_APPROVE_CHANGE_EMAIL] : Yup.string()
        .required(Constant.MSG_REQUIRED)
        .min(5, Constant.MSG_MIN_CHARATER_5)
        .max(255, Constant.MSG_MAX_CHARATER_255)
        .email(Constant.MSG_TYPE_VALID),
            [Constant.REASON_APPROVE_CHANGE_COMPANY] : Yup.string().required(Constant.MSG_REQUIRED),
            [Constant.REASON_APPROVE_VERIFY_EMAIL] : null,
        }
        const { id, initialForm, loading, type } = this.state;
        const {detail}=this.props;
        const validationSchema = Yup.object().shape({
            type: Yup.string().required(Constant.MSG_REQUIRED),
            reason_request: Yup.string().required(Constant.MSG_REQUIRED),
            new_data: validate[type] || null,
        });

        const dataForm = detail ? utils.initFormValue(initialForm, detail) : utils.initFormKey(
            initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
                          initialValues={dataForm}
                          fnCallBack={this.changeType}
                          validationSchema={validationSchema}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit"
                                    className="el-button el-button-success el-button-small">
                                <span>Gửi</span>
                            </button>
                            <button type="button"
                                    className="el-button el-button-default el-button-small"
                                    onClick={this.goBack}>
                                <span>Quay lại</span>
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
        actions: bindActionCreators({ putToastSuccess }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
