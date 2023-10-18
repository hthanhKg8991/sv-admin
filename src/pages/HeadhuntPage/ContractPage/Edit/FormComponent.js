import React from "react";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {getListFullContractFormHeadhunt, getListHeadhuntCustomer} from "api/headhunt";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MyField from "components/Common/Ui/Form/MyField";
import MyUpload from "components/Common/Ui/Form/MyUpload";
import MyCheckbox from "components/Common/Ui/Form/MyCheckbox";
import {getListStaffItems} from "api/auth";
import * as Constant from "utils/Constant";
import moment from "moment";
import MySelect from "components/Common/Ui/Form/MySelect";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staff: [],
        }
        this.asyncData = this._asyncData.bind(this);
    }

    async _asyncData() {
        const res = await getListStaffItems({
            status: Constant.STATUS_ACTIVED,
            division_code: Constant.DIVISION_TYPE_customer_headhunt_sale,
            per_page: 999
        });
        if (res) {
            const staff = res.map(v => ({value: v.login_name, label: `${v.code} - ${v.display_name} - ${v.email}`}))
            this.setState({staff})
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {values, isEdit} = this.props;
        const {staff} = this.state;
        const readOnly = {readOnly: true, style: {background: "#f1f1f1", lineHeight: "16px"}};
        return (
            <React.Fragment>
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-sm-12 sub-title-form mb10">
                            <span>Thông tin chung</span>
                        </div>
                    </div>

                    <div className="row">
                        {isEdit && (
                            <div className="col-md-12 mb10">
                                <MyField name="code" label="Mã hợp đồng"
                                         // InputProps={readOnly}
                                     showLabelRequired/>
                            </div>
                        )}
                        <div className="col-md-12 mb10">
                            <MySelectSearch
                                name="customer_id"
                                label="Khách hàng"
                                searchApi={getListHeadhuntCustomer}
                                valueField="id"
                                labelField="company_name"
                                initKeyword={values?.customer_id}
                                showLabelRequired
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MyDate name="date_at" label="Ngày hợp đồng"
                                    minDate={moment()}
                                    showLabelRequired/>
                        </div>
                        <div className="col-md-12 mb10">
                            <MyDate name="date_expired_at" label="Ngày hết hạn hợp đồng"
                                    showLabelRequired/>
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelectFetch name="contract_form_id"
                                           label="Mẫu hợp đồng"
                                           fetchApi={getListFullContractFormHeadhunt}
                                           fetchField={{value: "id", label: "name"}}
                            />
                        </div>
                        {isEdit && (
                            <>
                                <div className="col-md-12 mb10">
                                    <MySelect name={"sale_staff_login_name"} label={"Sale"}
                                              fetchApi={getListStaffItems}
                                              fetchField={{
                                                  value: "login_name",
                                                  label: "login_name",
                                              }}
                                              options={staff}
                                    />
                                </div>
                                <div className="col-md-12 mb10">
                                    <MyUpload name="contract_url" label="File hợp đồng gốc"
                                              showLabelRequired={!this.props.isEdit}
                                              validateType={['pdf', 'docx']}
                                              maxSize={10}
                                              viewFile
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {isEdit && (
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin khách hàng</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb10">
                                <MyField name="company_name"
                                         InputProps={readOnly}
                                         label="Tên công ty"/>
                            </div>
                            <div className="col-md-12 mb10">
                                <MyField name="tax_code" InputProps={readOnly}
                                         label="Mã số thuế"/>
                            </div>
                            <div className="col-md-12 mb10">
                                <MyField name="address" InputProps={readOnly}
                                         label="Địa chỉ"/>
                            </div>
                            <div className="col-md-12 mb10">
                                <MyField name="representative" label="Người đại diện"/>
                            </div>
                            <div className="col-md-12 mb10">
                                <MyField name="representative_email" label="Thư điện tử"/>
                            </div>
                            <div className="col-md-12 mb10">
                                <MyCheckbox name="other_template" items={[{label: "Mẫu hợp đồng khác", value: 1}]}/>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

export default FormComponent;
