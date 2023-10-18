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
import {publish} from "utils/event";
import {
    createHeadhuntAcceptanceRecordDetail,
    getDetailHeadhuntAcceptanceRecordDetail,
    updateHeadhuntAcceptanceRecordDetail,
} from "api/headhunt";

class PopupAcceptanceRecordPackage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: true,
            campaign: [],
            initialForm: {
                "contract_id": "contract_id",
                "applicant_id": "applicant_id",
                "recruiter_staff_login_name": "recruiter_staff_login_name",
                "acceptance_position": "acceptance_position",
                "acceptance_date_confirmed": "acceptance_date_confirmed",
                "acceptance_status": "acceptance_status",
                "acceptance_fee": "acceptance_fee",
                "type": "type",
                "sales_order_item_id": "sales_order_item_id",
                "contract_request_id": "contract_request_id",
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

    _onSubmit(data) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit);
        });
    }

    async submitData(data) {
        const {actions, idKey, acceptance_record_id, sales_order} = this.props;
        const {item} = this.state;
        let res;
        data.acceptance_record_id = acceptance_record_id;
        data.sales_order_id = sales_order.id;
        if (item?.id > 0) {
            data.id = item.id;
            res = await updateHeadhuntAcceptanceRecordDetail(data);
        } else {
            res = await createHeadhuntAcceptanceRecordDetail(data);
        }
        if (res) {
            publish(".refresh", {}, idKey);
            actions.putToastSuccess("Thao tác thành công!");
            actions.deletePopup();
        }
        this.setState({loading: false});
    };

    async _getDetail() {
        const res = await getDetailHeadhuntAcceptanceRecordDetail({
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
        const {sales_order_item, sales_order} = this.props;
        const {initialForm, item, loading, customer_staff} = this.state;
        const validationSchema = Yup.object().shape({
            contract_id: Yup.string().required(Constant.MSG_REQUIRED),
            applicant_id: Yup.string().required(Constant.MSG_REQUIRED),
            recruiter_staff_login_name: Yup.string().required(Constant.MSG_REQUIRED),
            sales_order_item_id: Yup.string().required(Constant.MSG_REQUIRED),
            contract_request_id: Yup.string().required(Constant.MSG_REQUIRED),
        });
        
        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        if (!item) {
            dataForm.contract_id = sales_order.contract_id;
        }
        return loading ? <LoadingSmall className="form-loading"/> : (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="form-container">
                        <FormBase onSubmit={this.onSubmit}
                                  initialValues={{...dataForm, sales_order_item, customer_staff}}
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

export default connect(null, mapDispatchToProps)(PopupAcceptanceRecordPackage);
