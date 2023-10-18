import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormUpdateComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {publish} from "utils/event";
import {deletePopup, putToastError, putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {updateConfigKPIStaff} from "api/commission";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";

class PopupUpdateConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: props.item,
            initialForm: {
                "kpi_type": "kpi_type",
                "commit": "commit",
                "commission_rate_code": "commission_rate_code",
                "commission_formula_code": "commission_formula_code",
                "commission_bonus_code": "commission_bonus_code",
                "config_id": "config_id",
            },
            loading: false
        };
        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
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
        const res = await updateConfigKPIStaff({...item, ...data});
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

    _goBack() {
        const {actions} = this.props;
        actions.deletePopup();
    }


    render() {
        const {initialForm, item, loading} = this.state;
        const validationSchema = Yup.object().shape({});
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
                            <CanRender actionCode={ROLES.revenue_config_kpi_staff_update}>
                                <button type="submit" className="el-button el-button-success el-button-small">
                                    <span>Lưu</span>
                                </button>
                            </CanRender>
                            <button type="button" className="el-button el-button-default el-button-small"
                                    onClick={() => this.goBack()}>
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
