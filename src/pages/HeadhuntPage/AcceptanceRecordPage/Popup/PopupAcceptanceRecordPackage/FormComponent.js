import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyDate from "components/Common/Ui/Form/MyDate";
import {
    getListFullContractRequestHeadhunt,
    getListFullHeadhuntApplicant, getListHeadhuntContract,
} from "api/headhunt";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applicant: [],
            recruiter: [],
            guarantee: [],
            contract_request: [],
        };
        this.getDataSelectBox = this._getDataSelectBox.bind(this);
        this.onChangeContract = this._onChangeContract.bind(this);
        this.onChangeApplicant = this._onChangeApplicant.bind(this);
    }

    async _getDataSelectBox(contract_id) {
        const {setFieldValue} = this.props;
        if (contract_id) {
            const [resApplicant, resContractRequest] = await Promise.all([
                getListFullHeadhuntApplicant({
                    contract_id,
                    applicant_acceptance: true,
                    exclude_applicant_approved: true
                }),
                getListFullContractRequestHeadhunt({
                    contract_id,
                }),
            ])

            if (resApplicant) {
                const applicant = resApplicant.map(v => ({
                    value: v.id,
                    label: `${v.id} - ${v.seeker_name}`,
                    recruiter_staff_login_name: v.recruiter_staff_login_name,
                    guarantee_applicant_info: v.guarantee_applicant_info,
                }));
                this.setState({applicant});
            }
            if (resContractRequest) {
                const contract_request = resContractRequest.map(v => ({
                    value: v.id,
                    label: `${v.id} - ${v.title}`,
                }));
                this.setState({contract_request});
            }
        } else {
            setFieldValue("applicant_id", "")
            setFieldValue("acceptance_position", "")
        }
    }

    async _onChangeApplicant(value) {
        const {setFieldValue} = this.props;
        if (value) {
            const {applicant} = this.state;
            const selected = applicant.find(v => v.value === value);
            if (selected) {
                this.setState({
                    recruiter: [{
                        value: selected.recruiter_staff_login_name,
                        label: selected.recruiter_staff_login_name
                    }],
                    guarantee: selected.guarantee_applicant_info ? [{
                        value: selected.guarantee_applicant_info?.id,
                        label: `${selected.guarantee_applicant_info?.id} - ${selected.guarantee_applicant_info?.seeker_name}`
                    }] : [],
                })
                setFieldValue("recruiter_staff_login_name", selected.recruiter_staff_login_name);
                if (selected.guarantee_applicant_info) {
                    setFieldValue("guarantee_applicant", selected.guarantee_applicant_info.id);
                }
                setFieldValue("type", selected.guarantee_applicant_info ? Constant.HEADHUNT_ACCEPTANCE_RECORD_TYPE_GUARANTEE : Constant.HEADHUNT_ACCEPTANCE_RECORD_TYPE_NEW);
            }
        } else {
            this.setState({
                recruiter: [],
                guarantee: [],
            })
            setFieldValue("recruiter_staff_login_name", '');
            setFieldValue("guarantee_applicant", '');
            setFieldValue("type", '');
        }
    }

    async _onChangeContract(value) {
        this.getDataSelectBox(value);
    }

    componentDidMount() {
        const {values} = this.props;
        this.getDataSelectBox(values.contract_id).then(() => this.onChangeApplicant(values.applicant_id));
    }

    render() {
        const {applicant, guarantee, recruiter, contract_request} = this.state;
        const {values, isEdit} = this.props;
        const {contract_id, sales_order_item, contract_request_id} = values;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSearch name={"contract_id"}
                                        label={"Chọn mã hợp đồng"}
                                        searchApi={getListHeadhuntContract}
                                        initKeyword={contract_id}
                                        valueField={"id"}
                                        labelField={"code"}
                                        readOnly
                                        onChange={this.onChangeContract}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelect name={"applicant_id"}
                                  label={"Chọn Applicant"}
                                  options={applicant}
                                  onChange={this.onChangeApplicant}
                                  showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelect name={"recruiter_staff_login_name"}
                                  readOnly
                                  options={recruiter}
                                  label="Recruiter" showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelect name={"contract_request_id"}
                                  options={contract_request}
                                  showLabelRequired
                                  label="Vị trí tuyển dụng"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"acceptance_date_confirmed"} label="Ngày hoàn thành"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"acceptance_status"} label="Tình trạng"
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name={"acceptance_fee"} label="Mức phí dịch vụ"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 mb10">
                        <MySelectSystem
                            label="Loại"
                            name={"type"}
                            type={"common"}
                            valueField={"value"}
                            readOnly
                            idKey={Constant.COMMON_DATA_KEY_headhunt_acceptance_record_type}
                            showLabelRequired
                        />
                    </div>
                    <div className="col-md-3 mb10">
                        <MySelect name={"guarantee_applicant"}
                                  readOnly
                                  options={guarantee}
                                  label="Bảo hành cho ứng viên"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelect
                            label="Item"
                            name={"sales_order_item_id"}
                            options={sales_order_item}
                            showLabelRequired
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
