import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MySelect from "components/Common/Ui/Form/MySelect";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getVsic} from "api/system";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import * as utils from "utils/utils";
import _ from "lodash";
import {getCustomerListNew, getCustomerListNewIgnoreChannelCode} from "api/auth";
import CanAction from "components/Common/Ui/CanAction";
import MyCloneField from 'components/Common/Ui/Form/MyCloneField';
import ROLES from "utils/ConstantActionCode";
import { getConfigForm } from "utils/utils";
import { connect } from "react-redux";
import MyTextField from "components/Common/Ui/Form/MyTextField";
class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            configForm: getConfigForm(channelCodeCurrent, "CustomerCare.EmployerPage.Profile"),
        };
    }

    render() {
        const { fieldWarnings, values , errors, setFieldError, branch} = this.props;
        const channel_code = branch.currentBranch.channel_code;
        
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"name"} label={"Tên NTD"}
                                     isWarning={_.includes(fieldWarnings, 'name')}
                                     showLabelRequired/>
                        </CanAction>
                    </div>
                    <div className="col-sm-6 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"email"} label={"Email đăng nhập"}
                                     isWarning={_.includes(fieldWarnings, 'email')}
                                     showLabelRequired/>
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"address"} label={"Địa chỉ"}
                                     isWarning={_.includes(fieldWarnings, 'address')}
                                     showLabelRequired/>
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"province_id"} label={"Tỉnh/ thành phố"}
                                        type={"provinceInForm"}
                                        isWarning={_.includes(fieldWarnings, 'province_id')}
                                        showLabelRequired/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"phone"} label={"Điện thoại"}
                                     isWarning={_.includes(fieldWarnings, 'phone')}
                                     // showLabelRequired={_.includes(configForm, "phone")}
                                     />
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MySelectFetch name={"fields_activity"} label={"Lĩnh vực hoạt động"}
                                           isWarning={_.includes(fieldWarnings, 'fields_activity')}
                                           fetchApi={getVsic}
                                           fetchField={{
                                               value: "id",
                                               label: "name",
                                               groupBy: "parent"
                                           }}
                                           isGroup
                                           isMulti/>
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MySelectFetch name={"fields_activity_additional"} label={"Lĩnh vực hoạt động bổ sung"}
                                           isWarning={_.includes(fieldWarnings, 'fields_activity_additional')}
                                           fetchApi={getVsic}
                                           fetchField={{
                                               value: "id",
                                               label: "name",
                                               groupBy: "parent"
                                           }}
                                           readOnly={true}
                                           isMulti/>
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MySelectSystem name={"company_size"} label={"Quy mô hoạt động"}
                                            isWarning={_.includes(fieldWarnings, 'company_size')}
                                            type={"common"}
                                            valueField={"value"}
                                            idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                            showLabelRequired/>
                        </CanAction>
                    </div>
                    <div className="col-sm-6 mb10">
                        {
                            values?.customer_status === Constant.CUSTOMER_STATUS_ACTIVE
                                ? (
                                    <CanAction actionCode={ROLES.customer_care_employer_update_tax_code}>
                                        <MyField name={"tax_code"} label={"Mã số thuế"}
                                                 isWarning={_.includes(fieldWarnings, 'tax_code')} showLabelRequired />
                                    </CanAction>
                                )
                                :   <MyField name={"tax_code"} label={"Mã số thuế"}
                                             isWarning={_.includes(fieldWarnings, 'tax_code')} showLabelRequired />
                        }

                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-9 mb10">
                        {channel_code === Constant.CHANNEL_CODE_VL24H ? (
                            <MyTextField
                                label={"Sơ lược công ty"}
                                name={"description"}
                            />
                        ) : (
                            <MyField name={"description"} label={"Sơ lược công ty"}
                                     isWarning={_.includes(fieldWarnings, 'description')}
                                     multiline
                                     rows={15}
                            />
                        )}
                    </div>
                    <div className="col-sm-3 mb10">
                        <DropzoneImage label={"Logo"} name={"logo"}
                                       isWarning={_.includes(fieldWarnings, 'logo')}
                                       folder={"employer_avatar"}/>
                    </div>
                </div>
                {/* <CanAction isDisabled={true}>
                    <div className={"row"}>
                        <div className="col-sm-4 mb10">
                            <MySelectFetch name={"assigned_staff_id"} label={"CSKH"}
                                           isWarning={_.includes(fieldWarnings,
                                               'assigned_staff_id')}
                                           fetchApi={getCustomerListNew}
                                           fetchFilter={{
                                               execute: 1,
                                               scopes: 1,
                                               has_room: 1,
                                               includes: "team,room",
                                               withTeam: 1,
                                           }}
                                           fetchField={{ value: "id", label: "login_name" }}/>
                        </div>
                    </div>
                </CanAction> */}
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Liên hệ</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"contact_name"}
                                     isWarning={_.includes(fieldWarnings, 'contact_name')}
                                     label={"Tên người liên hệ"}
                                     showLabelRequired/>
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"contact_email"}
                                     label={"Email liên hệ"}
                                     isWarning={_.includes(fieldWarnings, 'contact_email')}
                                     showLabelRequired/>
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyCloneField
                                errors={errors}
                                setFieldError={setFieldError}
                                value={values?.contact_phone || [""]}
                                name="contact_phone" label={"Số điện thoại liên hệ"}/>
                        </CanAction>
                    </div>
                    <div className="col-sm-6 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"fax"}
                                     isWarning={_.includes(fieldWarnings, 'fax')}
                                     label={"Fax"}/>
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"contact_address"}
                                     isWarning={_.includes(fieldWarnings, 'contact_address')}
                                     label={"Địa chỉ liên hệ"}
                                     // showLabelRequired={_.includes(configForm, "contact_address")}
                                    />
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <CanAction actionCode={ROLES.customer_care_employer_disable_form}>
                            <MyField name={"website"} label={"Website"}
                                     isWarning={_.includes(fieldWarnings, 'website')}/>
                        </CanAction>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MySelectSystem name={"contact_method"} label={"Hình thức liên hệ"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_employer_contact_method}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MyField name={"number_of_employer"} label={"Số thành viên"}
                                 isWarning={_.includes(fieldWarnings, 'number_of_employer')}/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MySelect name={"founded_year"} label={"Năm thành lập"}
                                  isWarning={_.includes(fieldWarnings, 'founded_year')}
                                  options={utils.getOptionYear(50)}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MyField name={"staff_age_range"} label={"Độ tuổi"}
                                 isWarning={_.includes(fieldWarnings, 'staff_age_range')}/>
                    </div>
                    {channel_code === Constant.CHANNEL_CODE_VL24H 
                        ? (
                            <div className="col-sm-6 mb10">
                                <CanAction actionCode={ROLES.customer_care_employer_edit_select_cross_selling}>
                                    <MySelectFetch name={"cross_sale_assign_id"} label={"Nhân viên cross selling"}
                                        isWarning={_.includes(fieldWarnings, 'cross_sale_assign_id')}
                                        fetchApi={getCustomerListNewIgnoreChannelCode}
                                        fetchFilter={{
                                            execute: 1,
                                            // scopes: 1,
                                            // has_room: 1,
                                            // includes: "team,room",
                                            // withTeam: 1,
                                        }}
                                        fetchField={{value: "id", label: "login_name"}}
                                        isCustomRenderOption={true}
                                        fieldsRenderOptionByOrder={["code", "display_name", "login_name"]}
                                        />
                                </CanAction>
                            </div>
                            ) 
                        : null}
                    
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    };
}

export default connect(mapStateToProps, null) (FormComponent);
