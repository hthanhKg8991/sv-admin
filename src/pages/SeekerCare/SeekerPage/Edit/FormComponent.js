import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import _ from "lodash";
import MyPassword from "components/Common/Ui/Form/MyPassword";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getCustomerList} from "api/auth";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { fieldWarnings, isEdit } = this.props;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-9 mb10">

                        <div className={"row"}>
                            <div className="col-sm-12 mb10">
                                <MyField name={"name"} label={"Tên NTV"}
                                         isWarning={_.includes(fieldWarnings, 'name')}
                                         showLabelRequired/>
                            </div>
                            <div className="col-sm-12 mb10">
                                <MyField name={"email"} label={"Email"}
                                         isWarning={_.includes(fieldWarnings, 'email')}
                                         showLabelRequired/>
                            </div>
                            {!isEdit &&
                                <div className="col-sm-12 mb10">
                                    <MyPassword name={"password"} label={"Mật khẩu"} type={"password"} showLabelRequired/>
                                </div>
                            }
                            <div className="col-sm-12 mb10">
                                <MyField name={"mobile"} label={"Di động"}
                                         isWarning={_.includes(fieldWarnings, 'mobile')}
                                         showLabelRequired/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3 mb10">
                        <DropzoneImage validationImage={{width:300, height:300, type: Constant.FILE_IMAGE_TYPE, size: 300000}}
                                       label={"Avatar"} name={"avatar"}
                                       isWarning={_.includes(fieldWarnings, 'avatar')}
                                       folder={"seeker_avatar"}
                        />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MyDate name={"birthday"} label={"Ngày sinh"}
                                isWarning={_.includes(fieldWarnings, 'birthday')}
                                showLabelRequired/>
                    </div>
                    <div className="col-sm-3 mb10">
                        <MySelectSystem name={"gender"} label={"Giới tính"}
                                        isWarning={_.includes(fieldWarnings, 'gender')}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_gender}
                                        showLabelRequired/>
                    </div>

                    <div className="col-sm-3 mb10">
                        <MySelectSystem name={"marital_status"} label={"Hôn nhân"}
                                        isWarning={_.includes(fieldWarnings, 'marital_status')}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_marital_status}
                                        showLabelRequired/>
                    </div>
                </div>

                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MyField name={"address"} label={"Địa chỉ"}
                                 isWarning={_.includes(fieldWarnings, 'address')}
                                 showLabelRequired/>
                    </div>
                    <div className="col-sm-3 mb10">
                        <MySelectSystem name={"province_id"} label={"Tỉnh/ thành phố"}
                                        type={"provinceInForm"}
                                        isWarning={_.includes(fieldWarnings, 'province_id')}
                                        showLabelRequired/>
                    </div>
                    {!isEdit && (
                        <div className="col-sm-3 mb10">
                            <MySelectFetch name={"assigned_staff_id"} label={"CSNTV"}
                                           isWarning={_.includes(fieldWarnings,
                                               'assigned_staff_id')}
                                           fetchApi={getCustomerList}
                                           fetchFilter={{
                                               'division_code[0]': Constant.DIVISION_TYPE_seeker_care_leader,
                                               'division_code[1]': Constant.DIVISION_TYPE_seeker_care_member,
                                               execute: true,
                                               scopes: true,
                                               status: Constant.STATUS_ACTIVED,
                                           }}
                                           fetchField={{ value: "id", label: "login_name" }}
                                           showLabelRequired/>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProp(state) {
    return {
        branch: state.branch
    }
}


export default connect(mapStateToProp, null)(FormComponent);
