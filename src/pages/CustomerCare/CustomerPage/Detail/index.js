import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import SpanCommon from "components/Common/Ui/SpanCommon";
import SpanSystem from "components/Common/Ui/SpanSystem";
import * as Constant from "utils/Constant";

class Detail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {room_list, vsic_list, item} = this.props

        return (
            <div className="row content-box mt15">
                <div className="col-sm-6 col-xs-6">
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên Company</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.name}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tỉnh thành</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                        {!!item?.province_id && <SpanSystem value={item?.province_id} type={"province"} notStyle/>}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.address}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Lĩnh vực hoạt động</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                        {   
                            Array.isArray(vsic_list) 
                                ? vsic_list.filter(v => Array.isArray(item?.fields_activity) &&
                                    item?.fields_activity.includes(v?.id)).map(m => m?.name).join(", ") 
                                : null
                        }   
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Quy mô</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon value={item?.company_kind} idKey={Constant.COMMON_DATA_KEY_employer_company_size} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Phân loại Customer</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon value={item?.fraud_status} idKey={Constant.COMMON_DATA_KEY_fraud_status}/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xs-6">
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.code}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Loại mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_type_code}
                                        value={item?.type_code} notStyle /></div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon name="status" idKey={Constant.COMMON_DATA_KEY_company_status}
                                            value={item?.status} />
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Phòng</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {room_list.find(room => item?.room_id == room?.id)?.name || ''}    
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">CSKH</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{item?.assigned_staff_username}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, null)(Detail);
