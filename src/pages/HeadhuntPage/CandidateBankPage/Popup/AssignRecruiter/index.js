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
import { assignRecruiterCandidateBankHeadhunt} from "api/headhunt";
import {publish} from "utils/event";

class AssignPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.object,
            loading: false,
            initialForm: {
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
        const {actions, idKey, list_id} = this.props;
        const res = await assignRecruiterCandidateBankHeadhunt({...data, list_id});
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                actions.deletePopup();
                if (idKey) {
                    publish(".refresh", {}, idKey);
                }
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            recruiter_staff_login_name: Yup.string().required(Constant.MSG_REQUIRED),
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
                        <div className="row mt15">
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

export default connect(null, mapDispatchToProps)(AssignPopup);
