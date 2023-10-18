import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {deletePopup, putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {createSalesOrderByField} from "api/saleOrder";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initialForm: {
                "employer_id": "employer_id",
                "type_campaign": "type_campaign",
                "promotion_programs_id": "promotion_programs_id",
                "original_sales_order_id": "original_sales_order_id",
            },
        };
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
        const {actions, sales_order} = this.props;
        const res = await createSalesOrderByField({
            original_sales_order_id: sales_order.id,
            employer_id: sales_order.employer_id,
            type_campaign: Constant.CAMPAIGN_TYPE_GIFT,
            promotion_programs_id: data.promotion_programs_id
        });
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công");
                actions.deletePopup();
                const url = `${Constant.BASE_URL_SALES_ORDER_BY_FIELD}?action=edit&id=${data.id}`;
                window.open(url);
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
            promotion_programs_id: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

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
