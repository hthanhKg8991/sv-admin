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
    evaluateCandidateBankHeadhunt,
} from "api/headhunt";
import AddTagResume from "./AddTagResume"
class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialForm: {
                "evaluation": "evaluation",
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

    _onSubmit(data) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit);
        });
    }

    async submitData(data) {
        const {actions, id} = this.props;
        data.id = id;
        const res = await evaluateCandidateBankHeadhunt(data);
        if (res) {
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, loading} = this.state;
        const {object, id} = this.props;
        const validationSchema = Yup.object().shape({
            evaluation: Yup.string().required(Constant.MSG_REQUIRED),
        });
        const dataForm = object
            ? utils.initFormValue(initialForm, object)
            : utils.initFormKey(initialForm);
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className="row">
                        <div className="col-sm-12">
                            <AddTagResume id={id} />
                        </div>
                    </div>
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
