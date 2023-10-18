import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {putToastError, putToastSuccess, showLoading, hideLoading, deletePopup, SmartMessageBox, hideSmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {
    approveRecruitmentRequest,
    createRecruitmentRequest,
    getDetailRecruitmentRequest,
    updateRecruitmentRequest
} from "api/headhunt";
import queryString from 'query-string';
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import moment from "moment";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null,
            loading: true,
            initialForm: {
                "customer_id": "customer_id",
                "list_customer_contact_id": "list_customer_contact_id",
                "request_at": "request_at",
                "request_value": "request_value",
                "deadline_at": "deadline_at",
                "note": "note",
                "contract_id": "contract_id",
                "contract_appendix_id": "contract_appendix_id",
                "list_sale_staff_login_name": "list_sale_staff_login_name",
                "list_recruiter_staff_login_name": "list_recruiter_staff_login_name",
            },
        };

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.onApprove = this._onApprove.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_RECRUITMENT_REQUEST,
        });
        return true;
    }

    _onApprove() {
        const {actions, id} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn duyệt recruitment request!',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await approveRecruitmentRequest({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    this.setState({loading: true})
                    this.asyncData();
                }

            }
        });
    }

    _onSubmit(data, action) {
        const dataSubmit = _.pickBy(data, (item) => {
            return !_.isUndefined(item);
        });
        this.setState({loading: true}, () => {
            this.submitData(dataSubmit);
        });
    }

    async submitData(data) {
        const {actions, setID, history, id} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await updateRecruitmentRequest(data);
        } else {
            res = await createRecruitmentRequest(data);
        }
        if (res) {
            actions.putToastSuccess("Thao tác thành công!");
            setID(res.id);
            history.push({
                pathname: Constant.BASE_URL_HEADHUNT_RECRUITMENT_REQUEST,
                search: '?' + queryString.stringify({id: res.id,action: "edit"})
            });
            this.asyncData();

        }
    };

    async _asyncData(){
        const {id} = this.props;
        const res = await getDetailRecruitmentRequest({id});
        if (res){
            this.setState({item: res,loading: false});
        }
    }

    componentDidMount() {
        const {id} = this.props;
        if(id > 0){
            this.asyncData();
        }else {
            this.setState({loading: false});
        }
    }

    render() {
        const {initialForm, item, loading} = this.state;
        const {id} = this.props;
        const validationSchema = Yup.object().shape({
            request_at: Yup.string().required(Constant.MSG_REQUIRED),
            customer_id: Yup.string().required(Constant.MSG_REQUIRED),
        });
        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        if (!(id > 0)){
            dataForm.request_at = moment().unix();
        }
        return (
            <div className="form-container">
                {loading ? <LoadingSmall className="form-loading"/> : (
                    <FormBase onSubmit={this.onSubmit}
                              initialValues={dataForm}
                              validationSchema={validationSchema}
                              isEdit={id > 0}
                              fieldWarnings={[]}
                              FormComponent={FormComponent}>
                        <div className={"row mt15"}>
                            <div className="col-sm-12">
                                <button type="submit" className="el-button el-button-primary el-button-small">
                                    <span>Lưu</span>
                                </button>
                                <CanRender actionCode={ROLES.headhunt_recruitment_request_approve}>
                                    {item && item.status !== Constant.HEADHUNT_RECRUITMENT_REQUEST_STATUS_ACTIVE && (
                                        <button type="button" className="el-button el-button-success el-button-small"
                                                onClick={this.onApprove}>
                                            <span>Duyệt</span>
                                        </button>
                                    )}
                                </CanRender>
                                <button type="button" className="el-button el-button-default el-button-small"
                                        onClick={() => this.goBack()}>
                                    <span>Đóng</span>
                                </button>
                            </div>
                        </div>

                    </FormBase>
                )}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, showLoading, hideLoading, deletePopup, SmartMessageBox, hideSmartMessageBox}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(Edit);
