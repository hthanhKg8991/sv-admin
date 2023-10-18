import React,{Component} from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import _ from "lodash";

class EmployerEmail extends Component {
    constructor(props) {
        super(props);
        this.onViewDetail = this._onViewDetail.bind(this);
    }

    _onViewDetail(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER,
            search: '?action=history_verify_email&id='+ id
        });
    }

    render () {
        const {employerMerge, sendMailVerify} = this.props;
        const isSendEmail = _.get(employerMerge, 'email_verified_status') === Constant.MAIL_NOT_VERIFIED &&
            ![Constant.STATUS_LOCKED].includes(_.get(employerMerge, 'status'));
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-4 col-xs-4 padding0">Trạng thái email</div>
                <div className="col-sm-8 col-xs-8 text-bold">
                    <span className={"mr5"}>
                         <SpanCommon
                             idKey={Constant.COMMON_DATA_KEY_employer_email_verified_status}
                             value={_.get(employerMerge, 'email_verified_status')} notStyle />
                    </span>
                    {isSendEmail && (
                        <CanRender actionCode={ROLES.customer_care_employer_resend_email}>
                           <span className="text-underline text-primary pointer ml10 mr5" onClick={sendMailVerify}>
                                Gửi email xác thực
                           </span><br/>
                        </CanRender>
                    )}
                    <CanRender actionCode={ROLES.customer_care_employer_history_email_verify}>
                        <span className={"text-link font-weight-bold"} onClick={() => this.onViewDetail(employerMerge?.id)}>
                            Xem chi tiết
                        </span>
                    </CanRender>
                </div>
            </div>
        )
    }
}


export default EmployerEmail;
