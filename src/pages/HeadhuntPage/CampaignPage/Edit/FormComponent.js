import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import {
    getListFullContractRequestHeadhunt,
    getListHeadhuntContract, getListStaffItemsHeadhunt,
} from "api/headhunt";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MyDate from "components/Common/Ui/Form/MyDate";
import moment from "moment";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyCheckboxCampaign from "components/Common/Ui/Form/MyCheckboxCampaign";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            request_detail: [],
        }
        this.onChangeContract = this._onChangeContract.bind(this);
    }

    async _onChangeContract(value) {
        const {setFieldValue} = this.props;
        setFieldValue("contract_request_id", "");
        this.setState({loading: true});
        if (!value) {
            this.setState({request_detail: []});
            return;
        }
        const res = await getListFullContractRequestHeadhunt({contract_id: value});
        if (res) {
            const request_detail = res.map(v => ({
                ...v,
                value: v.id,
                label: `${v.id} - ${v.title}`
            }));
            this.setState({request_detail});
        }
    }

    componentDidMount() {
        const {isEdit, values, setFieldValue} = this.props;
        if (isEdit) {
            this.onChangeContract(values?.contract_id).then(() => {
                setFieldValue("contract_request_id", values?.contract_request_id);
            });
        }
    }

    render() {
        const {values} = this.props;
        const {request_detail} = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-8">
                        <div className="row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin hợp đồng</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MySelectSearch
                                    name="contract_id"
                                    label="Hợp đồng"
                                    searchApi={getListHeadhuntContract}
                                    valueField="id"
                                    labelField="code"
                                    initKeyword={values?.contract_id}
                                    defaultQuery={{status: [Constant.HEADHUNT_CONTRACT_STATUS_SUBMITTED, Constant.HEADHUNT_CONTRACT_STATUS_CONFIRMED, Constant.HEADHUNT_CONTRACT_STATUS_APPROVED]}}
                                    showLabelRequired
                                    onChange={this.onChangeContract}
                                />
                            </div>
                            <div className="col-md-12 mb10">
                                <MySelect showLabelRequired name="contract_request_id"
                                          label="Yêu cầu tuyển dụng"
                                          options={request_detail}
                                />
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin chung</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MyField name={"name"} label={"Campaign Name"}
                                         rows={15}
                                         showLabelRequired/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb10">
                                <MyDate name={"start_date"} label={"Thời gian áp dụng"} minDate={moment()}
                                />
                            </div>
                            <div className="col-md-6 mb10">
                                <MyDate name={"end_date"} label={"Thời gian kết thúc"}
                                        minDate={moment.unix(values.start_date)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb10">
                                <MySelectFetch name={"campaign_group_member_recruiter_main"} label={"Recruiter chính"}
                                               fetchApi={getListStaffItemsHeadhunt}
                                               fetchField={{
                                                   value: "login_name",
                                                   label: "login_name",
                                               }}
                                               fetchFilter={{
                                                   status: Constant.STATUS_ACTIVED,
                                                   division_code: [Constant.DIVISION_TYPE_customer_headhunt_recruiter],
                                                   role: 1,
                                                   per_page: 999
                                               }}
                                               showLabelRequired
                                />
                            </div>
                            <div className="col-md-6 mb10">
                                <MySelectFetch name={"list_campaign_group_member_recruiter"} label={"Recruiter"}
                                               fetchApi={getListStaffItemsHeadhunt}
                                               fetchField={{
                                                   value: "login_name",
                                                   label: "login_name",
                                               }}
                                               fetchFilter={{
                                                   status: Constant.STATUS_ACTIVED,
                                                   division_code: [Constant.DIVISION_TYPE_customer_headhunt_recruiter],
                                                   per_page: 999
                                               }}
                                               isMulti
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb10">
                                <MySelectFetch name={"list_campaign_group_member_sourcer"} label={"Sourcer"}
                                               fetchApi={getListStaffItemsHeadhunt}
                                               fetchField={{
                                                   value: "login_name",
                                                   label: "login_name",
                                               }}
                                               fetchFilter={{
                                                   status: Constant.STATUS_ACTIVED,
                                                   division_code: [Constant.DIVISION_TYPE_customer_headhunt_sourcer],
                                                   per_page: 999
                                               }}
                                               isMulti
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Pipe Status</span>
                            </div>
                        </div>
                        <div className="col-md-12 mb10 d-flex">
                            <MyCheckboxCampaign name="list_campaign_applicant_status"
                                                items={values?.list_status?.map(v => ({
                                                    label: v.name,
                                                    value: v.code
                                                }))}/>
                        </div>
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
