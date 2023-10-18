import React from "react";
import {connect} from "react-redux";
import * as Yup from "yup";
import _ from "lodash";
import {bindActionCreators} from "redux";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import MyField from "components/Common/Ui/Form/MyField";

import {putToastError, putToastSuccess, deletePopup} from "actions/uiAction";
import {dischargeVerify} from "api/employer";

import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";

class PopupDischargeVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.object,
            loading: false,
            initialForm: {
                "reason_other": "reason_other",
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
        const {actions, idKey, id} = this.props;
        data.customer_id = id;
        const res = await dischargeVerify(data);
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                publish(".refresh", {}, idKey)
                actions.putToastSuccess("Thao tác thành công!");
                actions.deletePopup();
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
            reason_other: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">
                {loading && <LoadingSmall className="form-loading position-0"/>}
                <FormBase 
                    onSubmit={this.onSubmit}
                    initialValues={dataForm}
                    validationSchema={validationSchema}
                    fieldWarnings={[]}
                    FormComponent={
                        () => (
                            <React.Fragment>
                                <div className={"row"}>
                                    <div className="col-sm-12 sub-title-form mb10">
                                        <span>Lý do xả khỏi phòng khối hỗ trợ</span>
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className="col-md-12 mb10">
                                        <MyField name={"reason_other"} label={"Lý do"} showLabelRequired/>
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    }
                >
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
        actions: bindActionCreators({putToastSuccess, putToastError, deletePopup}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(PopupDischargeVerify);
