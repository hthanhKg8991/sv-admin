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
    SmartMessageBox,
    hideSmartMessageBox
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {createHeadhuntCandidate, updateHeadhuntCandidate} from "api/headhunt";
import {publish} from "utils/event";

class AddCandidatePopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.object,
            loading: false,
            initialForm: {
                "name": "name",
                "email": "email",
                "email_confirm": "email_confirm",
                "mobile": "mobile",
                "birthday": "birthday",
                "gender": "gender",
                "seeker_province_id": "seeker_province_id",
                "address": "address",
                "token_email": "token_email",
                "title": "title",
                "salary": "salary",
                "level": "level",
                "experience": "experience",
                "field_ids": "field_ids",
                "position": "position",
                "province_ids": "province_ids",
                "social_url": "social_url",
                "cv_file_url": "cv_file_url"
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
        const {actions, idKey, object} = this.props;
        let res;
        if (object?.id) {
            data.id = object.id;
            res = await updateHeadhuntCandidate(data);
        } else {
            res = await createHeadhuntCandidate(data);
        }
        if (res) {
            const {data: dataRes, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                actions.deletePopup();
                setTimeout(() => {
                    publish(".refresh", {}, idKey);
                }, 2000)
            } else if (code === Constant.CODE_VALIDATION_DUPLICATE) {
                actions.SmartMessageBox({
                    title: msg,
                    content: "",
                    buttons: ['No', 'Yes']
                }, async (ButtonPressed) => {
                    if (ButtonPressed === "Yes") {
                        this.submitData({
                            ...data,
                            email_confirm: 1
                        }, setErrors).then(() => actions.hideSmartMessageBox());
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
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED).max(255, Constant.MSG_MAX_CHARATER_255),
            title: Yup.string().required(Constant.MSG_REQUIRED).max(255, Constant.MSG_MAX_CHARATER_255),
            cv_file_url: Yup.string().required(Constant.MSG_REQUIRED),
            email: Yup.string().max(255, Constant.MSG_MAX_CHARATER_255).email(Constant.MSG_TYPE_VALID).required(Constant.MSG_REQUIRED),
        });
        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div>
                {loading && <LoadingSmall className="form-loading"/>}
                <div className="form-container">
                    <FormBase onSubmit={this.onSubmit}
                              initialValues={dataForm}
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
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(AddCandidatePopup);
