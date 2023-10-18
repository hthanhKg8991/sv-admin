import React,{Component} from "react";
import SpanPopup from "components/Common/Ui/SpanPopup";
import PopupHistoryViewResume from "pages/CustomerCare/EmployerPage/Popup/PopupHistoryViewResume";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class EmployerViewResume extends Component {
    render () {
        const {employerMerge} = this.props;
        return (
            <CanRender actionCode={ROLES.customer_care_employer_history_view_resume}>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-5 col-xs-5 padding0">Lịch sử xem hồ sơ</div>
                    <div className="col-sm-7 col-xs-7 text-bold">
                        <SpanPopup label={"Xem chi tiết"}
                                   Component={PopupHistoryViewResume}
                                   title={"Lịch Sử Xem Hồ Sơ NTD"}
                                   params={{ object: employerMerge }}/>
                    </div>
                </div>
            </CanRender>
        )
    }
}


export default EmployerViewResume;
