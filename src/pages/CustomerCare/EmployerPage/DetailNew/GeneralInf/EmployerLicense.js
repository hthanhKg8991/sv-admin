import React,{Component} from "react";
import _ from "lodash";
import SpanPopup from "components/Common/Ui/SpanPopup";
import PopupBusinessLicense from "pages/CustomerCare/EmployerPage/Popup/PopupBusinessLicense";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import PopOver from "components/Common/Ui/PopOver";

class EmployerLicense extends Component {
    render () {
        const {employerMerge, riverObject} = this.props;
        return (
            <div className="col-sm-12 col-xs-12 row-content padding0">
                <div className="col-sm-4 col-xs-4 padding0">GPKD</div>
                <div className="col-sm-8 col-xs-8 text-bold">
                    {_.get(employerMerge,
                        ['business_license_info', 'business_license_file']) ? (
                        <>
                            <SpanPopup label={"Xem chi tiết"}
                                       Component={PopupBusinessLicense}
                                       title={"Giấy Phép Kinh Doanh NTD"}
                                       params={{ object: employerMerge }}/>
                            {" "}
                            <SpanCommon
                                idKey={Constant.COMMON_DATA_KEY_employer_business_license_status}
                                value={_.get(employerMerge,
                                    ['business_license_info', 'business_license_status'])}
                            />
                            {!Constant.RIVAL_TYPE_DONT_SHOW_WARNING.includes(employerMerge?.rival_type) &&
                                <PopOver renderTitle={<i className='glyphicon glyphicon-warning-sign text-danger' style={{
                                    fontSize: "15px",
                                    marginLeft: "5px"
                                }}/>}>
                                    {riverObject?.name || "Chưa duyệt"}
                                </PopOver>
                            }
                        </>
                    ) : (
                        <>
                            <span className="mr5">Chưa có</span>
                            <SpanPopup label={"Thêm"}
                                       Component={PopupBusinessLicense}
                                       title={"Giấy Phép Kinh Doanh NTD"}
                                       params={{ object: employerMerge }}/>
                        </>
                    )}

                </div>
            </div>
        )
    }
}


export default EmployerLicense;
