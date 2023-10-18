import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from "query-string";
import {putToastError, putToastSuccess, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    approveHeadhuntContract, confirmHeadhuntContract,
    createByContractCampaignHeadhunt,
    createHeadhuntContract,
    printHeadhuntContract, rejectHeadhuntContract, submitHeadhuntContract,
    updateHeadhuntContract
} from "api/headhunt";
import {publish} from "utils/event";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import moment from "moment";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            loading: false,
            initialForm: {
                "code": "code",
                "customer_id": "customer_id",
                "date_at": "date_at",
                "date_expired_at": "date_expired_at",
                "contract_form_id": "contract_form_id",
                "contract_url": "contract_url",
                "company_name": "customer_info.company_name",
                "address": "customer_info.address",
                "tax_code": "customer_info.tax_code",
                "representative": "representative",
                "representative_email": "representative_email",
                "other_template": "other_template",
                "sale_staff_login_name": "sale_staff_login_name",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.printContract = this._printContract.bind(this);
        this.sendRecruiter = this._sendRecruiter.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onSubmitContract = this._onSubmitContract.bind(this);
        this.onConfirm = this._onConfirm.bind(this);
    }

    _goBack(id) {
        const {history} = this.props;

        if (id > 0) {
            if (_.get(history, 'action') === 'POP') {
                history.push({
                    pathname: Constant.BASE_URL_HEADHUNT_CONTRACT,
                    search: '?action=list'
                });

                return true;
            }

            if (_.get(history, 'action') === 'PUSH') {
                const search = queryString.parse(_.get(history, ['location', 'search']));
                const params = {
                    ...search,
                    action: "list"
                };

                history.push({
                    pathname: Constant.BASE_URL_HEADHUNT_CONTRACT,
                    search: '?' + queryString.stringify(params)
                });

                return true;
            }
        } else {
            history.push({
                pathname: Constant.BASE_URL_HEADHUNT_CONTRACT
            });
        }

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
        const {actions, history, setID, id, asyncData} = this.props;
        data.other_template = data.other_template?.pop() || null;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateHeadhuntContract(data);
        } else {
            res = await createHeadhuntContract(data);
        }
        const {data: dataRes, code, msg} = res;
        if (code === Constant.CODE_SUCCESS) {
            actions.putToastSuccess("Thao tác thành công!");
            if (dataRes.id) {
                history.push({
                    pathname: Constant.BASE_URL_HEADHUNT_CONTRACT,
                    search: '?action=edit&id=' + dataRes.id
                });
                setID(dataRes.id);
                asyncData();
            } else {
                history.push({
                    pathname: Constant.BASE_URL_HEADHUNT_CONTRACT,
                });
            }
        } else {
            setErrors(dataRes);
            actions.putToastError(msg);
        }
    };

    async _printContract() {
        const res = await printHeadhuntContract({id: this.props.id, type: "doc"});
        if (res) {
            window.open(res?.url, "_blank");
        }
    }

    async _sendRecruiter() {
        const {actions, idKey} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc chắn muốn gửi yêu cầu tuyển dụng hợp đồng này cho Recruiter?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await createByContractCampaignHeadhunt({contract_id: this.props.id});
                if (res) {
                    actions.hideSmartMessageBox();
                    actions.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, idKey)
                }
            }
        });

    }

    async _onApprove(id) {
        const {actions, idKey} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await approveHeadhuntContract({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onReject(id) {
        const {actions, idKey} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn không duyệt hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await rejectHeadhuntContract({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onSubmitContract(id) {
        const {actions, idKey} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn hoàn thành hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await submitHeadhuntContract({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onConfirm(id) {
        const {actions, idKey} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn gửi yêu cầu duyệt hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await confirmHeadhuntContract({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    render() {
        const {id, item} = this.props;
        const {initialForm, loading} = this.state;
        const validationSchema = Yup.object().shape({
            customer_id: Yup.string().required(Constant.MSG_REQUIRED),
            date_at: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            date_expired_at: Yup.string().required(Constant.MSG_REQUIRED).nullable(),

        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.other_template = item ? [item.other_template] : [];
        if (!item) {
            dataForm.date_at = moment().unix();
        }
        return (
            <div>
                {loading && <LoadingSmall className="form-loading"/>}
                <div className="form-container">
                    <FormBase onSubmit={this.onSubmit}
                              isEdit={id > 0}
                              initialValues={dataForm}
                              validationSchema={validationSchema}
                              fieldWarnings={[]}
                              FormComponent={FormComponent}>
                        <div className={"row mt15"}>
                            <div className="col-sm-12 text-right">
                                {id > 0 && (
                                    <CanRender actionCode={ROLES.headhunt_contract_print}>
                                        <button type="button" className="el-button el-button-warning el-button-small"
                                                onClick={() => this.printContract()}>
                                            <span>In hợp đồng</span>
                                        </button>
                                    </CanRender>
                                )}
                                <CanRender actionCode={ROLES.headhunt_contract_send_recruiter}>
                                    {item && item.campaign_info.length === 0 && [
                                        Constant.HEADHUNT_CONTRACT_STATUS_SUBMITTED,
                                        Constant.HEADHUNT_CONTRACT_STATUS_CONFIRMED,
                                        Constant.HEADHUNT_CONTRACT_STATUS_APPROVED
                                    ].includes(item.status) && (
                                        <button type="button" className="el-button el-button-success el-button-small"
                                                onClick={() => this.sendRecruiter()}>
                                            <span>Gửi cho Recruiter</span>
                                        </button>
                                    )}
                                </CanRender>
                                {item && (
                                    <>
                                        <CanRender actionCode={ROLES.headhunt_contract_approve}>
                                            {item.status === Constant.HEADHUNT_CONTRACT_STATUS_CONFIRMED && (
                                                <button type="button"
                                                        className="el-button el-button-success el-button-small"
                                                        onClick={() => this.onApprove(item.id)}>
                                                    Duyệt
                                                </button>
                                            )}
                                        </CanRender>
                                        <CanRender actionCode={ROLES.headhunt_contract_submit}>
                                            {item.status === Constant.HEADHUNT_CONTRACT_STATUS_DRAFT && (
                                                <button type="button"
                                                        className="el-button el-button-success el-button-small"
                                                        onClick={() => this.onSubmitContract(item.id)}>
                                                    Hoàn thành
                                                </button>
                                            )}
                                        </CanRender>
                                        <CanRender actionCode={ROLES.headhunt_contract_confirm}>
                                            {item.status === Constant.HEADHUNT_CONTRACT_STATUS_SUBMITTED && (
                                                <button type="button"
                                                        className="el-button el-button-warning el-button-small"
                                                        onClick={() => this.onConfirm(item.id)}>
                                                    Gửi y/c duyệt
                                                </button>
                                            )}
                                        </CanRender>
                                        <CanRender actionCode={ROLES.headhunt_contract_reject}>
                                            {item.status === Constant.HEADHUNT_CONTRACT_STATUS_CONFIRMED && (
                                                <button type="button"
                                                        className="el-button el-button-bricky el-button-small"
                                                        onClick={() => this.onReject(item.id)}>
                                                    Không duyệt
                                                </button>
                                            )}
                                        </CanRender>
                                    </>
                                )}
                                {(!item || item.status === Constant.HEADHUNT_CONTRACT_STATUS_DRAFT) && (
                                    <button type="submit" className="el-button el-button-primary el-button-small">
                                        <span>Lưu</span>
                                    </button>
                                )}
                                <button type="button" className="el-button el-button-default el-button-small"
                                        onClick={() => this.goBack(id)}>
                                    <span>Quay lại</span>
                                </button>
                            </div>
                        </div>
                    </FormBase>
                </div>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Edit);
