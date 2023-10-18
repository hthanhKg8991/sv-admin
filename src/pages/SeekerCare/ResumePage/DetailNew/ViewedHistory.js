import React from "react";
import moment from "moment";

class ViewedHistory extends React.Component {
    render() {
        const { resume } = this.props;
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-4 col-xs-4 padding0">Người xem gần nhất</div>
                <div className="col-sm-8 col-xs-8 text-bold">
                    {resume?.staff_view_resume_info?.staff_username || "Chưa cập nhật"}
                    {resume?.staff_view_resume_info?.staff_username ?
                        ` - ${moment.unix(resume?.staff_view_resume_info?.updated_at).format("DD-MM-YYYY HH:mm:ss")}` : ''}
                </div>
            </div>
        )
    }
}

export default ViewedHistory;
