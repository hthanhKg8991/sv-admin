import React, {Component} from "react";
import _ from "lodash";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import moment from "moment";

class EmployerAssignment extends Component {
    render () {
        const {employer, employerMerge} = this.props;
        const created_at = moment.unix(_.get(employer, 'created_at')).format("DD/MM/YYYY HH:mm:ss");
        const assigning_changed_at = employer?.assigning_changed_at ?
            moment.unix(_.get(employer, 'assigning_changed_at')).format("DD/MM/YYYY HH:mm:ss") :
            "Chưa cập nhật";
        const last_logged_in_at = employer?.last_logged_in_at ?
            moment.unix(_.get(employer, 'last_logged_in_at')).format("DD/MM/YYYY HH:mm:ss") :
            "Chưa cập nhật";

        return (
            <>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Ngày vào giỏ</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <span>{assigning_changed_at}</span>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Ngày đăng ký</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <span>{created_at}</span>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Đăng nhập gần nhất</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <span>{last_logged_in_at}</span>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Nguồn tạo</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_created_source}
                                    value={_.get(employerMerge, 'created_source', '')}
                                    notStyle/>
                    </div>
                </div>
            </>
        )
    }
}

export default EmployerAssignment;
