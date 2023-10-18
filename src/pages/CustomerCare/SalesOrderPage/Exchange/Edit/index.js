import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, deletePopup} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {duplicateSalesOrderExchange} from "api/saleOrder";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: false,
            initialForm: {
                "sales_order_id": "sales_order_id",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
    }

    async _onSubmit(data) {
        const {actions, history} = this.props;
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        const res = await duplicateSalesOrderExchange({
            id: dataSubmit.sales_order_id
        });

        if (res) {
            actions.putToastSuccess('Thao tác thành công');
            actions.deletePopup();
            history.push({
                pathname: Constant.BASE_URL_SALES_ORDER,
                search: '?action=detail&id=' + res?.id
            });
        }
        return true;
    }


    render() {
        const {id, initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({
            sales_order_id: Yup.number().required(Constant.MSG_REQUIRED).typeError(Constant.MSG_TYPE_VALID),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                <FormBase onSubmit={this.onSubmit}
                          initialValues={dataForm}
                          validationSchema={validationSchema}
                          isEdit={id > 0}
                          fieldWarnings={[]}
                          FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
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
