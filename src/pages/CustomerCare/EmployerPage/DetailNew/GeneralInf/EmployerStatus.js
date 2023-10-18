import React,{Component} from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import PopOver from "components/Common/Ui/PopOver";
import _ from "lodash";

class EmployerStatus extends Component {
    render () {
        const {employerMerge, suspect_reason, suspect_keyword, lock_reason, lock_keyword} = this.props;
        return (
            <>
                <div className="col-sm-12 col-xs-12 row-content padding0">
                    <div className="col-sm-4 col-xs-4 padding0">Trạng thái tài khoản</div>
                    <div className="col-sm-8 col-xs-8 text-bold">
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                    value={_.get(employerMerge, 'status_combine', '')}
                                    notStyle/>

                        {/* popup show suspect reason & suspect keyword */}
                        {(!_.isEmpty(suspect_reason) || !_.isEmpty(suspect_keyword)) && (
                            <PopOver renderTitle={<i className='fa fa-ban' style={{
                                color: "orange",
                                fontSize: "15px",
                                marginLeft: "5px"
                            }}/>}>
                                {!_.isEmpty(suspect_reason) && suspect_reason.map(reason => (
                                    <div key={reason}>
                                        <SpanCommon
                                            idKey={Constant.COMMON_DATA_KEY_employer_suspect_reason}
                                            value={reason} notStyle/>
                                    </div>
                                ))}
                                {!_.isEmpty(suspect_keyword) && (
                                    <React.Fragment>
                                        <p><b>NTD có từ khóa nghi ngờ</b></p>
                                        {suspect_keyword.map(keyword => (
                                            <div key={keyword.id}>- {keyword.title}</div>
                                        ))}
                                    </React.Fragment>
                                )}
                            </PopOver>
                        )}

                        {/* popup show lock reason && lock keyword */}
                        {(!_.isEmpty(lock_reason) || !_.isEmpty(lock_keyword)) && (
                            <PopOver renderTitle={<i className='fa fa-lock'
                                                    style={{
                                                        color: "red",
                                                        fontSize: "15px",
                                                        marginLeft: "5px"
                                                    }}/>}>
                                {!_.isEmpty(lock_reason) && lock_reason.map(reason => (
                                    <div key={reason}>
                                        <SpanCommon
                                            idKey={Constant.COMMON_DATA_KEY_employer_locked_reason}
                                            value={reason} notStyle/>
                                    </div>
                                ))}
                                {!_.isEmpty(lock_keyword) && (
                                    <React.Fragment>
                                        <p><b>NTD có từ khóa nghi ngờ</b></p>
                                        {lock_keyword.map(keyword => (
                                            <div key={keyword.id}>- {keyword.title}</div>
                                        ))}
                                    </React.Fragment>
                                )}
                            </PopOver>
                        )}
                    </div>
                </div>
                {
                    employerMerge?.customer_not_yet_verify && 
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Trạng thái xác thực NTD</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                Customer chưa được verify
                            </div>                
                        </div>
                }
            </>
        )
    }
}


export default EmployerStatus;
