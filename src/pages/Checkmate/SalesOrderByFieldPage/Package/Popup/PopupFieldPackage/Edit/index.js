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
    createSalesOrderByFieldItems,
    getDetailSalesOrderByFieldItems,
    updateSalesOrderByFieldItems
} from "api/saleOrder";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            initialForm: {
                "total_resume_required": "total_resume_required",
                "job_level": "job_level",
                "total_job": "total_job",
                "total_week": "total_week",
                "salary_max": "salary_max",
                "salary_min": "salary_min",
                "guarantee": "guarantee",
                "price_list_id": "price_list_id",
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
        const {actions, id, sales_order_id, type, idKey} = this.props;
        data.sales_order_id = sales_order_id;
        data.type_campaign = type;
        data.guarantee = data.guarantee[0] === Constant.SALES_ORDER_BY_FIELD_GUARANTEE_YES ?
            Constant.SALES_ORDER_BY_FIELD_GUARANTEE_YES :
            Constant.SALES_ORDER_BY_FIELD_GUARANTEE_NO;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateSalesOrderByFieldItems(data);
        } else {
            res = await createSalesOrderByFieldItems(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                publish(".refresh", {}, idKey);
                publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_BY_FIELD_EDIT);
                actions.putToastSuccess("Thao tác thành công!");
                actions.deletePopup();
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async asyncData() {
        const {id} = this.props;
        const res = await getDetailSalesOrderByFieldItems({id: id});
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

        const validationSchema = Yup.object().shape({
            total_resume_required: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            job_level: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            total_week: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            total_job: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            salary_max: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            salary_min: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
            price_list_id: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.guarantee = item?.guarantee === Constant.SALES_ORDER_BY_FIELD_GUARANTEE_YES ? [item.guarantee] : [];
        dataForm.total_job = 1;

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
