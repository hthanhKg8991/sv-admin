import React from "react";
import { sendRequestJob } from "api/employer";
import * as Constant from "utils/Constant";
import FormBase from "components/Common/Ui/Form";
import FormComponent
    from "pages/QualityControlEmployer/RequirementApprovePage/EditJob/FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import { putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { publish } from 'utils/event';

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            loading: false,
            initialForm: {
                email: "email",
                employer_name: "employer_name",
                employer_address: "employer_address",
                name: "name",
                title: "title",
                file: "file",
                type: "type",
                job_id: "job_id",
                new_data: "new_data",
            }
        };
        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
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
        const resSubmit = await sendRequestJob(data);
        if (resSubmit) {
            this.setState({ loading: false }, () => {
                actions.putToastSuccess("Thao tác thành công!");
            });
        } else {
            this.setState({ loading: false });
        }
        publish(publish(".refresh", {}, idKey))
    };


    render() {
        const { id, initialForm, loading } = this.state;
        const { detail } = this.props;

        const validationSchema = Yup.object().shape({
            job_id: Yup.string().required(Constant.MSG_REQUIRED),
            new_data: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = detail ? utils.initFormValue(initialForm, detail) : utils.initFormKey(
            initialForm);
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          isEdit={id > 0}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit"
                                    className="el-button el-button-success el-button-small">
                                <span>Thêm</span>
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
