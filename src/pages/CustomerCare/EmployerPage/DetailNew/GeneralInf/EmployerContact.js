import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import PopOver from "components/Common/Ui/PopOver";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {putToastSuccess, hideSmartMessageBox, SmartMessageBox} from "actions/uiAction";
import CallPopup from './Popup/CallPopup'
import {
    reSendOtpViewResumePoint,
    
} from "api/employer";
class EnployerContact extends Component {
    constructor(props) {
        super(props);
      
        this.onSendMailOTP = this._onSendMailOTP.bind(this);
    }

    async onCallEmployer() {
        const {employerMerge} = this.props;
        this.props.uiAction.createPopup(CallPopup, "Chọn label cuộc gọi",{to_number:employerMerge?.contact_info?.contact_phone?.join()})
    }

    _onSendMailOTP(){
        const { actions, employerMerge, idKey} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có xác nhận gửi email OTP?',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await reSendOtpViewResumePoint({ employer_id: employerMerge.id });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }

                actions.hideSmartMessageBox();
            }
        });
    }

    render() {
        const {employerMerge} = this.props;
        return (
            <>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Tên liên hệ</div>
                    <div className="col-sm-8 col-xs-8 text-bold">{employerMerge?.contact_info?.contact_name}</div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Email liên hệ</div>
                    <div className="col-sm-8 col-xs-8 text-bold">{employerMerge?.contact_info?.contact_email}
                    <CanRender actionCode={ROLES.customer_care_employer_re_send_otp_view_resume_point}>
                        <button type="button "
                                className="el-button el-button-info el-button-small btn-send-mail-otp"
                                onClick={this.onSendMailOTP}>
                            <span>Gửi mail OTP</span>
                        </button>
                    </CanRender>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Điện thoại liên hệ</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <span className="mr5">{employerMerge?.contact_info?.contact_phone?.join() || "Chưa cập nhật"}</span>
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
                <style>{`
                    .btn-send-mail-otp {
                       margin-left: 10px;
                    }
                `}</style>
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch),
    }
}

export default connect(null, mapDispatchToProps)(EnployerContact);
