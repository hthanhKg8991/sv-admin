import React, {Component} from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import _ from "lodash";
import moment from "moment";
import SpanSystem from "components/Common/Ui/SpanSystem";
import PopOver from "components/Common/Ui/PopOver";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {putToastSuccess} from "actions/uiAction";
import CallPopup from './Popup/CallPopup';
import * as uiAction from "actions/uiAction";
class EmployerBasic extends Component {

    onCallEmployer() {
        const {employerMerge} = this.props;
        this.props.uiAction.createPopup(CallPopup, "Chọn label cuộc gọi",{to_number:employerMerge?.phone})
    }

    render () {
        const {employerMerge} = this.props;
        return (
            <>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                    <div className="col-sm-8 col-xs-8 text-bold">{employerMerge.id}</div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Kênh</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        {Constant.CHANNEL_LIST[String(employerMerge?.channel_code)]}
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Tên NTD</div>
                    <div className="col-sm-8 col-xs-8 text-bold">{employerMerge?.name}</div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Email đăng nhập</div>
                    <div className="col-sm-8 col-xs-8 text-bold">{employerMerge?.email}</div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                    <div className="col-sm-8 col-xs-8 text-bold">{employerMerge?.address}</div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Tỉnh thành</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <SpanSystem value={employerMerge?.province_id} type={"province"} notStyle/>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Địện thoại</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <span className="mr5">{employerMerge?.phone}</span>
                        <CanRender actionCode={ROLES.customer_care_call_employer}>
                            <PopOver renderTitle={<i className='glyphicon glyphicon-earphone cursor-pointer' onClick={this.onCallEmployer.bind(this)} style={{
                                fontSize: "15px",
                                marginLeft: "5px"
                            }}/>}>
                                Nhấn để gọi
                            </PopOver>     
                        </CanRender>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Quy mô nhân sự</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <div>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                        value={_.get(employerMerge, 'company_size')} notStyle/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Mã số thuế</div>
                    <div className="col-sm-8 col-xs-8 text-bold">{employerMerge?.tax_code}</div>
                </div>

                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Loại tài khoản</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <div>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status}
                                        value={_.get(employerMerge, 'premium_status', '')}
                                        notStyle/>
                            {(employerMerge.premium_renewed_at && employerMerge.premium_end_at) ? (
                                <span>
                                    {`(${moment.unix(employerMerge.premium_renewed_at).format("DD/MM/YYYY")} - 
                                    ${moment.unix(employerMerge.premium_end_at).format("DD/MM/YYYY")})`}
                                 </span>
                            ) : <></>}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({putToastSuccess}, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(EmployerBasic);