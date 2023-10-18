import React from "react";
import {createAssignmentRequest} from "api/employer";
import * as Constant from "utils/Constant";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import {putToastSuccess, putToastError} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {publish} from "utils/event";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            detail: null,
            loading: false,
            initialForm: {
                email: "email",
                attached_file: "attached_file",
                reason: "reason",
                orther_reason: "orther_reason",
                note: "note",
            },
            isShow: true,
            isReasonNote: false
        };
        this.onChangeReason = this._onChangeReason.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
    }

    _onSubmit(data, actionsForm) {
        const dataSumbit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        this.setState({loading: true}, () => {
            this.submitData(dataSumbit, actionsForm);
        });
    }

    async submitData(data, actionsForm) {
        const {actions, idKey} = this.props;
        this.setState({isShow: false});
        let res = await createAssignmentRequest(data);
        const {code} = res;
        if(code === Constant.CODE_RES_CONFIRM) {
            const confirm = window.confirm(res?.msg);
            if(confirm) {
                let res = await createAssignmentRequest({...data,
                    allowed_continue: Constant.ALLOW_COUNTINUE_VALUE});
                if (res) {
                    if(res?.code === Constant.CODE_RES_ALERT) {
                        const confirm = window.confirm(res?.msg);
                        if(confirm) {
                            const res = await createAssignmentRequest({...data,
                                continue_create: Constant.ALLOW_COUNTINUE_VALUE,
                                allowed_continue: Constant.ALLOW_COUNTINUE_VALUE
                            });
                            if (res) {
                                if(res?.code === Constant.CODE_SUCCESS) {
                                    this.setState({loading: false}, () => {
                                        actions.putToastSuccess("Tạo yêu cầu chuyển giỏ thành công!");
                                        actionsForm.resetForm();
                                        publish(".refresh", {}, idKey);
                                    });
                                } else {
                                    actions.putToastError(res?.msg);
                                }
                            }
                        }
                    }
                    else if(res?.code === Constant.CODE_SUCCESS) {
                        this.setState({loading: false}, () => {
                            actions.putToastSuccess("Tạo yêu cầu chuyển giỏ thành công!");
                            actionsForm.resetForm();
                            publish(".refresh", {}, idKey);
                        });
                    } else {
                        actions.putToastError(res?.msg);
                    }
                }
            }
        }
        else if(res.code === Constant.CODE_RES_ALERT) {
            const confirm = window.confirm(res?.msg);
            if(confirm) {
                const res = await createAssignmentRequest({...data,
                    continue_create: Constant.ALLOW_COUNTINUE_VALUE});
                if (res) {
                    if(res?.code === Constant.CODE_SUCCESS) {
                        this.setState({loading: false}, () => {
                            actions.putToastSuccess("Tạo yêu cầu chuyển giỏ thành công!");
                            actionsForm.resetForm();
                            publish(".refresh", {}, idKey);
                        });
                    } else {
                        actions.putToastError(res?.msg);
                    }
                }
            }
        }
        else if(code === Constant.CODE_SUCCESS) {
            actions.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, idKey);
        }
        else if(code !== Constant.CODE_SUCCESS) {
            actions.putToastError(res?.msg);
        }
        this.setState({isShow: true});
        this.setState({loading: false});
    };

    _onChangeReason(value) {
        const reasonOther = value === Constant.REASON_OTHER_VALUE;
        this.setState({isReasonNote: reasonOther});
    }

    render() {
        const {id, initialForm, detail, loading, isReasonNote, isShow} = this.state;
        const fieldWarnings  = [];
        const validationSchema = Yup.object().shape({
            email: Yup.string().required(Constant.MSG_REQUIRED).min(5, Constant.MSG_MIN_CHARATER_5).max(255, Constant.MSG_MAX_CHARATER_255),
            reason: Yup.string().required(Constant.MSG_REQUIRED),
            orther_reason: isReasonNote ? Yup.string().required(Constant.MSG_REQUIRED) : null
        });

        let dataForm = detail ? utils.initFormValue(initialForm, detail) : utils.initFormKey(initialForm);

        return (
            <div className="form-container">

                {loading && <LoadingSmall className="form-loading"/>}

                {isShow && <FormBase onSubmit={this.onSubmit}
                                     isEdit={id > 0}
                                     fnCallBack={this.onChangeReason}
                                     initialValues={dataForm}
                                     validationSchema={validationSchema}
                                     fieldWarnings={fieldWarnings}
                                     FormComponent={FormComponent}>
                    <div className={"row mt15"}>
                        <div className="col-sm-12">
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Gửi yêu cầu</span>
                            </button>
                        </div>
                    </div>
                </FormBase>}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
