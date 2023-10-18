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
import {createApplicantInfoAction, updateApplicantInfoAction, updateHeadhuntApplicantInfo} from "api/headhunt";
import moment from "moment";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            loading: false,
            initialForm: {
                "action_code": "action_code",
                "date_at": "date_at",
                "campaign_id": "campaign_id",
                "result": "result",
                "reason": "reason",
                "note": "note",
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
        const {actions, applicant_id} = this.props;
        const {item} = this.state;
        let res;
        data.applicant_id = applicant_id;
        if (item?.id > 0) {
            data.id = item.id;
            res = await updateApplicantInfoAction(data);
        }else {
            res = await createApplicantInfoAction(data);
        }
        if (res) {
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
        this.setState({loading: false});
    };

    render() {
        const {initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            action_code: Yup.string().required(Constant.MSG_REQUIRED),
            date_at: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item
            ? utils.initFormValue(initialForm, item)
            : utils.initFormKey(initialForm);
        if (!item){
            dataForm.date_at = moment().unix();
        }
        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading"/>}
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
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
