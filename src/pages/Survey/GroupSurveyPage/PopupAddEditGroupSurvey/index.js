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
import { createGroupSurvey, updateGroupSurvey } from "api/survey";
class PopupAddEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            item: { ...props.detail },
            initialForm: {
                "id": "id",
                "name": "name",
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
            res = await updateGroupSurvey(data);
        } else {
            res = await createGroupSurvey(data);
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
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        
        return (
            <div className="form-container">
                {
                    loading &&
                    <div className="dialog-popup-body"
                        style={{
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
                    FormComponent={(props) => <FormComponent {...props} />}
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
