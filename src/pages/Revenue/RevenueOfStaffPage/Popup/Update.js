import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {publish} from "utils/event";
import {deletePopup, putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {updateKpiStaff} from "api/commission";

class PopupUpdateConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: props.item,
            initialForm: {
                "percent_commission": "percent_commission",
                "conditions": "conditions",
            },
            loading: false
        };
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSumbit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.submitData(dataSumbit, setErrors);
    }

    async submitData(data, setErrors) {
        const {item} = this.state;
        const {actions, idKey} = this.props;
        const res = await updateKpiStaff({id: item.id, ...data});
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                actions.putToastSuccess("Thao tác thành công!");
                publish(".refresh", {}, idKey);
                actions.deletePopup();
            } else {
                setErrors(data);
                actions.putToastError(msg);
            }
        }
    };

    render() {
        const {id, initialForm, item, loading} = this.state;

        const validationSchema = Yup.object().shape({
            percent_commission: Yup.string().required(Constant.MSG_REQUIRED),
            conditions: Yup.array().of(
                Yup.object().shape({
                    left: Yup.string().required(Constant.MSG_REQUIRED),
                    operation: Yup.string().required(Constant.MSG_REQUIRED),
                    right: Yup.string().required(Constant.MSG_REQUIRED),
                })
            )
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
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack(id)}>
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
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(PopupUpdateConfig);
