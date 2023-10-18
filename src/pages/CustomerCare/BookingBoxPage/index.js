import React, {Component} from "react";
import BookingBoxHome from "./BookingBoxHome";
import BookingBoxField from "./BookingBoxField";

class index extends Component {
    render () {
        return (
            <div className="col-result-full">
                <div className="box-card box-full">
                    <div className="box-card-title">
                        <span className="title left">Thống Kê Độ Phủ Box</span>
                    </div>
                    <div className="card-body">
                        <div className="badge-body">
                            <span className="badge badge-success">0</span> Đang sử dụng
                        </div>
                        <div className="badge-body">
                            <span className="badge badge-warning">0</span> Đang giữ chổ
                        </div>
                        <div className="badge-body">
                            <span className="badge badge-inverse">0</span> Còn trống
                        </div>
                    </div>
                    <BookingBoxHome />
                    <BookingBoxField />
                </div>
            </div>
        )
    }
}

export default index;
