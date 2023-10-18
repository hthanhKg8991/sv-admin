import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {publish, subscribe} from "utils/event";
import {deletePopup, putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    createFieldSalesOrderScheduleUser,
    updateFieldSalesOrderScheduleUser,
    getDetailFieldRegistrationJobBox,
    getDetailFieldSalesOrderScheduleUser,
} from "api/saleOrder";
import {getDetail} from "api/job";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "employer_id": "employer_id",
                "sales_order_id": "sales_order_id",
                "sales_order_items_id": "sales_order_items_id",
                "registration_id": "registration_id",
                "job_id": "job_id",
                "cache_job_title": "cache_job_title",
                "seeker_name": "seeker_name",
                "salary": "salary",
                "payment_rate": "payment_rate",
                "compensation_recruitment": "compensation_recruitment",
                "document_file": "document_file",
                "document_file_url": "document_file_url",
                "onboard_at": "onboard_at",
            },
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    _onClose() {
        const {actions} = this.props;
        actions.deletePopup();
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
        const {actions, schedule_id, id, idKey} = this.props;
        data.compensation_recruitment = data.compensation_recruitment[0] === Constant.SALES_ORDER_BY_COMPENSATION_RECRUITMENT_YES ?
            Constant.SALES_ORDER_BY_COMPENSATION_RECRUITMENT_YES :
            Constant.SALES_ORDER_BY_COMPENSATION_RECRUITMENT_NO;
        data.schedule_id = schedule_id;
        const registrationInfo = await getDetailFieldRegistrationJobBox({id: data.registration_id});
        data.job_id = registrationInfo?.job_id;
        const jobInfo = await getDetail(data.job_id);
        data.cache_job_title = jobInfo?.title;
        let res;
        if (id) {
            data.id = id;
            res = await updateFieldSalesOrderScheduleUser(data);
        } else {
            res = await createFieldSalesOrderScheduleUser(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                actions.deletePopup();
                publish(".refresh", {}, idKey);
                publish(".refresh", {}, "AppendixExpandPackageList");
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async asyncData() {
        const {id} = this.props;
        const res = await getDetailFieldSalesOrderScheduleUser({id: id});
        if (res) {
            this.setState({item: res, loading: false});
        }
    }

    componentDidMount() {
        const {id} = this.props;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        const {initialForm, item, loading} = this.state;
        const {sales_order} = this.props;

        const validationSchema = Yup.object().shape({
            salary: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            sales_order_items_id: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            registration_id: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            payment_rate: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            onboard_at: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.compensation_recruitment = item?.compensation_recruitment === Constant.SALES_ORDER_BY_COMPENSATION_RECRUITMENT_YES ?
            [item.compensation_recruitment] : [];
        dataForm.employer_id = sales_order?.employer_id;
        dataForm.sales_order_id = sales_order.id;

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
                                    onClick={() => this.onClose()}>
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
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
