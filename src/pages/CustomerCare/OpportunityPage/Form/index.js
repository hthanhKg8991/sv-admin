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
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import moment from "moment";
import {createOpportunity, editOpportunity, getOpportunityDetail} from "api/saleOrder";
import {getList} from "api/employer";

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: null,
            loading: true,
            login_name: props.user?.login_name,
            name: null,
            initialForm: {
                "name": "name",
                "ability": "ability",
                "campaign": "campaign",
                "contact_status": "contact_status",
                "employer_id": "employer_id",
                "expected_date": "expected_date",
                "level": "level",
                "note": "note",
                "package_type": "package_type",
                "reason_guess": "reason_guess",
                "revenue": "revenue",
                "sales_order_id": "sales_order_id",
                "schedule_call": "schedule_call",
                "expired_date": "expired_date",
                "opportunity_status": "opportunity_status",
                "priority": "priority",
                "staff_email": "staff_email",
                "recruitment_demand": "recruitment_demand",
                "send_quote_status": "send_quote_status",
                "response_quote_date": "response_quote_date",
                "response_quote_status": "response_quote_status",
                "vat_percent": "vat_percent",
                "keywords": "keywords",
            },
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));

        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this);
        this.getAssignStaff = this._getAssignStaff.bind(this);
        this.getEmployer = this._getEmployer.bind(this);
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
        const {id} = this.state;
        const {uiAction, idKey} = this.props;
        let res;
        if (id > 0) {
            data.id = id;
            res = await editOpportunity(data);
        } else {
            res = await createOpportunity(data);
        }
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                uiAction.putToastSuccess("Thao tác thành công!");
                uiAction.deletePopup();
                publish(".refresh", {}, idKey)
            } else {
                setErrors(data);
                uiAction.putToastError(msg);
            }
        }
        this.setState({loading: false});
    };

    async asyncData() {
        const {id} = this.state;

        if (id > 0) {
            const res = await getOpportunityDetail({id});
            if (res) {
                this.setState({item: res, loading: false});
            }
        } else {
            this.setState({loading: false});
        }
    }

    componentDidMount() {
        const {id} = this.state;
        const {employer_id} = this.props;
        if (id > 0) {
            this.asyncData();
        } else {
            this.setState({loading: false});
        }
        if (employer_id){
            this.getAssignStaff(employer_id);
            this.getEmployer(employer_id);
        }
    }

    _goBack() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    async _getAssignStaff(employer_id) {
        const res = await getList({
            q: employer_id,
            status_not: 99
        });
        if (res && Array.isArray(res.items)) {
            const employer = res.items.find(v=> v.id === Number(employer_id));
            if (employer?.assigned_staff_username) {
                this.setState({login_name: employer.assigned_staff_username})
            }
        }
    }
    async _getEmployer(employer_id) {
        const res = await getList({
            q: employer_id,
            status_not: 99
        })
        if (res && Array.isArray(res.items)) {
            const employer = res.items.find(_=> _.id === Number(employer_id));
            if (employer){
                this.setState({name: `${employer.name}:  Cơ hội mới`});
            }

        }
    }


    render() {
        const {id, initialForm, item, loading, login_name, name} = this.state;
        const { employer_id} = this.props;
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(Constant.MSG_REQUIRED),
            expired_date: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
            ability: Yup.string().required(Constant.MSG_REQUIRED),
        });

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
        dataForm.expired_date = item ? moment.unix(dataForm.expired_date).format("DD/MM/YYYY") : moment().endOf('month').format("DD/MM/YYYY");
        dataForm.vat_percent = dataForm.vat_percent ? dataForm.vat_percent : 10;
        dataForm.staff_email = dataForm.staff_email !== "" ? dataForm.staff_email : login_name;

        // tạo auto fill khi chọn từ ds ở chi tiết ntd
        if (employer_id){
            dataForm.employer_id = employer_id;
            dataForm.name = name;
            dataForm.ability = 3;
        }

        return (
            <div>
                {loading ? <LoadingSmall className="form-loading"/> : (
                    <div className="form-container" style={item?.level === 8 ? {cursor: "not-allowed"} : {}}>
                        <FormBase onSubmit={this.onSubmit}
                                  initialValues={dataForm}
                                  validationSchema={validationSchema}
                                  isEdit={id > 0}
                                  fieldWarnings={[]}
                                  FormComponent={FormComponent}>
                            <div className={"row mt15"}>
                                <div className="col-sm-12">
                                    {item?.level !== 8 && (
                                        <button type="submit" className="el-button el-button-success el-button-small">
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
                )}
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
