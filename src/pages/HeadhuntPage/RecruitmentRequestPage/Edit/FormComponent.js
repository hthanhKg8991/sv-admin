import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {
    getListFullHeadhuntContractAppendix, getListHeadhuntContract,
    getListHeadhuntCustomerContact,
    getListHeadhuntCustomerFull
} from "api/headhunt";
import MySelect from "components/Common/Ui/Form/MySelect";
import * as Constant from "utils/Constant";
import {getListStaffItems} from "api/auth";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contact : [],
            contract : [],
            contract_appendix : [],
        };
        this.onChangeCustomer = this._onChangeCustomer.bind(this);
        this.onChangeContract = this._onChangeContract.bind(this);
    }
    async _onChangeCustomer (value) {
        if (value > 0){
            const [resContact, resContract] = await Promise.all([
                getListHeadhuntCustomerContact({customer_id: value , per_page: 999, status: Constant.STATUS_ACTIVED}),
                getListHeadhuntContract({customer_id: value , per_page: 999, status: Constant.STATUS_ACTIVED}),
            ]);
            if (resContact && resContract){
                const contact = resContact.items.map(v=> ({value: v.id, label: v.name}))
                const contract = resContract.items.map(v=> ({value: v.id, label: v.name}))
                this.setState({contact, contract})
            }
        }else {
            this.setState({contact: [], contract: []})
        }
    }
    async _onChangeContract (value) {
        let res = null;
        if (value > 0){
            res = await getListFullHeadhuntContractAppendix({contract_id: value})
        }
        if (res){
            const contract_appendix = res.map(v=> ({value: v.id, label: v.name}))
            this.setState({contract_appendix})
        }else {
            this.setState({contract_appendix: []})
        }
    }
    componentDidMount() {
        const {isEdit, values} = this.props;
        if (isEdit){
         this.onChangeCustomer(values.customer_id);
         this.onChangeContract(values.contract_id);
        }
    }

    render() {
        const {contact, contract_appendix, contract} = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin chung</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MyDate name={"request_at"} label={"Ngày request"} showLabelRequired/>
                            </div>
                            <div className="col-md-12 mb10">
                                <MyDate name={"deadline_at"} label={"Deadline"} />
                            </div>
                            <div className="col-md-12 mb10">
                                <MyField name={"request_value"} label={"Giá trị request"} />
                            </div>
                            <div className="col-md-12 mb10">
                                <MyField name={"note"} label={"Note"} type={"textarea"} multiline={true} rows={8}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin khách hàng</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MySelectFetch
                                    name={"customer_id"}
                                    label={"Customer"}
                                    fetchApi={getListHeadhuntCustomerFull}
                                    fetchField={{
                                       value: "id",
                                       label: "company_name",
                                    }}
                                    fetchFilter={{
                                        status: Constant.STATUS_ACTIVED,
                                        per_page: 999
                                    }}
                                    onChange={this.onChangeCustomer}
                                    showLabelRequired/>
                            </div>
                            <div className="col-md-12 mb10">
                                <MySelect
                                    name={"list_customer_contact_id"}
                                    label={"Contact"}
                                    options={contact}
                                    isMulti
                                    />
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Người chăm sóc</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MySelectFetch name={"list_sale_staff_login_name"} label={"Sale"}
                                               fetchApi={getListStaffItems}
                                               fetchField={{
                                                   value: "login_name",
                                                   label: "login_name",
                                               }}
                                               fetchFilter={{
                                                   status: Constant.STATUS_ACTIVED,
                                                   division_code: Constant.DIVISION_TYPE_customer_headhunt_sale,
                                                   per_page: 999
                                               }}
                                               isMulti
                                />
                            </div>
                            <div className="col-md-12 mb10">
                                <MySelectFetch name={"list_recruiter_staff_login_name"} label={"Recruiter"}
                                               fetchApi={getListStaffItems}
                                               fetchField={{
                                                   value: "login_name",
                                                   label: "login_name",
                                               }}
                                               fetchFilter={{
                                                   status: Constant.STATUS_ACTIVED,
                                                   division_code: Constant.DIVISION_TYPE_customer_headhunt_recruiter,
                                                   per_page: 999
                                               }}
                                               isMulti
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin hợp đồng</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MySelect
                                    name={"contract_id"}
                                    label={"Hợp đồng"}
                                    options={contract}
                                    onChange={this.onChangeContract}
                                />
                            </div>
                            <div className="col-md-12 mb10">
                                <MySelect
                                    name={"contract_appendix_id"}
                                    label={"Phụ lục hợp đồng"}
                                    options={contract_appendix}
                                />
                            </div>

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
