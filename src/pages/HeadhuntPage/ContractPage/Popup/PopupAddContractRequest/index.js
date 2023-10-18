import React from "react";
import {connect} from "react-redux";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {
    createContractRequestHeadhunt,
    getDetailContractRequestHeadhunt,
    updateContractRequestHeadhunt,

} from "api/headhunt";
import * as Constant from "utils/Constant";

class PopupAddContractRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: false,
            campaign: [],
            initialForm: {
                "title": "title",
                "quantity_needed": "quantity_needed",
                "sku_id": "sku_id",
                "unit_price": "unit_price",
                "duration_guarantee": "duration_guarantee",
                "working_time": "working_time",
                "probation_time": "probation_time",
                "work_location": "work_location",
                "income": "income",
                "interview_process": "interview_process",
                "terms_of_payment": "terms_of_payment",
                "job_description": "job_description",
                "job_requirements": "job_requirements",
                "benefit": "benefit",
                "experience_required": "experience_required",
                "other_requirements": "other_requirements",
                "file_url": "file_url",
                "position": "position",
                "field": "field",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.asyncData = this._asyncData.bind(this);
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
        this.submitData(dataSubmit, setErrors);
    }

    async submitData(data, setErrors) {
        const {actions, idKey, contract_id} = this.props;
        const {item} = this.state;
        data.contract_id = contract_id;
        let res;
        if (item?.id > 0) {
            data.id = item.id;
            res = await updateContractRequestHeadhunt(data);
        } else {
            res = await createContractRequestHeadhunt(data);
        }
        const {data: dataRes, code, msg} = res;
        if (code === Constant.CODE_SUCCESS) {
            publish(".refresh", {}, idKey);
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();

        } else {
            setErrors(dataRes);
            actions.putToastError(msg);
        }

    };

    async _getDetail() {
        const res = await getDetailContractRequestHeadhunt({
            id: this.props.id
        });
        if (res) {
            this.setState({item: res, loading: false});
        }
    }

    async _asyncData() {
        const {id} = this.props;
        if (id) {
            this.getDetail();
        } else {
            this.setState({loading: false});
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {contract_detail} = this.props;
        const {initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            title: Yup.string().required(Constant.MSG_REQUIRED),
            quantity_needed: Yup.string().required(Constant.MSG_REQUIRED),
            sku_id: Yup.string().required(Constant.MSG_REQUIRED),
            unit_price: Yup.string().required(Constant.MSG_REQUIRED),
        });
        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        const readOnlyEdit = contract_detail && ![Constant.HEADHUNT_CONTRACT_STATUS_DRAFT].includes(contract_detail.status)
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container">
                        {loading ? <LoadingSmall className="form-loading"/> : (
                            <FormBase onSubmit={this.onSubmit}
                                      initialValues={{...dataForm, readOnlyEdit}}
                                      validationSchema={validationSchema}
                                      fieldWarnings={[]}
                                      isEdit={!!item}
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
                        )}
                    </div>
                </div>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupAddContractRequest);
